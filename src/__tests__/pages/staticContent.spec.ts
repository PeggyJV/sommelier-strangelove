import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("static content routes", () => {
  it("renders legal pages from local content without static fetches", () => {
    const privacyPage = readSource("src/pages/privacy-policy.tsx")
    const termsPage = readSource("src/pages/user-terms.tsx")

    expect(privacyPage).toContain("privacyPolicyContent")
    expect(termsPage).toContain("userTermsContent")
    expect(privacyPage).not.toContain("getStaticProps")
    expect(termsPage).not.toContain("getStaticProps")
  })

  it("builds strategy pages without unused remote content", () => {
    const strategyPage = readSource(
      "src/pages/strategies/[id]/index.tsx"
    )
    const pageStrategy = readSource(
      "src/components/_pages/PageStrategy.tsx"
    )
    const removedNames = [
      "sanityClient",
      "faqData",
      "sectionCellars",
      "sectionStrategies",
    ]

    removedNames.forEach((name) => {
      expect(strategyPage).not.toContain(name)
      expect(pageStrategy).not.toContain(name)
    })
    expect(strategyPage).toContain("getStaticPaths")
    expect(strategyPage).toContain("getStaticProps")
  })
})
