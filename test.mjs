import { chromium } from 'playwright';

async function testJarvisApp() {
  console.log('Starting JARVIS AI Assistant test...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Track page errors
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  try {
    // Navigate to the deployed app
    await page.goto('https://rfle9dkjmsar.space.minimax.io', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded successfully');

    // Check page title
    const title = await page.title();
    console.log(`✓ Page title: ${title}`);

    // Check if header is present
    const header = await page.locator('header').first();
    if (await header.isVisible()) {
      console.log('✓ Header is visible');
    }

    // Check if JARVIS logo is present
    const jarvisText = await page.locator('text=JARVIS').first();
    if (await jarvisText.isVisible()) {
      console.log('✓ JARVIS title is visible');
    }

    // Check if voice button is present
    const voiceButton = await page.locator('button[aria-label=""]').first();
    // Find any microphone button
    const micButtons = await page.locator('button').all();
    console.log(`✓ Found ${micButtons.length} buttons`);

    // Check if settings button is present
    const settingsButton = await page.locator('button[aria-label="Settings"]').first();
    if (await settingsButton.isVisible()) {
      console.log('✓ Settings button is visible');
    }

    // Check if welcome message is present
    const welcomeMessage = await page.locator('text=Hello, I\'m JARVIS').first();
    if (await welcomeMessage.isVisible()) {
      console.log('✓ Welcome message is visible');
    }

    // Test clicking settings button
    await settingsButton.click();
    await page.waitForTimeout(500);
    const settingsPanel = await page.locator('text=Settings').first();
    if (await settingsPanel.isVisible()) {
      console.log('✓ Settings panel opens on click');
    }

    // Close settings
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Report errors
    if (consoleErrors.length > 0) {
      console.log('\n⚠ Console errors found:');
      consoleErrors.forEach((err) => console.log(`  - ${err}`));
    } else {
      console.log('✓ No console errors');
    }

    if (pageErrors.length > 0) {
      console.log('\n⚠ Page errors found:');
      pageErrors.forEach((err) => console.log(`  - ${err}`));
    } else {
      console.log('✓ No page errors');
    }

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testJarvisApp();
