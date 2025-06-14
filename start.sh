cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Kanban Portfolio App..."

# Run database migrations
echo "📊 Running database migrations..."
npx knex --knexfile ./server/knexfile.js migrate:latest

# Run database seeds
echo "🌱 Seeding database..."
npx knex --knexfile ./server/knexfile.js seed:run

# Start the server
echo "🚀 Starting Express server..."
node ./server/server.js
EOF

chmod +x start.sh
