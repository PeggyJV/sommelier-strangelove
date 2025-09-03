module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix @noble packages versions across all dependencies
      if (pkg.dependencies) {
        if (pkg.dependencies["@noble/hashes"]) {
          pkg.dependencies["@noble/hashes"] = "1.8.0"
        }
        if (pkg.dependencies["@noble/curves"]) {
          pkg.dependencies["@noble/curves"] = "1.9.1"
        }
      }

      // Also fix in peerDependencies
      if (pkg.peerDependencies) {
        if (pkg.peerDependencies["@noble/hashes"]) {
          pkg.peerDependencies["@noble/hashes"] = "1.8.0"
        }
        if (pkg.peerDependencies["@noble/curves"]) {
          pkg.peerDependencies["@noble/curves"] = "1.9.1"
        }
      }

      // Fix viem's @noble dependencies specifically
      if (pkg.name === "viem") {
        pkg.dependencies = {
          ...pkg.dependencies,
          "@noble/hashes": "1.8.0",
          "@noble/curves": "1.9.1",
        }
      }

      // Fix all @keplr-wallet packages
      if (pkg.name && pkg.name.startsWith("@keplr-wallet/")) {
        // Force @noble packages to correct versions
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }

          // Prevent nested @keplr-wallet installations by using workspace protocol
          Object.keys(pkg.dependencies).forEach((dep) => {
            if (dep.startsWith("@keplr-wallet/")) {
              // Use * to let pnpm resolve to the hoisted version
              pkg.dependencies[dep] = "*"
            }
          })
        }

        // Also handle peerDependencies for @keplr packages
        if (pkg.peerDependencies) {
          Object.keys(pkg.peerDependencies).forEach((dep) => {
            if (dep.startsWith("@keplr-wallet/")) {
              pkg.peerDependencies[dep] = "*"
            }
          })
        }
      }

      // Specifically fix @keplr-wallet/crypto
      if (pkg.name === "@keplr-wallet/crypto") {
        pkg.dependencies = {
          ...pkg.dependencies,
          "@noble/hashes": "1.8.0",
          "@noble/curves": "1.9.1",
        }
      }

      // Specifically fix @keplr-wallet/cosmos
      if (pkg.name === "@keplr-wallet/cosmos") {
        if (pkg.dependencies) {
          pkg.dependencies = {
            ...pkg.dependencies,
            "@keplr-wallet/crypto": "*",
            "@keplr-wallet/types": "*",
            "@keplr-wallet/common": "*",
            "@keplr-wallet/unit": "*",
            "@noble/hashes": "1.8.0",
            "@noble/curves": "1.9.1",
          }
        }
      }

      // Fix @walletconnect/utils to not bundle its own viem
      if (pkg.name === "@walletconnect/utils") {
        if (pkg.dependencies && pkg.dependencies["viem"]) {
          pkg.dependencies["viem"] = "^2.33.3"
        }
      }

      // Ensure @walletconnect packages don't bundle conflicting versions
      if (pkg.name && pkg.name.startsWith("@walletconnect/")) {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
          if (pkg.dependencies["viem"]) {
            pkg.dependencies["viem"] = "^2.33.3"
          }
        }
      }

      // Fix graz's @keplr-wallet dependencies
      if (pkg.name === "graz") {
        if (pkg.dependencies) {
          Object.keys(pkg.dependencies).forEach((dep) => {
            if (dep.startsWith("@keplr-wallet/")) {
              // Force graz to use root versions of @keplr packages
              pkg.dependencies[dep] = "*"
            }
          })
          // Also ensure noble packages are correct
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
        }
      }

      return pkg
    },
  },
}
