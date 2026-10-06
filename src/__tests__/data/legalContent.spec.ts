import {
  privacyPolicyContent,
  userTermsContent,
} from "data/legal"

const expectKeyedContent = (
  content: Array<{ _key?: string; _type?: string }>
) => {
  content.forEach((block) => {
    expect(block._key).toEqual(expect.any(String))
    expect(block._key).not.toHaveLength(0)
    expect(block._type).toEqual(expect.any(String))
    expect(block._type).not.toHaveLength(0)
  })
}

describe("local legal content", () => {
  it("preserves the deployed privacy policy document", () => {
    expect(privacyPolicyContent).toMatchObject({
      _id: "b51262c2-eb5a-4b78-b480-b0bb642915ac",
      _type: "privacyPolicy",
    })
    expect(privacyPolicyContent.content).toHaveLength(74)
    expectKeyedContent(privacyPolicyContent.content)
  })

  it("preserves the deployed user terms document", () => {
    expect(userTermsContent).toMatchObject({
      _id: "135527b3-17d7-49d5-9ace-751ba183c08d",
      _type: "userTerms",
    })
    expect(userTermsContent.content).toHaveLength(148)
    expectKeyedContent(userTermsContent.content)
  })
})
