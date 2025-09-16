# Cloudflare AI Agent Setup Guide

This guide will help you set up the Cloudflare AI agent for the CommMob Data Analytics platform.

## 🚀 Quick Setup

### 1. Run the Setup Script
```bash
./setup_cloudflare_ai.sh
```

### 2. Get Your Cloudflare Credentials

#### API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Set permissions:
   - **Account**: `Cloudflare Workers:Edit`
   - **Zone**: `Zone:Read` (if needed)
5. Copy the generated token

#### Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Copy the Account ID from the right sidebar

### 3. Configure Environment Variables

#### Backend Configuration (`backend/.env`)
```bash
CLOUDFLARE_API_TOKEN=your_actual_token_here
CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
```

#### Frontend Configuration (`frontend/.env`)
```bash
REACT_APP_CLOUDFLARE_API_TOKEN=your_actual_token_here
REACT_APP_CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
REACT_APP_CLOUDFLARE_AI_URL=https://api.cloudflare.com/client/v4/accounts
```

### 4. Test Your Configuration

```bash
cd backend
python test_cloudflare_ai.py
```

## 🧪 Testing the AI Agent

The test script will:
- ✅ Validate your API credentials
- ✅ Test basic AI query functionality
- ✅ Test analytics-specific queries
- ✅ Verify response parsing

### Expected Output
```
🚀 Starting Cloudflare AI Agent Tests
==================================================

Cloudflare AI Tester initialized:
  - Configured: True
  - Account ID: your_account_id
  - API URL: https://api.cloudflare.com/client/v4/accounts/...

📋 Running Basic Query...
🧪 Testing basic AI query...
✅ Basic query successful!
Response: [AI response about volunteer management metrics]

📋 Running Analytics Query...
🧪 Testing analytics query...
✅ Analytics query successful!
Response: [AI analysis of volunteer data]

📊 Test Results Summary:
==============================
Basic Query: ✅ PASS
Analytics Query: ✅ PASS

🎉 All tests passed! Cloudflare AI agent is ready.
```

## 🤖 Available AI Models

The platform uses these Cloudflare AI models:

- **@cf/meta/llama-2-7b-chat-int8** (default) - Fast, efficient for most queries
- **@cf/meta/llama-2-13b-chat-int8** (optional) - More powerful for complex analysis
- **@cf/mistral/mistral-7b-instruct-v0.1** (optional) - Alternative model

## 🔧 Troubleshooting

### Common Issues

#### 401 Unauthorized Error
- Check your API token is correct
- Ensure token has proper permissions
- Verify account ID is correct

#### 404 Not Found Error
- Confirm your account ID is valid
- Check if AI models are available in your region

#### Timeout Errors
- Increase timeout in test script
- Check network connectivity
- Verify Cloudflare service status

### Debug Mode
Enable debug logging by setting:
```bash
REACT_APP_DEBUG=true
```

## 📊 AI Agent Features

### Natural Language Queries
- "Show me volunteer trends in Texas"
- "What's the conversion rate for Q1 applicants?"
- "Analyze donor patterns by geographic region"

### Automated Insights
- Volunteer conversion analysis
- Geographic distribution patterns
- Performance trend identification
- Predictive recommendations

### Data Analysis
- Statistical pattern recognition
- Anomaly detection
- Correlation analysis
- Risk assessment

## 🚀 Next Steps

1. **Configure your credentials** in the .env files
2. **Run the test script** to validate setup
3. **Start the backend server**: `cd backend && python main.py`
4. **Start the frontend**: `cd frontend && npm start`
5. **Test AI features** in the web interface

## 📚 Additional Resources

- [Cloudflare AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [AI Models Reference](https://developers.cloudflare.com/workers-ai/models/)
- [API Reference](https://developers.cloudflare.com/api/)

---

**Need Help?** Create an issue in the repository or check the troubleshooting section above.
