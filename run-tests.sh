#!/bin/bash

# Do IT Mobile App - E2E Test Runner
# This script runs the complete Playwright test suite

echo "🚀 Do IT Mobile App - E2E Test Runner"
echo "====================================="

# Check if Playwright is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js and npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Playwright browsers are installed
if [ ! -d "node_modules/@playwright" ]; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install
fi

# Check if dev server is running
echo "🔍 Checking if development server is running..."
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "⚠️  Development server not detected on http://localhost:5173"
    echo "   Please start the dev server with: npm run dev"
    echo "   Or the tests will start their own server automatically."
fi

echo ""
echo "🧪 Running E2E Tests..."
echo "========================"

# Run the tests
npm run test:e2e

echo ""
echo "✅ Test execution completed!"
echo "📊 Check the HTML report for detailed results."
echo "🐛 For debugging, use: npm run test:e2e:debug"