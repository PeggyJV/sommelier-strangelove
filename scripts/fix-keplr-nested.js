#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * This script removes nested node_modules from @keplr-wallet packages
 * to prevent version conflicts and module resolution issues.
 */

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const keplrPath = path.join(nodeModulesPath, '@keplr-wallet');

function removeNestedModules(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      const nestedNodeModules = path.join(fullPath, 'node_modules');

      if (fs.existsSync(nestedNodeModules)) {
        console.log(`Removing nested node_modules from ${fullPath.replace(process.cwd(), '.')}`);
        fs.rmSync(nestedNodeModules, { recursive: true, force: true });
      }
    }
  }
}

// Remove nested node_modules from all @keplr-wallet packages
if (fs.existsSync(keplrPath)) {
  console.log('Checking for nested @keplr-wallet dependencies...');
  removeNestedModules(keplrPath);
}

// Also check for nested @keplr-wallet in graz
const grazPath = path.join(nodeModulesPath, 'graz', 'node_modules', '@keplr-wallet');
if (fs.existsSync(grazPath)) {
  console.log('Removing nested @keplr-wallet from graz...');
  fs.rmSync(grazPath, { recursive: true, force: true });
}

// Create symlinks for @keplr-wallet/crypto to ensure resolution
const keplrCryptoSource = path.join(nodeModulesPath, '@keplr-wallet', 'crypto');
const keplrCosmosModules = path.join(nodeModulesPath, '@keplr-wallet', 'cosmos', 'node_modules');

if (fs.existsSync(keplrCryptoSource)) {
  // Ensure the cosmos/node_modules directory exists
  if (!fs.existsSync(keplrCosmosModules)) {
    fs.mkdirSync(keplrCosmosModules, { recursive: true });
  }

  const keplrWalletDir = path.join(keplrCosmosModules, '@keplr-wallet');
  if (!fs.existsSync(keplrWalletDir)) {
    fs.mkdirSync(keplrWalletDir, { recursive: true });
  }

  const keplrCryptoLink = path.join(keplrWalletDir, 'crypto');

  // Remove existing symlink or directory if it exists
  if (fs.existsSync(keplrCryptoLink)) {
    fs.rmSync(keplrCryptoLink, { recursive: true, force: true });
  }

  // Create symlink to the root @keplr-wallet/crypto
  console.log('Creating symlink for @keplr-wallet/crypto...');
  fs.symlinkSync(keplrCryptoSource, keplrCryptoLink, 'junction');
}

console.log('✅ Fixed nested @keplr-wallet dependencies');
