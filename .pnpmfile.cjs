module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix @noble packages versions across all dependencies
      if (pkg.dependencies) {
        if (pkg.dependencies['@noble/hashes']) {
          pkg.dependencies['@noble/hashes'] = '1.8.0'
        }
        if (pkg.dependencies['@noble/curves']) {
          pkg.dependencies['@noble/curves'] = '1.9.1'
        }
      }

      // Fix viem's @noble dependencies specifically
      if (pkg.name === 'viem') {
        pkg.dependencies = {
          ...pkg.dependencies,
          '@noble/hashes': '1.8.0',
          '@noble/curves': '1.9.1'
        }
      }

      // Fix @walletconnect/utils to not bundle its own viem
      if (pkg.name === '@walletconnect/utils') {
        if (pkg.dependencies && pkg.dependencies['viem']) {
          // Force it to use the root viem instead of bundling its own
          pkg.dependencies['viem'] = '^2.33.3'
        }
      }

      // Ensure @walletconnect packages don't bundle conflicting versions
      if (pkg.name && pkg.name.startsWith('@walletconnect/')) {
        if (pkg.dependencies) {
          if (pkg.dependencies['@noble/hashes']) {
            pkg.dependencies['@noble/hashes'] = '1.8.0'
          }
          if (pkg.dependencies['@noble/curves']) {
            pkg.dependencies['@noble/curves'] = '1.9.1'
          }
        }
      }

      return pkg
    }
  }
}
