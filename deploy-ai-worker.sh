#!/bin/bash

# Cloudflare Workers AI Deployment Script
# This script helps deploy and manage your AI worker

echo "🚀 Cloudflare Workers AI Deployment Script"
echo "=========================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please log in to Cloudflare:"
    wrangler login
fi

echo ""
echo "📋 Available Commands:"
echo "1. Deploy worker"
echo "2. Test worker locally"
echo "3. View worker logs"
echo "4. Update worker"
echo "5. Delete worker"
echo "6. Show worker info"
echo ""

read -p "Select an option (1-6): " choice

case $choice in
    1)
        echo "🚀 Deploying worker..."
        wrangler deploy
        echo "✅ Worker deployed successfully!"
        echo ""
        echo "📝 Next steps:"
        echo "1. Update the WORKER_URL in test-ai-worker.js with your actual worker URL"
        echo "2. Test the worker with: node test-ai-worker.js --test"
        echo "3. View API documentation at: https://your-worker.your-subdomain.workers.dev/help"
        ;;
    2)
        echo "🧪 Testing worker locally..."
        wrangler dev
        ;;
    3)
        echo "📊 Viewing worker logs..."
        wrangler tail
        ;;
    4)
        echo "🔄 Updating worker..."
        wrangler deploy
        echo "✅ Worker updated successfully!"
        ;;
    5)
        echo "⚠️  Deleting worker..."
        read -p "Are you sure you want to delete the worker? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            wrangler delete
            echo "✅ Worker deleted successfully!"
        else
            echo "❌ Deletion cancelled."
        fi
        ;;
    6)
        echo "ℹ️  Worker information:"
        wrangler whoami
        echo ""
        echo "📊 Worker details:"
        wrangler deployments list
        ;;
    *)
        echo "❌ Invalid option. Please select 1-6."
        ;;
esac

echo ""
echo "🔧 Useful Commands:"
echo "  wrangler deploy          # Deploy worker"
echo "  wrangler dev             # Test locally"
echo "  wrangler tail            # View logs"
echo "  wrangler whoami          # Check login status"
echo "  wrangler deployments list # List deployments"
echo ""
echo "📚 Documentation: https://developers.cloudflare.com/workers/"
