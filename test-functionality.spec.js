const { test, expect } = require('@playwright/test');

test.describe('Red Cross Executive Platform Functionality Test', () => {
  test('Count non-functioning buttons and interactive elements', async ({ page }) => {
    const results = {
      totalButtons: 0,
      functionalButtons: 0,
      nonFunctionalButtons: 0,
      totalInputs: 0,
      functionalInputs: 0,
      nonFunctionalInputs: 0,
      totalLinks: 0,
      functionalLinks: 0,
      nonFunctionalLinks: 0,
      errors: [],
      details: []
    };

    console.log('🚀 Testing Red Cross Executive Platform...');
    
    // Navigate to the GitHub Pages URL
    try {
      await page.goto('https://franzenjb.github.io/CommMob-Data-Analytics/', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      console.log('✅ Successfully loaded GitHub Pages URL');
    } catch (error) {
      console.log('❌ Failed to load GitHub Pages, trying local file...');
      try {
        await page.goto('file:///Users/jefffranzen/github-repos/CommMob-Data-Analytics/index.html', {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        console.log('✅ Successfully loaded local file');
      } catch (localError) {
        results.errors.push('Failed to load both GitHub Pages and local file');
        console.log('❌ Failed to load any version of the app');
        return results;
      }
    }

    // Wait for React app to load
    await page.waitForTimeout(3000);

    // Check for any JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.errors.push(`Console Error: ${msg.text()}`);
      }
    });

    // Test all buttons
    console.log('🔘 Testing buttons...');
    const buttons = await page.locator('button').all();
    results.totalButtons = buttons.length;
    console.log(`Found ${results.totalButtons} buttons`);

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      try {
        const text = await button.textContent();
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        
        if (isVisible && isEnabled) {
          // Try to click the button and see if it does something
          try {
            await button.click({ timeout: 1000 });
            results.functionalButtons++;
            results.details.push(`✅ Button "${text}" - Functional`);
            
            // Wait a bit to see if anything happens
            await page.waitForTimeout(500);
          } catch (clickError) {
            results.nonFunctionalButtons++;
            results.details.push(`❌ Button "${text}" - Click failed: ${clickError.message}`);
          }
        } else {
          results.nonFunctionalButtons++;
          results.details.push(`❌ Button "${text}" - Not visible or disabled`);
        }
      } catch (error) {
        results.nonFunctionalButtons++;
        results.details.push(`❌ Button ${i} - Error testing: ${error.message}`);
      }
    }

    // Test input fields
    console.log('📝 Testing input fields...');
    const inputs = await page.locator('input, textarea').all();
    results.totalInputs = inputs.length;
    console.log(`Found ${results.totalInputs} input fields`);

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      try {
        const placeholder = await input.getAttribute('placeholder') || `Input ${i}`;
        const isVisible = await input.isVisible();
        const isEnabled = await input.isEnabled();
        
        if (isVisible && isEnabled) {
          try {
            await input.fill('test input');
            const value = await input.inputValue();
            if (value === 'test input') {
              results.functionalInputs++;
              results.details.push(`✅ Input "${placeholder}" - Functional`);
            } else {
              results.nonFunctionalInputs++;
              results.details.push(`❌ Input "${placeholder}" - Value not set properly`);
            }
            await input.clear();
          } catch (inputError) {
            results.nonFunctionalInputs++;
            results.details.push(`❌ Input "${placeholder}" - Fill failed: ${inputError.message}`);
          }
        } else {
          results.nonFunctionalInputs++;
          results.details.push(`❌ Input "${placeholder}" - Not visible or disabled`);
        }
      } catch (error) {
        results.nonFunctionalInputs++;
        results.details.push(`❌ Input ${i} - Error testing: ${error.message}`);
      }
    }

    // Test navigation links
    console.log('🔗 Testing navigation links...');
    const links = await page.locator('a, [role="button"]').all();
    results.totalLinks = links.length;
    console.log(`Found ${results.totalLinks} clickable links/elements`);

    for (let i = 0; i < Math.min(links.length, 20); i++) { // Limit to first 20 to avoid too many tests
      const link = links[i];
      try {
        const text = await link.textContent() || `Link ${i}`;
        const isVisible = await link.isVisible();
        
        if (isVisible) {
          try {
            const href = await link.getAttribute('href');
            if (href && href.startsWith('http')) {
              // External link - don't click, just mark as functional
              results.functionalLinks++;
              results.details.push(`✅ External Link "${text}" - Has valid href`);
            } else {
              // Internal navigation - try clicking
              await link.click({ timeout: 1000 });
              results.functionalLinks++;
              results.details.push(`✅ Link "${text}" - Clickable`);
              await page.waitForTimeout(500);
            }
          } catch (clickError) {
            results.nonFunctionalLinks++;
            results.details.push(`❌ Link "${text}" - Click failed: ${clickError.message}`);
          }
        } else {
          results.nonFunctionalLinks++;
          results.details.push(`❌ Link "${text}" - Not visible`);
        }
      } catch (error) {
        results.nonFunctionalLinks++;
        results.details.push(`❌ Link ${i} - Error testing: ${error.message}`);
      }
    }

    // Test specific Executive Platform features
    console.log('🏛️ Testing Executive Platform specific features...');
    
    // Test AI Assistant
    const aiInput = page.locator('input[placeholder*="Ask me anything"]');
    if (await aiInput.isVisible()) {
      try {
        await aiInput.fill('Show resource gaps');
        const sendButton = page.locator('button').filter({ hasText: /send/i }).first();
        if (await sendButton.isVisible()) {
          await sendButton.click();
          results.details.push('✅ AI Assistant - Input and send button functional');
        } else {
          results.details.push('❌ AI Assistant - Send button not found');
        }
      } catch (error) {
        results.details.push(`❌ AI Assistant - Error: ${error.message}`);
      }
    } else {
      results.details.push('❌ AI Assistant - Input field not found');
    }

    // Test Quick Question chips
    const quickChips = await page.locator('[role="button"]').filter({ hasText: /Show resource gaps|Recruitment priorities|Donor risks|Expansion opportunities/ }).all();
    results.details.push(`Found ${quickChips.length} quick question chips`);
    
    for (const chip of quickChips) {
      try {
        const text = await chip.textContent();
        await chip.click();
        results.details.push(`✅ Quick Chip "${text}" - Clickable`);
      } catch (error) {
        results.details.push(`❌ Quick Chip - Click failed`);
      }
    }

    // Test sidebar navigation
    const sidebarItems = await page.locator('[role="button"]').filter({ hasText: /Executive Command|Operations Dashboard|Maps|Analytics|Volunteers/ }).all();
    results.details.push(`Found ${sidebarItems.length} sidebar navigation items`);

    // Check for critical alerts
    const alerts = await page.locator('[role="alert"], .MuiAlert-root').all();
    results.details.push(`Found ${alerts.length} alert components`);

    // Check for KPI cards
    const kpiCards = await page.locator('h3, h4').filter({ hasText: /Active Volunteers|Readiness Score|Total Fundraising|Operational Efficiency/ }).all();
    results.details.push(`Found ${kpiCards.length} KPI cards`);

    // Final summary
    console.log('📊 Test Results Summary:');
    console.log(`Total Buttons: ${results.totalButtons}`);
    console.log(`Functional Buttons: ${results.functionalButtons}`);
    console.log(`Non-Functional Buttons: ${results.nonFunctionalButtons}`);
    console.log(`Total Inputs: ${results.totalInputs}`);
    console.log(`Functional Inputs: ${results.functionalInputs}`);
    console.log(`Non-Functional Inputs: ${results.nonFunctionalInputs}`);
    console.log(`Total Links: ${results.totalLinks}`);
    console.log(`Functional Links: ${results.functionalLinks}`);
    console.log(`Non-Functional Links: ${results.nonFunctionalLinks}`);
    console.log(`Errors: ${results.errors.length}`);

    // Write detailed results to file
    const fs = require('fs');
    fs.writeFileSync('functionality-test-results.json', JSON.stringify(results, null, 2));
    
    return results;
  });
});
