module.exports = {
  hooks: {
    readPackage(pkg) {
      // ====================
      // @noble packages fix
      // ====================
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

      // ====================
      // viem version alignment
      // ====================
      // Fix viem's @noble dependencies specifically
      if (pkg.name === "viem") {
        pkg.dependencies = {
          ...pkg.dependencies,
          "@noble/hashes": "1.8.0",
          "@noble/curves": "1.9.1",
        }
      }

      // Ensure all packages use the same viem version
      if (pkg.dependencies && pkg.dependencies["viem"]) {
        // Use workspace version of viem
        pkg.dependencies["viem"] = "^2.33.3"
      }
      if (pkg.peerDependencies && pkg.peerDependencies["viem"]) {
        pkg.peerDependencies["viem"] = "^2.33.3"
      }

      // ====================
      // @keplr-wallet packages fix
      // ====================
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

      // ====================
      // @cosmjs packages fix
      // ====================
      // Ensure all @cosmjs packages use the same versions and noble packages
      if (pkg.name && pkg.name.startsWith("@cosmjs/")) {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }

          // Ensure consistent @cosmjs versions
          Object.keys(pkg.dependencies).forEach((dep) => {
            if (dep.startsWith("@cosmjs/")) {
              // Let pnpm resolve to the hoisted version
              const version = pkg.dependencies[dep]
              if (version && !version.startsWith("workspace:")) {
                pkg.dependencies[dep] = "*"
              }
            }
          })
        }
      }

      // ====================
      // @walletconnect packages fix
      // ====================
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

      // ====================
      // @metamask packages fix
      // ====================
      // Ensure @metamask packages use correct noble versions
      if (pkg.name && pkg.name.startsWith("@metamask/")) {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
        }
      }

      // ====================
      // @scure packages fix
      // ====================
      // @scure packages often depend on @noble packages
      if (pkg.name && pkg.name.startsWith("@scure/")) {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
        }
      }

      // ====================
      // graz package fix
      // ====================
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

      // ====================
      // Wallet SDK packages fix
      // ====================
      // Fix @coinbase/wallet-sdk
      if (pkg.name === "@coinbase/wallet-sdk") {
        if (pkg.dependencies) {
          if (pkg.dependencies["viem"]) {
            pkg.dependencies["viem"] = "^2.33.3"
          }
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
        }
      }

      // Fix @gemini-wallet/core
      if (pkg.name === "@gemini-wallet/core") {
        if (pkg.dependencies) {
          if (pkg.dependencies["viem"]) {
            pkg.dependencies["viem"] = "^2.33.3"
          }
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
        }
      }

      // Fix @base-org/account
      if (pkg.name === "@base-org/account") {
        if (pkg.dependencies) {
          if (pkg.dependencies["viem"]) {
            pkg.dependencies["viem"] = "^2.33.3"
          }
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
          if (pkg.dependencies["@noble/curves"]) {
            pkg.dependencies["@noble/curves"] = "1.9.1"
          }
        }
      }

      // ====================
      // @confio/ics23 fix
      // ====================
      // This package also uses @noble/hashes
      if (pkg.name === "@confio/ics23") {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
        }
      }

      // ====================
      // General crypto libraries fix
      // ====================
      // Fix bitcoinjs-lib and related packages
      if (pkg.name === "bitcoinjs-lib" || pkg.name === "bip39") {
        if (pkg.dependencies) {
          if (pkg.dependencies["@noble/hashes"]) {
            pkg.dependencies["@noble/hashes"] = "1.8.0"
          }
        }
      }

      return pkg
    },
  },
}
