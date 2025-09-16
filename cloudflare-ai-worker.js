// Cloudflare Workers AI - Read and Edit functionality
// This worker can read content and perform AI-powered editing

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: /read - Read and analyze content
      if (path === '/read' && request.method === 'POST') {
        const { content, analysisType = 'general' } = await request.json();
        
        const prompt = buildReadPrompt(content, analysisType);
        const result = await callCloudflareAI(env, prompt);
        
        return new Response(JSON.stringify({
          success: true,
          analysis: result,
          originalContent: content,
          analysisType: analysisType
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Route: /edit - Edit content with AI
      if (path === '/edit' && request.method === 'POST') {
        const { content, editInstructions, editType = 'improve' } = await request.json();
        
        const prompt = buildEditPrompt(content, editInstructions, editType);
        const result = await callCloudflareAI(env, prompt);
        
        return new Response(JSON.stringify({
          success: true,
          originalContent: content,
          editedContent: result,
          editInstructions: editInstructions,
          editType: editType
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Route: /analyze - Analyze specific content with ID
      if (path === '/analyze' && request.method === 'POST') {
        const { contentId, content, analysisType = 'comprehensive' } = await request.json();
        
        const prompt = buildAnalysisPrompt(contentId, content, analysisType);
        const result = await callCloudflareAI(env, prompt);
        
        return new Response(JSON.stringify({
          success: true,
          contentId: contentId,
          analysis: result,
          analysisType: analysisType
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Default route - API documentation
      if (path === '/' || path === '/help') {
        const helpContent = `
# Cloudflare Workers AI - Read and Edit API

## Endpoints:

### POST /read
Read and analyze content
Body: { "content": "text to analyze", "analysisType": "general|detailed|summary" }

### POST /edit  
Edit content with AI assistance
Body: { "content": "text to edit", "editInstructions": "how to edit", "editType": "improve|rewrite|summarize" }

### POST /analyze
Analyze content with specific ID
Body: { "contentId": "unique-id", "content": "text to analyze", "analysisType": "comprehensive|quick|detailed" }

## Example Usage:
curl -X POST https://your-worker.your-subdomain.workers.dev/read \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Your text here", "analysisType": "detailed"}'
        `;
        
        return new Response(helpContent, {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        });
      }

      return new Response('Not Found', { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Build prompt for reading/analyzing content
function buildReadPrompt(content, analysisType) {
  const analysisInstructions = {
    'general': 'Provide a general overview and key points.',
    'detailed': 'Provide a detailed analysis with insights and observations.',
    'summary': 'Create a concise summary of the main points.'
  };

  return `
Please analyze the following content and provide a ${analysisType} analysis:

Content: "${content}"

Instructions: ${analysisInstructions[analysisType] || analysisInstructions.general}

Please provide:
1. Key insights
2. Main themes or topics
3. Important details
4. Any recommendations or observations

Format your response in a clear, structured way.
  `;
}

// Build prompt for editing content
function buildEditPrompt(content, editInstructions, editType) {
  const editInstructionsMap = {
    'improve': 'Improve the content while maintaining the original meaning and style.',
    'rewrite': 'Rewrite the content with better clarity and flow.',
    'summarize': 'Create a concise summary of the content.'
  };

  return `
Please ${editType} the following content:

Original Content: "${content}"

Edit Instructions: "${editInstructions}"

Additional Guidelines: ${editInstructionsMap[editType] || editInstructionsMap.improve}

Please provide the edited version that:
1. Maintains the core message
2. Improves clarity and readability
3. Follows the specific edit instructions
4. Is well-structured and professional

Return only the edited content without additional commentary.
  `;
}

// Build prompt for analyzing content with ID
function buildAnalysisPrompt(contentId, content, analysisType) {
  return `
Analyze the following content (ID: ${contentId}) with a ${analysisType} approach:

Content: "${content}"

Please provide:
1. Content identification and classification
2. Key themes and topics
3. Quality assessment
4. Potential improvements
5. Related insights or connections
6. Actionable recommendations

Format as a structured analysis report.
  `;
}

// Call Cloudflare AI API
async function callCloudflareAI(env, prompt) {
  try {
    const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        {
          role: 'system',
          content: 'You are an expert content analyst and editor. Provide clear, helpful, and professional responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.response;
  } catch (error) {
    console.error('Cloudflare AI API error:', error);
    throw new Error('Failed to process with AI: ' + error.message);
  }
}
