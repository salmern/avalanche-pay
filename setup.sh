#!/bin/bash

# Avalanche Pay - Quick Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 Avalanche Pay - Setup Script"
echo "================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. You have: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env (please edit with your values)"
else
    echo "⚠️  frontend/.env already exists, skipping"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (please edit with your values)"
else
    echo "⚠️  backend/.env already exists, skipping"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit environment files:"
echo "   - frontend/.env"
echo "   - backend/.env"
echo ""
echo "2. Setup Supabase database:"
echo "   - Create project at https://supabase.com"
echo "   - Run SQL from DEPLOYMENT.md"
echo "   - Add URL and key to backend/.env"
echo ""
echo "3. Create Telegram bot:"
echo "   - Message @BotFather on Telegram"
echo "   - Follow instructions in DEPLOYMENT.md"
echo "   - Add bot token to backend/.env"
echo ""
echo "4. Get WalletConnect Project ID:"
echo "   - Go to https://cloud.walletconnect.com"
echo "   - Create project"
echo "   - Add ID to frontend/.env"
echo ""
echo "5. Start development servers:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "6. Open http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Overview"
echo "   - DEPLOYMENT.md - Deployment guide"
echo "   - QUICKSTART_FOR_JUDGES.md - Quick test guide"
echo ""
echo "🎉 Happy hacking!"
