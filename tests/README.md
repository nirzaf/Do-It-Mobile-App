# E2E Testing with Playwright

This directory contains end-to-end tests for the Do IT Mobile App using Playwright.

## Setup

1. Install Playwright dependencies:

```bash
npm install
npx playwright install
```

1. Make sure the development server is running:

```bash
npm run dev
```

## Running Tests

### Basic test execution

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug
```

### Advanced options

```bash
# Run specific test file
npx playwright test app.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with specific tag
npx playwright test --grep "onboarding"
```

## Test Coverage

The test suite covers all features described in the README.md:

### 🚀 Onboarding Flow

- ✅ Welcome screen with language toggle
- ✅ User profile data collection form
- ✅ Goal selection (Lose Weight, Gain Weight, Gain Muscle, Extra Diet)
- ✅ Profile media upload screen
- ✅ Navigation between onboarding steps

### 🏠 Main Application Features

- ✅ Dashboard with personalized greeting
- ✅ Training program navigation and display
- ✅ Exercise detail views with sets/reps
- ✅ Diet plan with BMI, calories, and water intake
- ✅ Meal plan display
- ✅ Subscription packages (Basic 300 SAR, VIP 550 SAR)

### 🎨 UI/UX Features

- ✅ Dark/Light theme toggle
- ✅ Responsive design (mobile viewport testing)
- ✅ Internationalization (English/Arabic)
- ✅ Form validation
- ✅ Navigation and routing

### 💾 State Management

- ✅ User data persistence
- ✅ Context state management
- ✅ Route protection

## Test Structure

```
tests/
├── e2e/
│   └── app.spec.ts          # Main test suite
└── README.md                # This file
```

## Browser Support

Tests run on multiple browsers:

- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Debugging

1. **Visual debugging**: Use `npm run test:e2e:headed` to see tests run in browser
2. **Interactive mode**: Use `npm run test:e2e:ui` for step-by-step debugging
3. **Debug mode**: Use `npm run test:e2e:debug` to pause and inspect
4. **Screenshots**: Automatically captured on test failures
5. **Videos**: Recorded for failed tests
6. **Traces**: Available for failed test analysis

## Test Data

Tests use the same mock data as the application:

- `src/data/exercises.json` - Exercise data
- `src/data/plans.json` - Diet and training plans
- `src/data/locales/` - Translation files

## Continuous Integration

The tests are configured to:

- Run in parallel for faster execution
- Retry failed tests on CI
- Generate HTML reports
- Start the dev server automatically

## Troubleshooting

### Common Issues

1. **Tests timeout**: Increase timeout in `playwright.config.ts`
2. **Server not starting**: Check if port 5173 is available
3. **Element not found**: Update selectors in test files
4. **Flaky tests**: Add proper wait conditions

### Getting Help

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
