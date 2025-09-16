#!/usr/bin/env python3
"""
Cloudflare AI Agent Test Script
Tests the Cloudflare AI integration with sample queries
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class CloudflareAITester:
    def __init__(self):
        self.api_token = os.getenv('CLOUDFLARE_API_TOKEN')
        self.account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID', '39511202383a0532d0e56b3fa1d5ac12')
        self.api_url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/@cf/meta/llama-2-7b-chat-int8"
        self.is_configured = bool(self.api_token and self.account_id)
        
        print(f"Cloudflare AI Tester initialized:")
        print(f"  - Configured: {self.is_configured}")
        print(f"  - Account ID: {self.account_id}")
        print(f"  - API URL: {self.api_url}")
        print()

    def test_basic_query(self):
        """Test basic AI query functionality"""
        if not self.is_configured:
            print("❌ Cloudflare AI not configured. Please set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID")
            return False

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }

        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert data analyst for the American Red Cross. Provide concise, helpful responses."
                },
                {
                    "role": "user",
                    "content": "What are the key metrics for volunteer management?"
                }
            ],
            "max_tokens": 200,
            "temperature": 0.7
        }

        try:
            print("🧪 Testing basic AI query...")
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Basic query successful!")
                print(f"Response: {result.get('result', {}).get('response', 'No response')}")
                return True
            else:
                print(f"❌ Query failed with status {response.status_code}")
                print(f"Error: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            return False

    def test_analytics_query(self):
        """Test analytics-specific query"""
        if not self.is_configured:
            return False

        headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }

        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a senior data analyst for the American Red Cross. Analyze volunteer data and provide insights."
                },
                {
                    "role": "user",
                    "content": "Analyze this volunteer data: 49,247 active volunteers, 76,000+ applicants, 64.5% conversion rate across 47 states. What insights can you provide?"
                }
            ],
            "max_tokens": 300,
            "temperature": 0.5
        }

        try:
            print("🧪 Testing analytics query...")
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Analytics query successful!")
                print(f"Response: {result.get('result', {}).get('response', 'No response')}")
                return True
            else:
                print(f"❌ Analytics query failed with status {response.status_code}")
                print(f"Error: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            return False

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Cloudflare AI Agent Tests")
        print("=" * 50)
        
        if not self.is_configured:
            print("❌ Cloudflare AI not configured. Please set environment variables:")
            print("   export CLOUDFLARE_API_TOKEN='your_token_here'")
            print("   export CLOUDFLARE_ACCOUNT_ID='your_account_id_here'")
            return False

        tests = [
            ("Basic Query", self.test_basic_query),
            ("Analytics Query", self.test_analytics_query)
        ]

        results = []
        for test_name, test_func in tests:
            print(f"\n📋 Running {test_name}...")
            result = test_func()
            results.append((test_name, result))
            print()

        print("📊 Test Results Summary:")
        print("=" * 30)
        for test_name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name}: {status}")

        all_passed = all(result for _, result in results)
        if all_passed:
            print("\n🎉 All tests passed! Cloudflare AI agent is ready.")
        else:
            print("\n⚠️  Some tests failed. Check configuration and try again.")

        return all_passed

if __name__ == "__main__":
    tester = CloudflareAITester()
    tester.run_all_tests()
