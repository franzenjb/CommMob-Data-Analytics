#!/bin/bash

# Cloudflare Configuration Script
# Sets up your Account ID and helps configure the API token

ACCOUNT_ID="39511202383a0532d0e56b3fa1d5ac12"

echo "🔧 Cloudflare Configuration Setup"
echo "================================="
echo "Account ID: $ACCOUNT_ID"
echo ""

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

# Create frontend .env if it doesn't exist
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend/.env file..."
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env file created"
else
    echo "✅ Frontend .env file already exists"
fi

echo ""
echo "🔑 Next Steps:"
echo "1. Get your Cloudflare API Token from: https://dash.cloudflare.com/profile/api-tokens"
echo "2. Update the following files with your API token:"
echo "   - backend/.env (CLOUDFLARE_API_TOKEN=your_token_here)"
echo "   - frontend/.env (REACT_APP_CLOUDFLARE_API_TOKEN=your_token_here)"
echo ""
echo "3. Test your configuration:"
echo "   cd backend && python test_cloudflare_ai.py"
echo ""

# Show current configuration
echo "📊 Current Configuration:"
echo "Account ID: $ACCOUNT_ID"
echo "Backend .env exists: $([ -f "backend/.env" ] && echo "✅ Yes" || echo "❌ No")"
echo "Frontend .env exists: $([ -f "frontend/.env" ] && echo "✅ Yes" || echo "❌ No")"
echo ""

# Check if API token is set
if [ -f "backend/.env" ]; then
    if grep -q "CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here" backend/.env; then
        echo "⚠️  API Token not configured in backend/.env"
    else
        echo "✅ API Token appears to be configured in backend/.env"
    fi
fi

if [ -f "frontend/.env" ]; then
    if grep -q "REACT_APP_CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here" frontend/.env; then
        echo "⚠️  API Token not configured in frontend/.env"
    else
        echo "✅ API Token appears to be configured in frontend/.env"
    fi
fi

echo ""
echo "🚀 Ready to test! Run: cd backend && python test_cloudflare_ai.py"
