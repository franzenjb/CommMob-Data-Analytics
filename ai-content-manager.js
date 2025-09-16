#!/usr/bin/env node

// AI Content Manager for specific content ID
// Handles reading and editing content with the ID: WeF_Z-cwb1yQWQE4bxyBsYi1iB1U3bV3LYbObp-r

const CONTENT_ID = 'WeF_Z-cwb1yQWQE4bxyBsYi1iB1U3bV3LYbObp-r';

class AIContentManager {
  constructor(workerUrl) {
    this.workerUrl = workerUrl;
    this.contentId = CONTENT_ID;
  }

  // Read and analyze content
  async readContent(content, analysisType = 'detailed') {
    try {
      const response = await fetch(`${this.workerUrl}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          analysisType: analysisType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error reading content:', error);
      throw error;
    }
  }

  // Edit content with AI
  async editContent(content, editInstructions, editType = 'improve') {
    try {
      const response = await fetch(`${this.workerUrl}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          editInstructions: editInstructions,
          editType: editType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error editing content:', error);
      throw error;
    }
  }

  // Analyze content with specific ID
  async analyzeContent(content, analysisType = 'comprehensive') {
    try {
      const response = await fetch(`${this.workerUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: this.contentId,
          content: content,
          analysisType: analysisType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw error;
    }
  }

  // Batch process multiple operations
  async batchProcess(operations) {
    const results = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'read':
            result = await this.readContent(operation.content, operation.analysisType);
            break;
          case 'edit':
            result = await this.editContent(operation.content, operation.editInstructions, operation.editType);
            break;
          case 'analyze':
            result = await this.analyzeContent(operation.content, operation.analysisType);
            break;
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
        
        results.push({
          operation: operation.type,
          success: true,
          result: result
        });
      } catch (error) {
        results.push({
          operation: operation.type,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
}

// Example usage and testing
async function testContentManager() {
  const workerUrl = 'https://commmob-ai-worker.your-subdomain.workers.dev'; // Update with your actual URL
  const manager = new AIContentManager(workerUrl);

  console.log(`🧪 Testing AI Content Manager for ID: ${CONTENT_ID}\n`);

  const sampleContent = `
This is a test document for the AI Content Manager.
It contains various types of information including:
- Technical specifications
- User requirements
- Implementation details
- Quality metrics

The document is designed to test the AI's ability to:
1. Read and understand complex content
2. Provide detailed analysis
3. Suggest improvements
4. Maintain context across operations
  `;

  try {
    // Test 1: Read and analyze
    console.log('📖 Testing content reading...');
    const readResult = await manager.readContent(sampleContent, 'detailed');
    console.log('✅ Read successful!');
    console.log('Analysis:', readResult.analysis);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Edit content
    console.log('✏️  Testing content editing...');
    const editResult = await manager.editContent(
      sampleContent,
      'Make this content more professional and add specific examples',
      'improve'
    );
    console.log('✅ Edit successful!');
    console.log('Edited content:', editResult.editedContent);
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Analyze with ID
    console.log('🔍 Testing content analysis with ID...');
    const analyzeResult = await manager.analyzeContent(sampleContent, 'comprehensive');
    console.log('✅ Analysis successful!');
    console.log('Content ID:', analyzeResult.contentId);
    console.log('Analysis:', analyzeResult.analysis);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Batch processing example
async function batchProcessingExample() {
  const workerUrl = 'https://commmob-ai-worker.your-subdomain.workers.dev'; // Update with your actual URL
  const manager = new AIContentManager(workerUrl);

  const operations = [
    {
      type: 'read',
      content: 'Sample content 1',
      analysisType: 'summary'
    },
    {
      type: 'edit',
      content: 'Sample content 2',
      editInstructions: 'Make it more concise',
      editType: 'improve'
    },
    {
      type: 'analyze',
      content: 'Sample content 3',
      analysisType: 'detailed'
    }
  ];

  console.log('🔄 Testing batch processing...');
  const results = await manager.batchProcess(operations);
  
  results.forEach((result, index) => {
    console.log(`\nOperation ${index + 1} (${result.operation}):`);
    if (result.success) {
      console.log('✅ Success');
      console.log('Result:', result.result);
    } else {
      console.log('❌ Failed');
      console.log('Error:', result.error);
    }
  });
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    testContentManager();
  } else if (args.includes('--batch')) {
    batchProcessingExample();
  } else {
    console.log('🤖 AI Content Manager for ID:', CONTENT_ID);
    console.log('=====================================\n');
    console.log('Usage:');
    console.log('  node ai-content-manager.js --test    # Run tests');
    console.log('  node ai-content-manager.js --batch   # Test batch processing');
    console.log('\nNote: Update workerUrl in the script with your actual worker URL');
  }
}

module.exports = { AIContentManager, CONTENT_ID };
