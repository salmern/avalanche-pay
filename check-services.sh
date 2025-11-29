#!/bin/bash

echo "🔍 Avalanche Pay - Service Diagnostic"
echo "======================================"
echo ""

# Check PostgreSQL
echo "1️⃣ Checking PostgreSQL..."
if pg_isready &> /dev/null; then
    echo "   ✅ PostgreSQL is running"
else
    echo "   ❌ PostgreSQL is NOT running"
    echo "   Fix: sudo systemctl start postgresql"
fi
echo ""

# Check if database exists
echo "2️⃣ Checking database..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw avalanche_pay; then
    echo "   ✅ Database 'avalanche_pay' exists"
else
    echo "   ❌ Database 'avalanche_pay' does NOT exist"
    echo "   Fix: sudo -u postgres psql -c 'CREATE DATABASE avalanche_pay;'"
fi
echo ""

# Check backend
echo "3️⃣ Checking backend API..."
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 4000"
    RESPONSE=$(curl -s http://localhost:4000/health)
    echo "   Response: $RESPONSE"
else
    echo "   ❌ Backend is NOT running"
    echo "   Fix: cd backend && npm run dev"
fi
echo ""

# Check frontend
echo "4️⃣ Checking frontend..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
elif curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
else
    echo "   ❌ Frontend is NOT running"
    echo "   Fix: cd frontend && npm run dev"
fi
echo ""

# Check environment files
echo "5️⃣ Checking environment files..."
if [ -f "backend/.env" ]; then
    echo "   ✅ backend/.env exists"
else
    echo "   ❌ backend/.env missing"
    echo "   Fix: cp backend/.env.example backend/.env"
fi

if [ -f "frontend/.env" ]; then
    echo "   ✅ frontend/.env exists"
else
    echo "   ❌ frontend/.env missing"
    echo "   Fix: cp frontend/.env.example frontend/.env"
fi
echo ""

# Summary
echo "📊 Summary"
echo "=========="
echo ""

ALL_GOOD=true

if ! pg_isready &> /dev/null; then
    echo "❌ Start PostgreSQL first"
    ALL_GOOD=false
fi

if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw avalanche_pay; then
    echo "❌ Create database"
    ALL_GOOD=false
fi

if ! curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "❌ Start backend"
    ALL_GOOD=false
fi

if ! curl -s http://localhost:5173 > /dev/null 2>&1 && ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Start frontend"
    ALL_GOOD=false
fi

if [ "$ALL_GOOD" = true ]; then
    echo "✅ All services are running!"
    echo ""
    echo "🎉 You're ready to use Avalanche Pay!"
    echo "   Open: http://localhost:5173"
else
    echo ""
    echo "⚠️  Some services need attention"
    echo "   Read the messages above for fixes"
fi

echo ""
