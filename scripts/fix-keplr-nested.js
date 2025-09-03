#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

/**
 * This script removes nested node_modules from packages that commonly cause
 * module resolution issues, particularly with @noble/hashes and @noble/curves.
 * It also creates symlinks where necessary to ensure proper resolution.
 */

const nodeModulesPath = path.join(process.cwd(), "node_modules")

// List of packages that commonly have problematic nested dependencies
const PROBLEMATIC_PACKAGES = [
  "@keplr-wallet",
  "@cosmjs",
  "@walletconnect",
  "@metamask",
  "@coinbase",
  "@gemini-wallet",
  "@base-org",
  "@confio",
  "@scure",
  "graz",
  "wagmi",
  "viem",
  "axios",
]

// Packages that should have symlinks created for them
const SYMLINK_TARGETS = {
  "@keplr-wallet/cosmos": [
    "@keplr-wallet/crypto",
    "@keplr-wallet/common",
    "@keplr-wallet/types",
    "@keplr-wallet/unit",
  ],
  "@keplr-wallet/common": [
    "@keplr-wallet/crypto",
    "@keplr-wallet/types",
  ],
  "@keplr-wallet/unit": ["@keplr-wallet/types"],
}

/**
 * Remove nested node_modules recursively
 */
function removeNestedModules(dir, packageName = "") {
  if (!fs.existsSync(dir)) {
    return
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name)
      const nestedNodeModules = path.join(fullPath, "node_modules")

      if (fs.existsSync(nestedNodeModules)) {
        const relativePath = fullPath.replace(process.cwd(), ".")
        console.log(
          `Removing nested node_modules from ${relativePath}`
        )

        try {
          fs.rmSync(nestedNodeModules, {
            recursive: true,
            force: true,
          })
        } catch (err) {
          console.error(
            `Failed to remove ${relativePath}/node_modules:`,
            err.message
          )
        }
      }

      // Recursively check subdirectories (but not node_modules)
      if (
        entry.name !== "node_modules" &&
        !entry.name.startsWith(".")
      ) {
        removeNestedModules(fullPath, entry.name)
      }
    }
  }
}

/**
 * Create symlinks for packages that need them
 */
function createSymlinks() {
  Object.entries(SYMLINK_TARGETS).forEach(
    ([parentPackage, childPackages]) => {
      const parentPath = path.join(
        nodeModulesPath,
        ...parentPackage.split("/")
      )

      if (!fs.existsSync(parentPath)) {
        return
      }

      const parentNodeModules = path.join(parentPath, "node_modules")

      // Create node_modules directory if it doesn't exist
      if (!fs.existsSync(parentNodeModules)) {
        fs.mkdirSync(parentNodeModules, { recursive: true })
      }

      childPackages.forEach((childPackage) => {
        const sourcePath = path.join(
          nodeModulesPath,
          ...childPackage.split("/")
        )

        if (!fs.existsSync(sourcePath)) {
          return
        }

        // Create organization directory if needed (e.g., @keplr-wallet)
        const parts = childPackage.split("/")
        if (parts.length > 1 && parts[0].startsWith("@")) {
          const orgDir = path.join(parentNodeModules, parts[0])
          if (!fs.existsSync(orgDir)) {
            fs.mkdirSync(orgDir, { recursive: true })
          }
        }

        const targetPath = path.join(
          parentNodeModules,
          ...childPackage.split("/")
        )

        // Remove existing symlink or directory if it exists
        if (fs.existsSync(targetPath)) {
          try {
            fs.rmSync(targetPath, { recursive: true, force: true })
          } catch (err) {
            console.error(
              `Failed to remove existing ${targetPath}:`,
              err.message
            )
          }
        }

        // Create symlink
        try {
          // Use 'junction' on Windows for directory symlinks, 'dir' on Unix
          const symlinkType =
            process.platform === "win32" ? "junction" : "dir"
          fs.symlinkSync(sourcePath, targetPath, symlinkType)
          console.log(
            `Created symlink: ${targetPath.replace(
              process.cwd(),
              "."
            )} -> ${sourcePath.replace(process.cwd(), ".")}`
          )
        } catch (err) {
          console.error(
            `Failed to create symlink for ${childPackage}:`,
            err.message
          )
        }
      })
    }
  )
}

/**
 * Fix noble packages resolution by ensuring they're available where expected
 */
