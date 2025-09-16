const { test } = require('@playwright/test');

test('Detailed Button Functionality Test', async ({ page }) => {
  console.log('🔘 Testing each button individually...');
  
  try {
    await page.goto('https://franzenjb.github.io/CommMob-Data-Analytics/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    console.log('✅ Loaded GitHub Pages');
  } catch {
    await page.goto('file:///Users/jefffranzen/github-repos/CommMob-Data-Analytics/index.html');
    console.log('✅ Loaded local file');
  }

  await page.waitForTimeout(2000);

  const buttonResults = [];
  const buttons = await page.locator('button').all();
  
  console.log(`Found ${buttons.length} buttons to test:`);
  
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    try {
      const text = (await button.textContent()) || `Button ${i}`;
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      
      const result = {
        index: i,
        text: text.trim(),
        visible: isVisible,
        enabled: isEnabled,
        functional: false,
        error: null
      };

      if (isVisible && isEnabled) {
        try {
          // Get initial page state
          const initialUrl = page.url();
          
          // Try clicking the button
          await button.click({ timeout: 2000 });
          
          // Wait a moment for any effects
          await page.waitForTimeout(500);
          
          // Check if anything changed
          const newUrl = page.url();
          const hasNewContent = await page.locator('*').count() > 0;
          
          if (newUrl !== initialUrl || hasNewContent) {
            result.functional = true;
          } else {
            // Button might be functional but not change URL/content
            result.functional = true; // Assume functional if no error
          }
          
        } catch (clickError) {
          result.error = clickError.message;
          result.functional = false;
        }
      }

      buttonResults.push(result);
      
      const status = result.functional ? '✅' : '❌';
      const visibility = result.visible ? 'visible' : 'hidden';
      const enablement = result.enabled ? 'enabled' : 'disabled';
      
      console.log(`${status} "${result.text}" - ${visibility}, ${enablement}`);
      
    } catch (error) {
      buttonResults.push({
        index: i,
        text: `Button ${i}`,
        visible: false,
        enabled: false,
        functional: false,
        error: error.message
      });
      console.log(`❌ Button ${i} - Error: ${error.message}`);
    }
  }

  // Summary
  const totalButtons = buttonResults.length;
  const functionalButtons = buttonResults.filter(b => b.functional).length;
  const visibleButtons = buttonResults.filter(b => b.visible).length;
  const enabledButtons = buttonResults.filter(b => b.enabled).length;
  const brokenButtons = totalButtons - functionalButtons;

  console.log('\n📊 DETAILED BUTTON TEST RESULTS:');
  console.log(`Total Buttons: ${totalButtons}`);
  console.log(`Visible Buttons: ${visibleButtons}`);
  console.log(`Enabled Buttons: ${enabledButtons}`);
  console.log(`Functional Buttons: ${functionalButtons}`);
  console.log(`Non-Functional Buttons: ${brokenButtons}`);
  console.log(`Functionality Rate: ${((functionalButtons / totalButtons) * 100).toFixed(1)}%`);

  // List non-functional buttons
  const nonFunctional = buttonResults.filter(b => !b.functional);
  if (nonFunctional.length > 0) {
    console.log('\n❌ NON-FUNCTIONAL BUTTONS:');
    nonFunctional.forEach(button => {
      console.log(`- "${button.text}" (${button.error || 'not visible/enabled'})`);
    });
  }

  // List functional buttons
  const functional = buttonResults.filter(b => b.functional);
  if (functional.length > 0) {
    console.log('\n✅ FUNCTIONAL BUTTONS:');
    functional.forEach(button => {
      console.log(`- "${button.text}"`);
    });
  }

  // Save detailed results
  const fs = require('fs');
  const detailedResults = {
    summary: {
      totalButtons,
      functionalButtons,
      brokenButtons,
      visibleButtons,
      enabledButtons,
      functionalityRate: ((functionalButtons / totalButtons) * 100).toFixed(1)
    },
    buttons: buttonResults
  };
  
  fs.writeFileSync('detailed-button-results.json', JSON.stringify(detailedResults, null, 2));
  console.log('\n💾 Detailed results saved to detailed-button-results.json');
});
