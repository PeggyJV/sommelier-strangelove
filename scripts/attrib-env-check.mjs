#!/usr/bin/env node
// Node >=18, ESM
// Zero-touch attribution preflight (read-only). No writes to KV.

import { execSync } from "node:child_process"
import {
  existsSync,
  readFileSync,
  appendFileSync,
  writeFileSync,
} from "node:fs"
import { createHash } from "node:crypto"
import { URL as NodeURL } from "node:url"

function log(msg) {
  console.log(msg)
}
function warn(msg) {
  console.warn(msg)
}
function maskHost(u) {
  try {
    return u ? new NodeURL(u).host : ""
  } catch {
    return ""
  }
}

// Minimal dotenv loader (no deps)
function loadEnvLocal(path = ".env.local") {
  const env = {}
  if (!existsSync(path)) return env
  const lines = readFileSync(path, "utf8").split(/\r?\n/)
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    const k = m[1]
    let v = m[2]
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1)
    env[k] = v
  }
  return env
}

function ensureEnvLocalEntries(entries, path = ".env.local") {
  let created = false
  if (!existsSync(path)) {
    writeFileSync(path, "# Local env for development\n")
    created = true
  }
  const current = loadEnvLocal(path)
  const lines = []
  for (const [k, v] of Object.entries(entries)) {
    if (current[k] == null) {
      lines.push(`${k}=${String(v)}`)
    }
  }
  if (lines.length) {
    appendFileSync(
      path,
      `\n# attrib-env-check added\n${lines.join("\n")}\n`
    )
  }
  return { created, appended: lines.length }
}

function run(cmd) {
  try {
    return execSync(cmd, {
      stdio: ["ignore", "pipe", "pipe"],
    }).toString("utf8")
  } catch (e) {
    return ""
  }
}

