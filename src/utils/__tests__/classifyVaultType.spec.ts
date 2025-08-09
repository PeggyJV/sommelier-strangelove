import { classifyVaultType } from "../classifyVaultType"

describe("classifyVaultType", () => {
  it('should return "legacy" for deprecated vaults', () => {
    const vault = {
      deprecated: true,
      strategyProvider: {
        title: "AlgoLab", // even though this is a new provider
      },
    }
    expect(classifyVaultType(vault)).toBe("legacy")
  })

  it('should return "legacy" for Seven Seas provider', () => {
    const vault = {
      deprecated: false,
      strategyProvider: {
        title: "Seven Seas",
      },
    }
    expect(classifyVaultType(vault)).toBe("legacy")
  })

  it('should return "legacy" for ClearGate provider', () => {
    const vault = {
      strategyProvider: {
        title: "ClearGate",
      },
    }
    expect(classifyVaultType(vault)).toBe("legacy")
  })

  it('should return "legacy" for Patache provider', () => {
    const vault = {
      strategyProvider: {
        title: "Patache",
      },
    }
    expect(classifyVaultType(vault)).toBe("legacy")
  })

  it('should return "legacy" for hybrid provider containing Seven Seas', () => {
    const vault = {
      strategyProvider: {
        title: "Silver Sun Capital Investments & Seven Seas",
      },
    }
    expect(classifyVaultType(vault)).toBe("legacy")
  })

  it('should return "new" for AlgoLab provider', () => {
    const vault = {
      strategyProvider: {
        title: "AlgoLab",
      },
    }
    expect(classifyVaultType(vault)).toBe("new")
  })

  it('should return "new" for unknown provider', () => {
    const vault = {
      strategyProvider: {
        title: "Future Provider",
      },
    }
    expect(classifyVaultType(vault)).toBe("new")
  })

  it('should return "new" for vault with no provider', () => {
    const vault = {}
    expect(classifyVaultType(vault)).toBe("new")
  })

  it('should return "new" for vault with provider but no title', () => {
    const vault = {
      strategyProvider: {},
    }
    expect(classifyVaultType(vault)).toBe("new")
  })
})
