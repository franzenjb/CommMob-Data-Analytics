const { test, expect } = require('@playwright/test');

test('Quick Executive Platform Functionality Check', async ({ page }) => {
  console.log('🚀 Quick functionality test starting...');
  
  const results = {
    totalElements: 0,
    workingElements: 0,
    brokenElements: 0,
    details: [],
    summary: {}
  };

  try {
    // Try GitHub Pages first, fallback to local
    try {
      await page.goto('https://franzenjb.github.io/CommMob-Data-Analytics/', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      console.log('✅ Loaded GitHub Pages');
    } catch {
      await page.goto('file:///Users/jefffranzen/github-repos/CommMob-Data-Analytics/index.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      console.log('✅ Loaded local file');
    }

    // Wait for React to load
    await page.waitForTimeout(2000);

    // Count buttons
    const buttons = await page.locator('button').count();
    console.log(`Found ${buttons} buttons`);
    results.summary.buttons = buttons;

    // Count working buttons (those that are visible and enabled)
    const visibleButtons = await page.locator('button:visible').count();
    const enabledButtons = await page.locator('button:enabled').count();
    results.summary.visibleButtons = visibleButtons;
    results.summary.enabledButtons = enabledButtons;

    // Count inputs
    const inputs = await page.locator('input, textarea').count();
    console.log(`Found ${inputs} input fields`);
    results.summary.inputs = inputs;

    // Count links
    const links = await page.locator('a').count();
    console.log(`Found ${links} links`);
    results.summary.links = links;

    // Test specific Executive Platform elements
    const executiveTitle = await page.locator('h1, h2, h3').filter({ hasText: /Executive Command|Executive/ }).count();
    results.summary.executiveTitles = executiveTitle;
    console.log(`Found ${executiveTitle} executive titles`);

    // Check for AI input
    const aiInput = await page.locator('input[placeholder*="Ask"]').count();
    results.summary.aiInputs = aiInput;
    console.log(`Found ${aiInput} AI input fields`);

    // Check for KPI cards
    const kpiCards = await page.locator('*').filter({ hasText: /Active Volunteers|Readiness Score|Fundraising|Efficiency/ }).count();
    results.summary.kpiCards = kpiCards;
    console.log(`Found ${kpiCards} KPI indicators`);

    // Check for alerts
    const alerts = await page.locator('[role="alert"], .MuiAlert-root').count();
    results.summary.alerts = alerts;
    console.log(`Found ${alerts} alert components`);

    // Check for sidebar items
    const sidebarItems = await page.locator('*').filter({ hasText: /Executive Command|Dashboard|Maps|Analytics/ }).count();
    results.summary.sidebarItems = sidebarItems;
    console.log(`Found ${sidebarItems} navigation items`);

    // Test a few critical buttons
    const quickActionButtons = await page.locator('button').filter({ hasText: /Launch|Generate|Schedule|Review/ }).count();
    results.summary.quickActionButtons = quickActionButtons;
    console.log(`Found ${quickActionButtons} quick action buttons`);

    // Check for JavaScript errors
    let jsErrors = 0;
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors++;
        results.details.push(`JS Error: ${msg.text()}`);
      }
    });

    // Try clicking the AI input if it exists
    try {
      const aiInputField = page.locator('input[placeholder*="Ask"]').first();
      if (await aiInputField.isVisible()) {
        await aiInputField.click();
        await aiInputField.fill('test query');
        const value = await aiInputField.inputValue();
        if (value === 'test query') {
          results.details.push('✅ AI input field is functional');
          results.workingElements++;
        } else {
          results.details.push('❌ AI input field not working properly');
          results.brokenElements++;
        }
      }
    } catch (error) {
      results.details.push(`❌ AI input test failed: ${error.message}`);
      results.brokenElements++;
    }

    // Try clicking a quick question chip
    try {
      const quickChip = page.locator('*').filter({ hasText: 'Show resource gaps' }).first();
      if (await quickChip.isVisible()) {
        await quickChip.click();
        results.details.push('✅ Quick question chip is clickable');
        results.workingElements++;
      } else {
        results.details.push('❌ Quick question chips not found or not clickable');
        results.brokenElements++;
      }
    } catch (error) {
      results.details.push(`❌ Quick chip test failed: ${error.message}`);
      results.brokenElements++;
    }

    // Calculate totals
    results.totalElements = buttons + inputs + links;
    results.summary.jsErrors = jsErrors;

    // Final assessment
    console.log('\n📊 FUNCTIONALITY TEST RESULTS:');
    console.log(`Total Interactive Elements Found: ${results.totalElements}`);
    console.log(`- Buttons: ${buttons} (${visibleButtons} visible, ${enabledButtons} enabled)`);
    console.log(`- Input Fields: ${inputs}`);
    console.log(`- Links: ${links}`);
    console.log(`\n🏛️ Executive Platform Specific:`);
    console.log(`- Executive Titles: ${executiveTitle}`);
    console.log(`- AI Input Fields: ${aiInput}`);
    console.log(`- KPI Cards: ${kpiCards}`);
    console.log(`- Alert Components: ${alerts}`);
    console.log(`- Navigation Items: ${sidebarItems}`);
    console.log(`- Quick Action Buttons: ${quickActionButtons}`);
    console.log(`- JavaScript Errors: ${jsErrors}`);

    // Estimate functionality
    const estimatedWorking = visibleButtons + enabledButtons + inputs + (aiInput > 0 ? 1 : 0);
    const estimatedBroken = (buttons - enabledButtons) + jsErrors;

    console.log(`\n🎯 ESTIMATED FUNCTIONALITY:`);
    console.log(`✅ Working Elements: ~${estimatedWorking}`);
    console.log(`❌ Non-Functional Elements: ~${estimatedBroken}`);
    console.log(`📊 Functionality Rate: ${((estimatedWorking / (estimatedWorking + estimatedBroken)) * 100).toFixed(1)}%`);

    // Save results
    const fs = require('fs');
    const finalResults = {
      ...results,
      estimatedWorking,
      estimatedBroken,
      functionalityRate: ((estimatedWorking / (estimatedWorking + estimatedBroken)) * 100).toFixed(1)
    };
    
    fs.writeFileSync('quick-test-results.json', JSON.stringify(finalResults, null, 2));
    console.log('\n💾 Results saved to quick-test-results.json');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    results.details.push(`Test failed: ${error.message}`);
  }
});
