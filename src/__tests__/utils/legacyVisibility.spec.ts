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

describe("legacyVisibility", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("restoreLegacyVisibility", () => {
    it("should return false when localStorage is not available", () => {
      // Mock window as undefined to simulate SSR
      const originalWindow = global.window
      delete (global as any).window

      const result = restoreLegacyVisibility()
      expect(result).toBe(false)

      // Restore window
      global.window = originalWindow
    })

    it("should return false when localStorage.getItem throws", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage not available")
      })

      const result = restoreLegacyVisibility()
      expect(result).toBe(false)
    })

    it('should return false when stored value is not "1"', () => {
      localStorageMock.getItem.mockReturnValue("0")

      const result = restoreLegacyVisibility()
      expect(result).toBe(false)
    })

    it('should return true when stored value is "1"', () => {
      localStorageMock.getItem.mockReturnValue("1")

      const result = restoreLegacyVisibility()
      expect(result).toBe(true)
    })
  })

  describe("saveLegacyVisibility", () => {
    it("should not call localStorage when window is not available", () => {
      const originalWindow = global.window
      delete (global as any).window

      saveLegacyVisibility(true)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()

      // Restore window
      global.window = originalWindow
    })

    it("should not call localStorage when setItem throws", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage not available")
      })

      saveLegacyVisibility(true)
      // Should not throw
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "legacyVisibility",
        "1"
      )
    })

    it('should store "1" when setting visibility to true', () => {
      saveLegacyVisibility(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "legacyVisibility",
        "1"
      )
    })

    it('should store "0" when setting visibility to false', () => {
      saveLegacyVisibility(false)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "legacyVisibility",
        "0"
      )
    })
  })
})
