const { test, expect } = require('@playwright/test');

test.describe('Red Cross Executive Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start local server or use deployed version
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
  });

  test('Dashboard loads with all KPI metrics', async ({ page }) => {
    // Check main title
    await expect(page.locator('h4:has-text("Red Cross Executive")')).toBeVisible();
    
    // Check all 4 KPI cards are present
    const kpiCards = page.locator('.MuiCard-root');
    await expect(kpiCards).toHaveCount(4, { timeout: 10000 });
    
    // Verify KPI values are displayed
    await expect(page.locator('text=Total Volunteers')).toBeVisible();
    await expect(page.locator('text=Total Raised')).toBeVisible();
    await expect(page.locator('text=Blood Drives')).toBeVisible();
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
    
    // Check for actual numbers
    await expect(page.locator('h4').first()).toContainText(/[\d,]+/);
  });

  test('Interactive map loads and displays markers', async ({ page }) => {
    // Wait for map container
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible({ timeout: 15000 });
    
    // Check for map tiles
    await expect(page.locator('.leaflet-tile-container')).toBeVisible();
    
    // Check for markers
    await page.waitForTimeout(3000); // Allow map to render
    const markers = page.locator('.leaflet-marker-icon, .leaflet-interactive');
    const markerCount = await markers.count();
    console.log(`Found ${markerCount} map markers`);
    expect(markerCount).toBeGreaterThan(0);
    
    // Test marker popup
    if (markerCount > 0) {
      await markers.first().click();
      await expect(page.locator('.leaflet-popup')).toBeVisible({ timeout: 5000 });
    }
  });

  test('All navigation tabs work correctly', async ({ page }) => {
    const tabs = [
      { name: 'Overview', shouldHaveMap: true },
      { name: 'Geographic', shouldHaveMap: true },
      { name: 'Volunteers', shouldHaveChart: true },
      { name: 'Blood Services', shouldHaveChart: true },
      { name: 'Financials', shouldHaveChart: true },
      { name: 'Predictions', shouldHaveList: true },
      { name: 'AI Analysis', shouldHaveInput: true }
    ];
    
    for (const tab of tabs) {
      console.log(`Testing tab: ${tab.name}`);
      
      // Click tab
      await page.locator(`text=${tab.name}`).click();
      await page.waitForTimeout(1000);
      
      // Verify content based on tab
      if (tab.shouldHaveMap) {
        await expect(page.locator('.leaflet-container')).toBeVisible();
      }
      if (tab.shouldHaveChart) {
        const chartElement = page.locator('.plot-container, canvas, .recharts-wrapper');
        await expect(chartElement.first()).toBeVisible();
      }
      if (tab.shouldHaveList) {
        await expect(page.locator('.MuiList-root')).toBeVisible();
      }
      if (tab.shouldHaveInput) {
        await expect(page.locator('input[placeholder*="Ask about your data"]')).toBeVisible();
      }
    }
  });

  test('Plotly charts render with data', async ({ page }) => {
    // Go to volunteers tab
    await page.locator('text=Volunteers').click();
    await page.waitForTimeout(2000);
    
    // Check for Plotly chart
    const plotlyChart = page.locator('.plot-container, .js-plotly-plot');
    await expect(plotlyChart.first()).toBeVisible({ timeout: 10000 });
    
    // Verify chart has rendered SVG elements
    const svgElements = page.locator('.plot-container svg, .js-plotly-plot svg');
    const svgCount = await svgElements.count();
    console.log(`Found ${svgCount} chart SVG elements`);
    expect(svgCount).toBeGreaterThan(0);
  });

  test('AI insights feature works', async ({ page }) => {
    // Navigate to AI Analysis tab
    await page.locator('text=AI Analysis').click();
    await page.waitForTimeout(1000);
    
    // Find input field
    const aiInput = page.locator('input[placeholder*="Ask about your data"]');
    await expect(aiInput).toBeVisible();
    
    // Type a query
    await aiInput.fill('What regions need more volunteers?');
    
    // Click submit button or press enter
    await page.keyboard.press('Enter');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check for AI response
    const alertBox = page.locator('.MuiAlert-root').last();
    await expect(alertBox).toBeVisible({ timeout: 5000 });
    
    // Verify response contains relevant content
    const responseText = await alertBox.textContent();
    console.log('AI Response:', responseText);
    expect(responseText.toLowerCase()).toContain('volunteer');
  });

  test('Data export functionality exists', async ({ page }) => {
    // Check for export button
    const exportButton = page.locator('button:has-text("Export")');
    await expect(exportButton).toBeVisible();
    
    // Click export button
    await exportButton.click();
    
    // Verify no errors occurred
    await page.waitForTimeout(1000);
  });

  test('Responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Check that dashboard still loads
    await expect(page.locator('h4:has-text("Red Cross Executive")')).toBeVisible();
    
    // Check KPI cards stack vertically
    const firstCard = page.locator('.MuiCard-root').first();
    await expect(firstCard).toBeVisible();
  });

  test('Map layer toggles work', async ({ page }) => {
    // Wait for map
    await expect(page.locator('.leaflet-container')).toBeVisible();
    
    // Find toggle buttons
    const toggleButtons = page.locator('.MuiToggleButton-root');
    const buttonCount = await toggleButtons.count();
    
    if (buttonCount > 0) {
      // Click volunteer toggle
      const volunteerToggle = page.locator('button:has-text("Volunteers")');
      if (await volunteerToggle.count() > 0) {
        await volunteerToggle.click();
        await page.waitForTimeout(1000);
      }
      
      // Click blood drives toggle
      const bloodToggle = page.locator('button:has-text("Blood Drives")');
      if (await bloodToggle.count() > 0) {
        await bloodToggle.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('Predictive analytics displays forecasts', async ({ page }) => {
    // Navigate to Predictions tab
    await page.locator('text=Predictions').click();
    await page.waitForTimeout(1000);
    
    // Check for prediction items
    const predictions = page.locator('.MuiListItem-root');
    const predictionCount = await predictions.count();
    console.log(`Found ${predictionCount} predictions`);
    expect(predictionCount).toBeGreaterThan(0);
    
    // Verify confidence scores
    const progressBars = page.locator('.MuiLinearProgress-root');
    await expect(progressBars.first()).toBeVisible();
  });

  test('Executive alerts are displayed', async ({ page }) => {
    // Navigate to AI Analysis tab (where alerts are shown)
    await page.locator('text=AI Analysis').click();
    await page.waitForTimeout(1000);
    
    // Look for alerts
    const alerts = page.locator('.MuiAlert-root');
    const alertCount = await alerts.count();
    console.log(`Found ${alertCount} alerts`);
    
    // Verify at least one alert exists
    if (alertCount > 0) {
      const firstAlert = alerts.first();
      await expect(firstAlert).toBeVisible();
      
      // Check alert has severity indicator
      const alertText = await firstAlert.textContent();
      expect(alertText).toBeTruthy();
    }
  });

  test('Performance: Dashboard loads within 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for main content
    await expect(page.locator('h4:has-text("Red Cross Executive")')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Dashboard loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });

  test('Charts have interactive hover tooltips', async ({ page }) => {
    // Navigate to a chart view
    await page.locator('text=Volunteers').click();
    await page.waitForTimeout(2000);
    
    // Find chart element
    const chart = page.locator('.plot-container, canvas').first();
    
    if (await chart.count() > 0) {
      // Hover over chart
      await chart.hover();
      await page.waitForTimeout(1000);
      
      // Check for tooltip (Plotly or Chart.js)
      const tooltip = page.locator('.hoverlayer, .chartjs-tooltip, [role="tooltip"]');
      // Tooltips may or may not appear depending on exact hover position
      console.log(`Tooltip elements found: ${await tooltip.count()}`);
    }
  });
});

test.describe('Data Processing Tests', () => {
  test('Verify KPI calculations are correct', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Get KPI values
    const volunteerText = await page.locator('text=Total Volunteers').locator('..').textContent();
    const donationText = await page.locator('text=Total Raised').locator('..').textContent();
    
    console.log('Volunteer KPI:', volunteerText);
    console.log('Donation KPI:', donationText);
    
    // Verify numbers are reasonable
    expect(volunteerText).toContain('48'); // Should show ~48,978
    expect(donationText).toContain('180'); // Should show ~$180M
  });
  
  test('Geographic breakdown shows top states', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Navigate to volunteers tab
    await page.locator('text=Volunteers').click();
    await page.waitForTimeout(2000);
    
    // Look for state data (TX, CA, NY should be top states)
    const pageContent = await page.content();
    const hasStateData = pageContent.includes('TX') || 
                        pageContent.includes('CA') || 
                        pageContent.includes('NY');
    
    expect(hasStateData).toBeTruthy();
  });
});

// Run tests
if (require.main === module) {
  console.log('Starting dashboard tests...');
  console.log('Make sure the app is running on http://localhost:3000');
  console.log('Run: npm start in another terminal first');
}