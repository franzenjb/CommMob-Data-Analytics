#!/bin/bash

# Cloudflare AI Setup Script for CommMob Data Analytics
# This script helps set up the Cloudflare AI agent configuration

echo "🚀 Setting up Cloudflare AI Agent for CommMob Data Analytics"
echo "=========================================================="

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env from template..."
    cp backend/env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

echo ""
echo "🔧 Configuration Steps:"
echo "1. Get your Cloudflare API token from: https://dash.cloudflare.com/profile/api-tokens"
echo "2. Your Account ID is: 39511202383a0532d0e56b3fa1d5ac12"
echo "3. Update the following files with your credentials:"
echo "   - backend/.env (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)"
echo "   - frontend/.env (REACT_APP_CLOUDFLARE_API_TOKEN, REACT_APP_CLOUDFLARE_ACCOUNT_ID)"
echo ""

echo "🧪 To test your configuration, run:"
echo "   cd backend && python test_cloudflare_ai.py"
echo ""

echo "📚 Required Cloudflare AI Models:"
echo "   - @cf/meta/llama-2-7b-chat-int8 (default)"
echo "   - @cf/meta/llama-2-13b-chat-int8 (optional, for more complex queries)"
echo "   - @cf/mistral/mistral-7b-instruct-v0.1 (optional, alternative model)"
echo ""

echo "🎯 Next Steps:"
echo "1. Configure your API credentials in .env files"
echo "2. Test the connection with the test script"
echo "3. Start the backend server: cd backend && python main.py"
echo "4. Start the frontend: cd frontend && npm start"
echo ""

echo "✨ Setup complete! Your Cloudflare AI agent is ready for configuration."
