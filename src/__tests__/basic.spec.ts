describe("Basic Test Setup", () => {
  it("should run basic tests", () => {
    expect(1 + 1).toBe(2)
  })

  it("should handle async operations", async () => {
    const result = await Promise.resolve("test")
    expect(result).toBe("test")
  })

  it("should handle environment variables", () => {
    expect(process.env.NEXT_PUBLIC_ALCHEMY_KEY).toBe(
      "test-alchemy-key"
    )
  })
})