function parseJSONSafe(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

function getVercelEnvs() {
  const out = run("npx -y vercel@latest env ls --json")
  if (!out)
    return {
      ok: false,
      error: "Vercel CLI not available or not logged in",
    }
  const data = parseJSONSafe(out)
  if (!data)
    return { ok: false, error: "Failed to parse vercel env json" }
  return { ok: true, data }
}

async function httpGet(url, headers = {}) {
  const res = await fetch(url, { headers })
  const txt = await res.text()
  return { status: res.status, body: txt }
}

function summarizeKVPresence(dict) {
  const url = dict.ATTRIB_KV_KV_REST_API_URL || dict.KV_REST_API_URL
  const token =
    dict.ATTRIB_KV_KV_REST_API_TOKEN || dict.KV_REST_API_TOKEN
  return { url, token }
}

function pickHost(u) {
  return maskHost(u)
}

async function main() {
  log("== Attribution preflight (read-only) ==")
  const isCI = process.env.CI === "true"
  let skipVercel = isCI
  if (isCI)
    log(
      "CI mode: skipping Vercel CLI; using environment variables only"
    )

  // 1) Vercel envs (optional)
  let previewEnv = {}
  let prodEnv = {}
  let devEnv = {}
  if (!skipVercel) {
    const ver = getVercelEnvs()
    if (!ver.ok || !ver.data) {
      log(
        "! Vercel CLI returned no envs; falling back to local/CI envs only"
      )
      skipVercel = true
    } else {
      const envs = Array.isArray(ver.data) ? ver.data : []
      const byEnv = {}
      for (const e of envs) {
        // Vercel returns array entries per var; group by target env
        const key = e.key
        for (const tgt of e.targets || []) {
          byEnv[tgt] ||= {}
          byEnv[tgt][key] = e.value
        }
      }
      previewEnv = byEnv.preview || {}
      prodEnv = byEnv.production || {}
      devEnv = byEnv.development || {}
    }
  }

  const localEnv = loadEnvLocal()

  if (!skipVercel) {
    log("Vercel environments detected:")
    log(` - Preview: ${Object.keys(previewEnv).length} vars`)
    log(` - Production: ${Object.keys(prodEnv).length} vars`)
    log(` - Development: ${Object.keys(devEnv).length} vars`)
  }

  // 2) Required presence for Preview/Prod
  function checkPair(dict) {
    const { url, token } = summarizeKVPresence(dict)
    return {
      urlHost: pickHost(url),
      urlPresent: !!url,
      tokenPresent: !!token,
      ok: !!url && !!token,
    }
  }
  const envProvided = process.env
  const prevCheck = skipVercel
    ? checkPair(envProvided)
    : checkPair(previewEnv)
  const prodCheck = skipVercel
    ? checkPair(envProvided)
    : checkPair(prodEnv)

  log("\nKV presence (no secrets):")
  log(
    ` - Preview KV URL host: ${
      prevCheck.urlHost || "missing"
    }, token: ${prevCheck.tokenPresent ? "present" : "missing"}`
  )
  log(
    ` - Production KV URL host: ${
      prodCheck.urlHost || "missing"
    }, token: ${prodCheck.tokenPresent ? "present" : "missing"}`
  )

  // 3) Local hydration (flags + KV from Dev/Preview)
  const desiredLocal = {
    NEXT_PUBLIC_ATTRIBUTION_ENABLED: "true",
    ATTRIBUTION_ALLOW_LOCAL: "true",
  }
  if (!skipVercel) {
    // Prefer development, fallback to preview, then KV_*
    const src = summarizeKVPresence(devEnv)
    const srcFallback = summarizeKVPresence(previewEnv)
    const localHas = summarizeKVPresence(localEnv)
    if (!localHas.url && (src.url || srcFallback.url))
      desiredLocal.ATTRIB_KV_KV_REST_API_URL =
        src.url || srcFallback.url
    if (!localHas.token && (src.token || srcFallback.token))
      desiredLocal.ATTRIB_KV_KV_REST_API_TOKEN =
        src.token || srcFallback.token

    const wrote = ensureEnvLocalEntries(desiredLocal)
    if (wrote.created || wrote.appended) {
      log(
        `\n.env.local updated (${
          wrote.created ? "created" : "appended"
        }) with ${wrote.appended} value(s).`
      )
    } else {
      log("\n.env.local already has required local entries.")
    }
  } else {
    log("\nCI mode: skipping .env.local hydration.")
  }

  // 4) Connectivity (read-only)
  const finalLocal = loadEnvLocal()
  const active = skipVercel
    ? summarizeKVPresence(process.env)
    : summarizeKVPresence(finalLocal)
  let pingOk = false
  if (active.url && active.token) {
    try {
      const ping = await httpGet(
        `${active.url.replace(/\/$/, "")}/ping`,
        {
          Authorization: `Bearer ${active.token}`,
        }
      )
      const ok = ping.status >= 200 && ping.status < 300
      log(`\nKV /ping → ${ping.status} (${ok ? "OK" : "FAIL"})`)
      if (ok) pingOk = true
      const probeKey = `__attrib_probe__:${createHash("sha1")
        .update(String(Date.now()))
        .digest("hex")}`
      const gr = await httpGet(
        `${active.url.replace(/\/$/, "")}/get/${probeKey}`,
        {
          Authorization: `Bearer ${active.token}`,
        }
      )
      log(`KV GET nonexistent key → ${gr.status} (expect 200/204/404`) // content varies by provider
    } catch (e) {
      warn(`KV connectivity error: ${e?.message || e}`)
    }
  } else {
    warn(
      "\nLocal KV URL/TOKEN not found; skipping connectivity check."
    )
  }

  // 5) Host gating sanity
  const suffix =
    (skipVercel
      ? process.env.ATTRIBUTION_ALLOW_HOST_SUFFIXES
      : finalLocal.ATTRIBUTION_ALLOW_HOST_SUFFIXES) || ""
  if (!suffix.includes(".vercel.app")) {
    warn(
      "\nPreview host suffix .vercel.app is not in ATTRIBUTION_ALLOW_HOST_SUFFIXES. Add it for preview tests."
    )
  } else {
    log("\nPreview host suffix .vercel.app present in allowlist.")
  }

  // 6) Summary
  const haveUrlToken = !!active.url && !!active.token
  const pass = skipVercel
    ? haveUrlToken && pingOk
    : prevCheck.ok && prodCheck.ok && pingOk
  const ok = !!pass
  log("\n=== RESULT ===")
  if (ok) {
    log(
      "PASS: attribution envs look good; local flags set; KV ping OK."
    )
  } else {
    log("FAIL: see actionable items below:")
    if (!skipVercel) {
      if (!prevCheck.ok)
        warn(
          " - Preview: ensure both URL and TOKEN are set (ATTRIB_* preferred, KV_* fallback)."
        )
      if (!prodCheck.ok)
        warn(
          " - Production: ensure both URL and TOKEN are set (ATTRIB_* preferred, KV_* fallback)."
        )
    } else if (!haveUrlToken) {
      warn(
        " - Local/CI: ensure URL and TOKEN are exported (ATTRIB_* preferred, KV_* fallback)."
      )
    }
    if (!pingOk)
      warn(
        " - Local KV /ping failed; verify URL/TOKEN and network egress."
      )
  }
  // Machine-friendly summary and exit code
  console.log(`RESULT=${ok ? "PASS" : "FAIL"}`)
  process.exitCode = ok ? 0 : 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
