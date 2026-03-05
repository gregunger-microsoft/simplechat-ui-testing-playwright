# Playwright Tests

This project contains end-to-end tests using [Playwright](https://playwright.dev/).

## Getting Started

First, make sure you have installed the project dependencies and Playwright browsers:

```bash
npm install
npx playwright install
```

## Running Tests via CLI

The Command Line Interface (CLI) is perfect for running tests in CI/CD environments or when you just want a quick headless run.

**Run all tests:**
```bash
npx playwright test
```

**Run a specific test file:**
```bash
npx playwright test tests/app.spec.ts
```

**Run tests in headed mode (visible browser):**
```bash
npx playwright test --headed
```

**View the HTML report:**
If any tests fail, or if you just want to see the results, you can open the generated HTML report:
```bash
npx playwright show-report
```

## Running Tests via UI Mode

Playwright comes with a powerful built-in UI Mode. It is highly recommended for developing, running, and debugging tests interactively. 

To launch UI Mode, run:

```bash
npx playwright test --ui
```

### Features of UI Mode:
- **Time Travel:** Inspect the DOM, network requests, and console logs at each step of the test.
- **Locator Picker:** Easily pick elements on the page and generate Playwright locators.
- **Watch Mode:** Automatically re-run tests when you save changes to your files.
- **Visual Debugging:** See exactly what the browser sees during test execution.
