import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({ 
  testsDir: './tests',
  fullyParallel: true,
  retries: 0,
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    // Global setup project to run first
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // The main testing project relying on the auth state
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use the saved storage state for all tests in this project
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],
});
