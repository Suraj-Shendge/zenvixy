#!/bin/bash

# Zenvixy - Setup Script
# Run this to initialize the project

echo "🚀 Setting up Zenvixy..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize git if not already initialized
if [ ! -d .git ]; then
  echo "📚 Initializing Git repository..."
  git init
  echo "node_modules/" >> .gitignore
  echo ".next/" >> .gitignore
fi

# Create a .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "🔐 Creating .env.local file..."
  cat > .env.local << EOF
# Firebase (optional - for authentication)
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=

# Supabase (optional - for database)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000"
echo "3. Create a GitHub repository and push your code"
echo ""
