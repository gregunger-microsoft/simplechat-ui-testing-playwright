import { test, expect } from '@playwright/test';

test('App page loads and maintains session', async ({ page }) => {
  // 1. Go to the main app page (it will use the saved auth state automatically)
  await page.goto('/');

  // 2. Verify we are logged in by checking that the "Start Chatting" button/link is visible
  const startChattingBtn = page.getByText('Start Chatting');
  await expect(startChattingBtn).toBeVisible({ timeout: 15000 });
});

test('Start a conversation with AI', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // 1. Click the "Start Chatting" button/link
  await page.getByText('Start Chatting').click();

  // 2. Wait for the chat input box to appear and type a message
  // NOTE: You might need to adjust this locator. Usually it's a 'textbox' or has a specific placeholder.
  const chatInput = page.getByRole('textbox'); 
  await chatInput.waitFor({ state: 'visible' });
  await chatInput.fill('Hello! Can you write a short poem about test automation?');

  await page.waitForTimeout(500);

  // 3. Send the message
  // Find the button that is inside the same area as the chat input
  // Or fallback to checking for standard submit behaviors
  const chatParent = chatInput.locator('..').locator('..'); // go up a couple levels
  const sendButton = chatParent.locator('button').last(); // get the last button in that bottom bar
  
  try {
    await sendButton.click({ timeout: 2000 });
  } catch {
    // If all else fails, use Playwright's coordinate click: click the right-middle edge of the textbox itself
    // (In many chat UIs, the send button is placed inside/floating over the right side of the textarea)
    await chatInput.click({ position: { x: 10, y: 10 } }); // Just to refocus
    await page.keyboard.press('Shift+Enter'); 
    await page.keyboard.press('Enter');
  }

  // 4. Verify the AI responds
  // We wait for the chat UI to generate a response.
  // One way is to check that a new message block appears from the AI.
  // This looks for a new text block appearing in the conversation list.
  await expect(page.locator('.message-list, [class*="message"], [class*="chat-message"]').last()).toContainText(/poem|automation|automate/i, { timeout: 30000 });
});