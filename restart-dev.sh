#!/bin/bash
# Script to restart the dev server cleanly

echo "🔄 Cleaning up..."
# Kill any running Next.js processes
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Remove Next.js cache
rm -rf .next

echo "✅ Cleanup complete!"
echo ""
echo "🚀 Starting dev server..."
npm run dev
