import { validateSommelierAddress } from "./validateSommelierAddress"

describe("validateSommelierAddress", () => {
  test("It should validate the address is sommelier correct encoded address", () => {
    const correctSommAddress1 =
      "somm1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x92f9aeq9"
    const wrongSommAddress1 =
      "somm1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x92f9aeff"
    const cosmosHubAddress1 =
      "cosmos1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x929ej430"
    const cosmosHubAddress2 =
      "cosmos1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x929ej4ff"
    const randomChars =
      "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasd"
    const rightPrefixRandomChar =
      "sommsdasdasdasdasdasdasdasdasdasdasdasdasdasd"
    const correctSommAddress2 =
      "somm1zzx7e75jjjcvpscxvset575z2hwpywqlf4p0c3"
    const wrongSommAddress2 =
      "somm1zzx7e75jjjcvpscxvset575z2hwpywqlf4p0gg"

    const correctSommAddress1Res = validateSommelierAddress(
      correctSommAddress1
    )
    const wrongSommAddress1Res =
      validateSommelierAddress(wrongSommAddress1)
    const cosmosHubAddress1Res =
      validateSommelierAddress(cosmosHubAddress1)
    const cosmosHubAddress2Res =
      validateSommelierAddress(cosmosHubAddress2)
    const randomCharsRes = validateSommelierAddress(randomChars)
    const rightPrefixRandomCharRes = validateSommelierAddress(
      rightPrefixRandomChar
    )
    const correctSommAddress2Res = validateSommelierAddress(
      correctSommAddress2
    )
    const wrongSommAddress2Res =
      validateSommelierAddress(wrongSommAddress2)

    expect(correctSommAddress1Res).toBe(true)
    expect(wrongSommAddress1Res).toBe(false)
    expect(cosmosHubAddress1Res).toBe(false)
    expect(cosmosHubAddress2Res).toBe(false)
    expect(randomCharsRes).toBe(false)
    expect(rightPrefixRandomCharRes).toBe(false)
    expect(correctSommAddress2Res).toBe(true)
    expect(wrongSommAddress2Res).toBe(false)
  })
})
