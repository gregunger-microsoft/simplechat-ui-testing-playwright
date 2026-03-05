import { test as setup, expect } from '@playwright/test';

// Define the path where the authenticated state will be saved
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Give yourself plenty of time to handle MFA manually (max 2 minutes)
  setup.setTimeout(120000);

  // 1. Navigate to the login page
  await page.goto('/');

  // 2. Click the 'sign in' link before the login form appears
  await page.getByRole('link', { name: 'sign in' }).click();

  // 3. Handle Microsoft Entra ID (Azure AD) specific login flow
  
  // Wait for the Microsoft login page to load
  await page.waitForURL('**/login.microsoftonline.com/**');

  // Fill in the email
  await page.getByPlaceholder('Email, phone, or Skype').fill(process.env.TEST_USERNAME!);
  await page.getByRole('button', { name: 'Next' }).click();

  // Wait for password field and fill it in
  const passInput = page.getByPlaceholder('Password');
  await passInput.waitFor({ state: 'visible' });
  // Use evaluate to fill the password so it doesn't log in plain text in Playwright UI
  await passInput.evaluate((el: HTMLInputElement, pwd) => {
    el.value = pwd;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, process.env.TEST_PASSWORD!);
  
  // Clicking Sign in navigates to the MFA screen
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Handle optional "Verify your identity" prompt (MFA method choice)
  // We wait 3 seconds sequentially.
  try {
    const mfaOption = page.getByText('Approve a request on my Microsoft Authenticator app');
    await mfaOption.waitFor({ state: 'visible', timeout: 3000 });
    await mfaOption.click();
  } catch (e) {
    // Ignore if not present, we are probably already on the number screen.
  }

  // 4. Handle "Stay Signed In?" prompt AFTER you approve the MFA.
  // Wait patiently for up to 90 seconds for you to approve the prompt on your phone.
  // Once you do, the "Yes" button for "Stay signed in?" should finally appear.
  try {
    const staySignedIn = page.getByRole('button', { name: 'Yes' });
    await staySignedIn.waitFor({ state: 'visible', timeout: 90000 });
    await staySignedIn.click();
  } catch (e) {
    // If we never see the button but reach the app, that's fine too.
  }

  // 5. Wait for the app to successfully load (verifying we are past MFA and login screens)
  await expect(page.getByText('Simple Chat')).toBeVisible({ timeout: 90000 });
  
  // 6. Save the authenticated state
  await page.context().storageState({ path: authFile });
});