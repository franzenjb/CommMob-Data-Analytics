#!/usr/bin/env node

// Test script for Cloudflare Workers AI
// This script helps test the read and edit functionality

const WORKER_URL = 'https://commmob-ai-worker.your-subdomain.workers.dev'; // Update with your actual worker URL
const CONTENT_ID = 'WeF_Z-cwb1yQWQE4bxyBsYi1iB1U3bV3LYbObp-r';

// Test content
const testContent = `
This is a sample document for testing the Cloudflare Workers AI functionality.
The document contains various types of content including technical information,
user data, and operational procedures. It's designed to test the AI's ability
to read, analyze, and edit content effectively.

Key features to test:
- Content analysis and summarization
- Text improvement and editing
- Structured data extraction
- Quality assessment and recommendations
`;

async function testAIWorker() {
  console.log('🧪 Testing Cloudflare Workers AI...\n');

  try {
    // Test 1: Read and analyze content
    console.log('📖 Test 1: Reading and analyzing content...');
    const readResponse = await fetch(`${WORKER_URL}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: testContent,
        analysisType: 'detailed'
      })
    });

    if (readResponse.ok) {
      const readResult = await readResponse.json();
      console.log('✅ Read test successful!');
      console.log('Analysis:', readResult.analysis);
    } else {
      console.log('❌ Read test failed:', await readResponse.text());
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Edit content
    console.log('✏️  Test 2: Editing content...');
    const editResponse = await fetch(`${WORKER_URL}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: testContent,
        editInstructions: 'Make this content more professional and concise',
        editType: 'improve'
      })
    });

    if (editResponse.ok) {
      const editResult = await editResponse.json();
      console.log('✅ Edit test successful!');
      console.log('Original:', editResult.originalContent.substring(0, 100) + '...');
      console.log('Edited:', editResult.editedContent);
    } else {
      console.log('❌ Edit test failed:', await editResponse.text());
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Analyze with specific ID
    console.log('🔍 Test 3: Analyzing content with ID...');
    const analyzeResponse = await fetch(`${WORKER_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentId: CONTENT_ID,
        content: testContent,
        analysisType: 'comprehensive'
      })
    });

    if (analyzeResponse.ok) {
      const analyzeResult = await analyzeResponse.json();
      console.log('✅ Analysis test successful!');
      console.log('Content ID:', analyzeResult.contentId);
      console.log('Analysis:', analyzeResult.analysis);
    } else {
      console.log('❌ Analysis test failed:', await analyzeResponse.text());
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Test with curl commands
function generateCurlCommands() {
  console.log('\n🔧 Curl Commands for Testing:\n');
  
  console.log('1. Read and analyze content:');
  console.log(`curl -X POST ${WORKER_URL}/read \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"content": "Your content here", "analysisType": "detailed"}'`);
  
  console.log('\n2. Edit content:');
  console.log(`curl -X POST ${WORKER_URL}/edit \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"content": "Your content here", "editInstructions": "Make it better", "editType": "improve"}'`);
  
  console.log('\n3. Analyze with ID:');
  console.log(`curl -X POST ${WORKER_URL}/analyze \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"contentId": "${CONTENT_ID}", "content": "Your content here", "analysisType": "comprehensive"}'`);
}

// Main execution
if (require.main === module) {
  console.log('🚀 Cloudflare Workers AI Test Script');
  console.log('=====================================\n');
  
  // Check if we should run tests or just show curl commands
  const args = process.argv.slice(2);
  
  if (args.includes('--curl')) {
    generateCurlCommands();
  } else if (args.includes('--test')) {
    testAIWorker();
  } else {
    console.log('Usage:');
    console.log('  node test-ai-worker.js --test    # Run actual tests');
    console.log('  node test-ai-worker.js --curl    # Show curl commands');
    console.log('\nNote: Update WORKER_URL in the script with your actual worker URL');
  }
}

module.exports = { testAIWorker, generateCurlCommands };
