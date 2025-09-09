#!/bin/bash

# Development startup script with increased file descriptor limit
# This helps prevent EMFILE errors during development

echo "🚀 Starting Sommelier development server..."

# Check current ulimit
CURRENT_LIMIT=$(ulimit -n)
echo "Current file descriptor limit: $CURRENT_LIMIT"

# Set higher file descriptor limit
if [ "$CURRENT_LIMIT" -lt 10000 ]; then
  echo "Increasing file descriptor limit to 10000..."
  ulimit -n 10000 2>/dev/null || {
    echo "⚠️  Failed to increase file descriptor limit. You may need to run:"
    echo "    sudo launchctl limit maxfiles 65536 200000"
    echo "    And restart your terminal."
  }
fi

# Set Node.js memory options
export NODE_OPTIONS="--max-old-space-size=8192"

# Clear Next.js cache to prevent stale module issues
echo "Clearing Next.js cache..."
rm -rf .next/cache

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
fi

# Start the development server
echo "Starting Next.js development server..."
pnpm dev
