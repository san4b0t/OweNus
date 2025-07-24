#!/bin/bash

echo "=== Running pre-install script ==="

# Show versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install with legacy peer deps
echo "Installing dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

echo "=== Pre-install script complete ==="
