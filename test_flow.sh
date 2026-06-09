#!/bin/bash

# 1. Boot up Docker Compose
echo "Booting up Docker Compose..."
cd infrastructure
docker compose up -d
cd ..

# Wait for databases to initialize
echo "Waiting for MySQL and Redis to be ready..."
sleep 15

# 2. Start all services in the background
echo "Starting microservices..."
node services/api-gateway/src/app.js > api.log 2>&1 &
API_PID=$!

node services/auth-service/src/app.js > auth.log 2>&1 &
AUTH_PID=$!

node services/user-service/src/app.js > user.log 2>&1 &
USER_PID=$!

# Wait for services to listen on ports
sleep 5

# 3. Test API Gateway routing and Auth flow
echo -e "\n--- Testing Login Flow ---"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@finflow.com","password":"password123"}')
echo "Response: $LOGIN_RESPONSE"

# Extract token using simple bash string manipulation
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo -e "\n--- Testing Protected User Route ---"
if [ -n "$TOKEN" ]; then
    USER_RESPONSE=$(curl -s -X GET http://localhost:3000/api/users/me \
      -H "Authorization: Bearer $TOKEN")
    echo "Response: $USER_RESPONSE"
else
    echo "Failed to extract JWT Token from login response."
fi

# 4. Cleanup background node processes (keep docker running)
echo -e "\nCleaning up Node processes..."
kill $API_PID $AUTH_PID $USER_PID
echo "Done!"
