# Cloudflare Workers AI - Read and Edit System

This system provides AI-powered content reading, analysis, and editing capabilities using Cloudflare Workers AI.

## 🚀 Quick Start

### 1. Deploy the Worker

```bash
# Make sure you're logged in to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

### 2. Test the System

```bash
# Run tests
node test-ai-worker.js --test

# Show curl commands
node test-ai-worker.js --curl
```

### 3. Use the Content Manager

```bash
# Test with specific content ID
node ai-content-manager.js --test

# Test batch processing
node ai-content-manager.js --batch
```

## 📋 API Endpoints

### POST /read
Read and analyze content with AI

**Request Body:**
```json
{
  "content": "Text to analyze",
  "analysisType": "general|detailed|summary"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "AI-generated analysis",
  "originalContent": "Original text",
  "analysisType": "detailed"
}
```

### POST /edit
Edit content with AI assistance

**Request Body:**
```json
{
  "content": "Text to edit",
  "editInstructions": "How to edit the content",
  "editType": "improve|rewrite|summarize"
}
```

**Response:**
```json
{
  "success": true,
  "originalContent": "Original text",
  "editedContent": "AI-edited text",
  "editInstructions": "Edit instructions",
  "editType": "improve"
}
```

### POST /analyze
Analyze content with specific ID

**Request Body:**
```json
{
  "contentId": "unique-identifier",
  "content": "Text to analyze",
  "analysisType": "comprehensive|quick|detailed"
}
```

**Response:**
```json
{
  "success": true,
  "contentId": "unique-identifier",
  "analysis": "Comprehensive analysis",
  "analysisType": "comprehensive"
}
```

## 🔧 Configuration

### wrangler.toml
```toml
name = "commmob-ai-worker"
main = "cloudflare-ai-worker.js"
compatibility_date = "2024-01-15"

[[ai]]
binding = "AI"
```

### Environment Variables
Set these in the Cloudflare dashboard:
- `ENVIRONMENT`: production|development

## 📊 Content ID Management

The system is designed to work with specific content IDs. Your content ID is:
```
WeF_Z-cwb1yQWQE4bxyBsYi1iB1U3bV3LYbObp-r
```

### Using the Content Manager

```javascript
const { AIContentManager } = require('./ai-content-manager');

const manager = new AIContentManager('https://your-worker.workers.dev');

// Read content
const readResult = await manager.readContent('Your content here', 'detailed');

// Edit content
const editResult = await manager.editContent(
  'Your content here',
  'Make it more professional',
  'improve'
);

// Analyze with ID
const analyzeResult = await manager.analyzeContent(
  'Your content here',
  'comprehensive'
);
```

## 🧪 Testing

### Local Testing
```bash
# Start local development server
wrangler dev

# Test with curl
curl -X POST http://localhost:8787/read \
  -H "Content-Type: application/json" \
  -d '{"content": "Test content", "analysisType": "detailed"}'
```

### Production Testing
```bash
# Deploy and test
wrangler deploy
node test-ai-worker.js --test
```

## 📈 Usage Examples

### 1. Content Analysis
```bash
curl -X POST https://your-worker.workers.dev/read \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a sample document with technical information and user requirements.",
    "analysisType": "detailed"
  }'
```

### 2. Content Editing
```bash
curl -X POST https://your-worker.workers.dev/edit \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This document needs improvement.",
    "editInstructions": "Make it more professional and add specific examples",
    "editType": "improve"
  }'
```

### 3. ID-Based Analysis
```bash
curl -X POST https://your-worker.workers.dev/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "WeF_Z-cwb1yQWQE4bxyBsYi1iB1U3bV3LYbObp-r",
    "content": "Content to analyze",
    "analysisType": "comprehensive"
  }'
```

## 🔍 Monitoring and Logs

### View Logs
```bash
# Real-time logs
wrangler tail

# Specific deployment logs
wrangler deployments list
```

### Health Check
```bash
# Check worker status
curl https://your-worker.workers.dev/help
```

## 🛠️ Development

### File Structure
```
├── cloudflare-ai-worker.js    # Main worker code
├── wrangler.toml              # Worker configuration
├── test-ai-worker.js          # Testing script
├── ai-content-manager.js      # Content management utilities
├── deploy-ai-worker.sh        # Deployment script
└── CLOUDFLARE_WORKERS_AI.md   # This documentation
```

### Adding New Features

1. **New Endpoint**: Add route in `cloudflare-ai-worker.js`
2. **New AI Model**: Update the `callCloudflareAI` function
3. **New Analysis Type**: Add to prompt builders

### Error Handling

The worker includes comprehensive error handling:
- CORS support
- Input validation
- AI API error handling
- Structured error responses

## 📚 Resources

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [AI Models Reference](https://developers.cloudflare.com/workers-ai/models/)

## 🆘 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your Cloudflare API token
2. **AI Model Not Available**: Verify the model name and your account permissions
3. **CORS Errors**: Ensure proper headers are set
4. **Timeout Errors**: Check your worker timeout settings

### Debug Mode

Enable debug logging by adding console.log statements in the worker code.

## 🎯 Next Steps

1. **Deploy the worker** using the deployment script
2. **Test the endpoints** with the provided test scripts
3. **Integrate with your application** using the API endpoints
4. **Monitor usage** through Cloudflare dashboard
5. **Scale as needed** based on usage patterns

---

**Your Cloudflare Workers AI system is ready for content reading and editing!** 🚀
