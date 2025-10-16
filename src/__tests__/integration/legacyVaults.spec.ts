import {
  restoreLegacyVisibility,
  saveLegacyVisibility,
} from "../../utils/legacyVisibility"

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("Legacy Vaults Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("localStorage persistence", () => {
    it("should persist user choice to localStorage when showing", () => {
      // Simulate user clicking "Show legacy vaults"
      saveLegacyVisibility(true)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "legacyVisibility",
        "1"
      )
    })

    it("should persist user choice to localStorage when hiding", () => {
      // Simulate user clicking "Hide legacy vaults"
      saveLegacyVisibility(false)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "legacyVisibility",
        "0"
      )
    })

    it("should restore user choice from localStorage on page load", () => {
      // Simulate stored preference
      localStorageMock.getItem.mockReturnValue("1")

      const result = restoreLegacyVisibility()
      expect(result).toBe(true)
    })

    it("should default to false when no preference is stored", () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = restoreLegacyVisibility()
      expect(result).toBe(false)
    })
  })

  describe("SSR compatibility", () => {
    it("should handle SSR environment gracefully", () => {
      const originalWindow = global.window
      delete (global as any).window

      // Should not throw in SSR environment
      const result = restoreLegacyVisibility()
      expect(result).toBe(false)

      saveLegacyVisibility(true)
      // Should not call localStorage in SSR

      // Restore window
      global.window = originalWindow
    })
  })

  describe("Error handling", () => {
    it("should handle localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage not available")
      })

      // Should not throw
      expect(() => saveLegacyVisibility(true)).not.toThrow()
    })

    it("should handle localStorage getItem errors gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage not available")
      })

      const result = restoreLegacyVisibility()
      expect(result).toBe(false)
    })
  })
})
