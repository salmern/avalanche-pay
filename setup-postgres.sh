#!/bin/bash

# Avalanche Pay - PostgreSQL Setup Script

echo "🗄️  Avalanche Pay - PostgreSQL Setup"
echo "===================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo ""
    echo "Install PostgreSQL:"
    echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    echo "  Arch: sudo pacman -S postgresql"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "⚠️  PostgreSQL is not running"
    echo ""
    echo "Start PostgreSQL:"
    echo "  Ubuntu/Debian: sudo systemctl start postgresql"
    echo "  macOS: brew services start postgresql"
    echo "  Arch: sudo systemctl start postgresql"
    echo ""
    read -p "Would you like to start PostgreSQL now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo systemctl start postgresql || brew services start postgresql
    else
        exit 1
    fi
fi

echo "✅ PostgreSQL is running"
echo ""

# Create database
echo "📦 Creating database..."
sudo -u postgres psql -c "CREATE DATABASE avalanche_pay;" 2>/dev/null || psql -U postgres -c "CREATE DATABASE avalanche_pay;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'avalanche_pay' created"
else
    echo "⚠️  Database might already exist (this is OK)"
fi

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "📝 Database credentials:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: avalanche_pay"
echo "  User: postgres"
echo "  Password: (your postgres password)"
echo ""
echo "🔧 Update backend/.env with your PostgreSQL password"
echo ""
echo "🚀 Start the backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
