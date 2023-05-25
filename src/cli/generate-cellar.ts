import * as fs from "fs/promises"
import * as path from "path"

import { CodeGenerator } from "@babel/generator"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import * as t from "@babel/types"
import { format, resolveConfigFile } from "prettier"
import * as c from "case"

import assert from "assert"

import * as p from "@clack/prompts"
import * as pc from "picocolors"
import { prettier as prettierConfig } from "package.json"

resolveConfigFile()

// #region
const cwd = (...args: string[]) => {
  return path.resolve(path.join(process.cwd(), ...args))
}
const load = async (...args: string[]) => {
  const path = cwd(...args)
  const relativePath = path.replace(process.cwd(), "")
  const content = await fs.readFile(path, { encoding: "utf-8" })
  return { path, relativePath, content }
}
// #endregion

// TODO: detect abis from src/abi
const abis = {
  cellarRouterV0815: "cellarRouterV0815",
  cellarRouterV0816: "cellarRouterV0816",
  cellarStakingV0815: "cellarStakingV0815",
  cellarV0815: "cellarV0815",
  cellarV0816: "cellarV0816",
  gravityBridge: "gravityBridge",
  erc20ABI: "erc20ABI",
}

const run = async () => {
  p.intro(pc.bgMagenta("sommelier codemod - new cellar"))

  type InputKeys = "name" | "slug" | "address" | "abi"
  type Inputs = Record<InputKeys, string | symbol>

  const inputs = await p.group<Inputs>(
    {
      name: () => {
        return p.text({
          message: "Cellar name (transformed to CONSTANT_CASE)",
          validate: (value) => {
            if (!value) return "Cellar name is required"
          },
        })
      },
      slug: ({ results }) => {
        assert(results.name)
        return p.text({
          message:
            "Cellar slug (transformed to kebab-case, delete if not using slug)",
          initialValue: c.header(results.name),
        })
      },
      address: () => {
        return p.text({
          message: "Cellar address (e.g. 0x123...)",
          placeholder: "0x1234567890123456789012345678901234567890",
          validate: (value) => {
            if (!/^0x[0-9]{40}/.test(value)) {
              return "Address must be a valid ethereum address"
            }
          },
        })
      },
      abi: () => {
        return p.select({
          message: "Cellar contract (refer to src/abi)",
          initialValue: abis.cellarV0816,
          options: Object.values(abis).map((abi) => ({
            label: abi,
            value: abi,
          })),
        })
      },
    },
    {
      onCancel: () => {
        p.cancel("Aborting cellar creation. 👋")
        process.exit(1)
      },
    }
  )

  const s = p.spinner()
  s.start("Creating new cellar")

  const configFile = await load("src/utils/config.ts")
  const strategiesIndexFile = await load(
    "src/data/strategies/index.ts"
  )
  const cellarDataMapFile = await load("src/data/cellarDataMap.ts")

  const configAst = parse(configFile.content, {
    sourceType: "module",
  })

  traverse(configAst, {
    ObjectProperty: (leaf) => {
      if (t.isIdentifier(leaf.node.key, { name: "CONTRACT" })) {
        assert(t.isObjectExpression(leaf.node.value))
        // console.dir(leaf.node.value.properties, { depth: Infinity })

        leaf.node.value.properties.push(
          t.objectProperty(
            t.identifier(c.constant(inputs.name)),
            t.objectExpression([
              t.objectProperty(
                t.identifier("ADDRESS"),
                t.valueToNode(inputs.address)
              ),
              ...(inputs.slug
                ? [
                    t.objectProperty(
                      t.identifier("SLUG"),
                      t.valueToNode(c.header(inputs.slug))
                    ),
                  ]
                : []),
              t.objectProperty(
                t.identifier("ABI"),
                t.identifier(inputs.abi)
              ),
            ])
          )
        )
      }
    },
  })

  const generator = new CodeGenerator(configAst, {
    retainFunctionParens: true,
    retainLines: true,
  })
  let { code } = generator.generate()
  code = format(code, {
    parser: "babel",
    ...prettierConfig,
  })

  await fs.writeFile(configFile.path, code, "utf-8")

  s.stop("Created new cellar! ✅")

  p.note(
    `TODO:
- ${strategiesIndexFile.relativePath}
- ${cellarDataMapFile.relativePath}`.trim()
  )
  p.outro(`Your new cellar is created! 🎉`)
}

void run()
