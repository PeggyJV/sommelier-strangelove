import fs from "node:fs"
import path from "node:path"

type PackageManifest = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const sourceFiles = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return entry.name === "__tests__" ? [] : sourceFiles(filePath)
    }

    return /\.(ts|tsx)$/.test(entry.name) ? [filePath] : []
  })

describe("Sanity dependency boundary", () => {
  it("omits Sanity packages from the manifest", () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
    ) as PackageManifest
    const packages = {
      ...manifest.dependencies,
      ...manifest.devDependencies,
    }

    expect(packages).not.toHaveProperty("next-sanity")
    expect(packages).not.toHaveProperty("sanity-codegen")
  })

  it("has no production source imports for Sanity packages or clients", () => {
    const imports = sourceFiles(path.join(process.cwd(), "src"))
      .map((filePath) => ({
        filePath,
        source: fs.readFileSync(filePath, "utf8"),
      }))
      .filter(({ source }) =>
        /from ["'](?:next-sanity|sanity-codegen|src\/lib\/sanity\/(?:client|queries))["']/.test(
          source
        )
      )

    expect(imports).toEqual([])
  })
})
