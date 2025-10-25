# DevDash
DevDash is a developer-first Agile project management tool designed to eliminate context-switching. It directly integrates with your GitHub/GitLab repositories, syncing issues and milestones seamlessly with your codebase. Built with React, Node.js, and PostgreSQL.

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- GitHub OAuth App (for authentication)

### Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd DevDash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. **Set up PostgreSQL database:**
   
   **Option A: Using Docker (Recommended)**
   ```bash
   # Start PostgreSQL in Docker
   docker run --name devdash-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=devdash -p 5432:5432 -d postgres:13
   ```
   
   **Option B: Using system PostgreSQL**
   ```bash
   # Install and start PostgreSQL
   sudo pacman -S postgresql
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # Create database
   createdb devdash
   ```

3. **Configure environment variables:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Get GitHub OAuth credentials:**
   - Go to https://github.com/settings/applications/new
   - Set Application name: "DevDash"
   - Set Homepage URL: `http://localhost:5173`
   - Set Authorization callback URL: `http://localhost:3000/auth/github/callback`
   - Copy Client ID and Client Secret to your `.env` file

5. **Run database migrations:**
   ```bash
   cd server
   npx prisma migrate dev
   ```

6. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run start:dev

   # Terminal 2 - Frontend  
   cd client
   npm run dev
   ```

7. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
