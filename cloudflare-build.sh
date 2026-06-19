#!/bin/bash
# Cloudflare Pages Build Script
# This script is used by Cloudflare Pages to build the project

set -e

echo "Installing dependencies..."
npm ci --legacy-peer-deps

echo "Building Next.js project..."
npx next build

echo "Preparing Pages output directory..."
mkdir -p .next/output

# Copy HTML files as pages for proper URL routing
find .next/server/app -name "*.html" -exec sh -c 'f="{}"; base="${f#.next/server/app/}"; dir="$(dirname "$base")"; mkdir -p ".next/output/$dir"; cp "$f" ".next/output/$base"' \;

# Copy static assets
cp -r .next/static .next/output/
mkdir -p .next/output/_next
cp -r .next/static .next/output/_next/static

# Copy functions for API routes
cp -r functions .next/output/

echo "Build complete. Output: .next/output/"
