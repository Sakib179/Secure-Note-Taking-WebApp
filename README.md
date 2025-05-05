# Secure Notes App 
 
A web application where users can register, login, and create encrypted personal notes. 
## Backend setup
cd secure-notes-app/backend
npm install

// .env file
# Server Settings
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres      # Your PostgreSQL username
DB_PASSWORD=password  # Your PostgreSQL password
DB_NAME=secure_notes

# JWT
JWT_SECRET=your_strong_jwt_secret_key_here
JWT_EXPIRY=24h

# AES Encryption - IMPORTANT: Use the same keys to decrypt existing data
ENCRYPTION_KEY=2604d576eedc6374799e99b98088c3e52edd0fb2e047c38cacfdaca96360d703
ENCRYPTION_IV=2527fedf147e118934034f275abd0580


setup postgres
psql -U postgres
CREATE DATABASE secure_notes;
\q

npm start or npm run dev





## frontend 
cd secure-notes-app/frontend
npm install
npm start
http://localhost:3000/login