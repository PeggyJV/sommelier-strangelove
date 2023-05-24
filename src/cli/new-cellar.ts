import * as fs from "fs/promises"
import * as path from "path"

import { CodeGenerator } from "@babel/generator"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import * as t from "@babel/types"
import { format } from "prettier"

import assert from "assert"

import * as p from "@clack/prompts"

const abis = {
  cellarRouterV0815: "cellarRouterV0815",
  cellarRouterV0816: "cellarRouterV0816",
  cellarStakingV0815: "cellarStakingV0815",
  cellarV0815: "cellarV0815",
  cellarV0816: "cellarV0816",
  gravityBridge: "gravityBridge",
  erc20ABI: "erc20ABI",
}

// #region
const cwd = (...args: string[]) => {
  return path.resolve(path.join(process.cwd(), ...args))
}
const load = async (...args: string[]) => {
  const path = cwd(...args)
  const content = await fs.readFile(path, { encoding: "utf-8" })
  return { path, content }
}
// #endregion

const run = async () => {
  p.intro("sommelier codemod - new cellar")

  const inputs = await p.group({
    name: () => p.text({ message: "Cellar name" }),
    slug: () => p.text({ message: "Cellar slug" }),
    address: () =>
      p.text({ message: "Cellar address", initialValue: "0x" }),
    abi: () =>
      p.select({
        message: "Cellar contract",
        initialValue: abis.cellarV0816,
        options: Object.values(abis).map((abi) => ({
          label: abi,
          value: abi,
        })),
      }),
  })

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

  traverse(configAst as any, {
    ObjectProperty: (leaf) => {
      if (t.isIdentifier(leaf.node.key, { name: "CONTRACT" })) {
        assert(t.isObjectExpression(leaf.node.value))
        // console.dir(leaf.node.value.properties, { depth: Infinity })

        leaf.node.value.properties.push(
          t.objectProperty(
            t.identifier(inputs.name),
            t.objectExpression([
              t.objectProperty(
                t.identifier("ADDRESS"),
                t.valueToNode(inputs.address)
              ),
              t.objectProperty(
                t.identifier("SLUG"),
                t.valueToNode(inputs.slug)
              ),
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

  const { code } = new CodeGenerator(configAst, {
    retainFunctionParens: true,
    retainLines: true,
  }).generate()
  await fs.writeFile(
    configFile.path,
    format(code, { parser: "babel" }),
    "utf-8"
  )

  s.stop("Created new cellar! ✅")

  p.note(
    `TODO:
- ${strategiesIndexFile.path}
- ${cellarDataMapFile.path}`.trim()
  )
  p.outro(`Your new cellar is created! 🎉`)
}

void run()