function fixNoblePackages() {
  const noblePackages = ["@noble/hashes", "@noble/curves"]

  noblePackages.forEach((pkg) => {
    const sourcePath = path.join(nodeModulesPath, ...pkg.split("/"))

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Warning: ${pkg} not found in node_modules`)
      return
    }

    // Check if any packages have nested node_modules that might need noble packages
    PROBLEMATIC_PACKAGES.forEach((scope) => {
      const scopePath = path.join(nodeModulesPath, scope)

      if (!fs.existsSync(scopePath)) {
        return
      }

      // If this is a scoped package directory, check its children
      if (scope.startsWith("@")) {
        const entries = fs.readdirSync(scopePath, {
          withFileTypes: true,
        })

        entries.forEach((entry) => {
          if (entry.isDirectory()) {
            const packagePath = path.join(
              scopePath,
              entry.name,
              "node_modules"
            )

            if (fs.existsSync(packagePath)) {
              // Create @noble directory if needed
              const nobleParts = pkg.split("/")
              const nobleOrgDir = path.join(
                packagePath,
                nobleParts[0]
              )

              if (!fs.existsSync(nobleOrgDir)) {
                fs.mkdirSync(nobleOrgDir, { recursive: true })
              }

              const targetPath = path.join(packagePath, ...nobleParts)

              if (!fs.existsSync(targetPath)) {
                try {
                  const symlinkType =
                    process.platform === "win32" ? "junction" : "dir"
                  fs.symlinkSync(sourcePath, targetPath, symlinkType)
                  console.log(
                    `Created noble symlink: ${targetPath.replace(
                      process.cwd(),
                      "."
                    )}`
                  )
                } catch (err) {
                  // Silently fail - not all packages need noble packages
                }
              }
            }
          }
        })
      }
    })
  })
}

/**
 * Main execution
 */
console.log(
  "🔧 Fixing nested dependencies and module resolution issues...\n"
)

// Step 1: Remove nested node_modules from problematic packages
PROBLEMATIC_PACKAGES.forEach((packageName) => {
  const packagePath = path.join(nodeModulesPath, packageName)

  if (fs.existsSync(packagePath)) {
    console.log(`Checking ${packageName} for nested dependencies...`)
    removeNestedModules(packagePath, packageName)
  }
})

// Step 2: Create necessary symlinks
console.log("\n📎 Creating symlinks for proper module resolution...")
createSymlinks()

// Step 3: Fix noble packages
console.log("\n🔗 Ensuring @noble packages are properly linked...")
fixNoblePackages()

// Step 4: Special handling for specific packages
console.log("\n🎯 Applying special fixes...")

// Fix graz nested dependencies
const grazNodeModules = path.join(
  nodeModulesPath,
  "graz",
  "node_modules"
)
if (fs.existsSync(grazNodeModules)) {
  const grazKeplr = path.join(grazNodeModules, "@keplr-wallet")
  if (fs.existsSync(grazKeplr)) {
    console.log("Removing nested @keplr-wallet from graz...")
    fs.rmSync(grazKeplr, { recursive: true, force: true })
  }
}

// Fix axios nested installations
console.log("\n🔧 Fixing axios nested installations...")
const findAndRemoveNestedAxios = (dir) => {
  if (!fs.existsSync(dir)) return

  const axiosPath = path.join(dir, "node_modules", "axios")
  if (fs.existsSync(axiosPath)) {
    const parentName = path.basename(
      path.dirname(path.dirname(axiosPath))
    )
    console.log(`Removing nested axios from ${parentName}`)
    fs.rmSync(axiosPath, { recursive: true, force: true })
  }
}

// Check @cosmjs packages for nested axios
const cosmjsPath = path.join(nodeModulesPath, "@cosmjs")
if (fs.existsSync(cosmjsPath)) {
  const entries = fs.readdirSync(cosmjsPath, { withFileTypes: true })
  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      findAndRemoveNestedAxios(path.join(cosmjsPath, entry.name))
    }
  })
}

// Create symlink for axios if needed in @cosmjs packages
const axiosSource = path.join(nodeModulesPath, "axios")
if (fs.existsSync(axiosSource)) {
  ;["@cosmjs/launchpad", "@cosmjs/tendermint-rpc"].forEach((pkg) => {
    const pkgPath = path.join(nodeModulesPath, ...pkg.split("/"))
    if (fs.existsSync(pkgPath)) {
      const pkgNodeModules = path.join(pkgPath, "node_modules")
      if (!fs.existsSync(pkgNodeModules)) {
        fs.mkdirSync(pkgNodeModules, { recursive: true })
      }

      const axiosLink = path.join(pkgNodeModules, "axios")
      if (!fs.existsSync(axiosLink)) {
        try {
          const symlinkType =
            process.platform === "win32" ? "junction" : "dir"
          fs.symlinkSync(axiosSource, axiosLink, symlinkType)
          console.log(`Created axios symlink for ${pkg}`)
        } catch (err) {
          console.error(
            `Failed to create axios symlink for ${pkg}:`,
            err.message
          )
        }
      }
    }
  })
}

// Fix any remaining nested viem installations
const findAndRemoveNestedViem = (dir) => {
  if (!fs.existsSync(dir)) return

  const viemPath = path.join(dir, "node_modules", "viem")
  if (fs.existsSync(viemPath)) {
    const parentName = path.basename(
      path.dirname(path.dirname(viemPath))
    )
    if (parentName !== "node_modules") {
      console.log(`Removing nested viem from ${parentName}`)
      fs.rmSync(viemPath, { recursive: true, force: true })
    }
  }
}

// Check common locations for nested viem
;[
  "@walletconnect",
  "@wagmi",
  "@coinbase",
  "@gemini-wallet",
  "@base-org",
].forEach((scope) => {
  const scopePath = path.join(nodeModulesPath, scope)
  if (fs.existsSync(scopePath)) {
    const entries = fs.readdirSync(scopePath, { withFileTypes: true })
    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        findAndRemoveNestedViem(path.join(scopePath, entry.name))
      }
    })
  }
})

console.log(
  "\n✅ Fixed nested dependencies and module resolution issues"
)
console.log(
  "📝 If you still encounter module resolution errors, try:"
)
console.log(
  "   1. Clear node_modules and reinstall: rm -rf node_modules pnpm-lock.yaml && pnpm install"
)
console.log("   2. Clear build cache: pnpm build --force")
console.log(
  "   3. For Vercel: Clear build cache in project settings\n"
)
