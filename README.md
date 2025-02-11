# Task Automation Platform

A web-based platform that converts natural language descriptions into executable workflows.

## Overview

This platform allows users to describe tasks in natural language, which are then automatically decomposed into executable workflow steps. The workflows are stored in a PostgreSQL database and can be viewed and managed through a clean, modern web interface.

## Features Implemented

### Core Functionality
- ✅ Natural language task input
- ✅ Automatic workflow generation
- ✅ Step-by-step workflow visualization
- ✅ Persistent storage with PostgreSQL

### Technical Features
- ✅ Database integration with Drizzle ORM
- ✅ RESTful API endpoints
- ✅ Modern React frontend with TypeScript
- ✅ Real-time UI updates using TanStack Query

## Technical Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui components
- Wouter for routing

### Backend
- Express.js server
- PostgreSQL database
- Drizzle ORM for database operations
- Zod for schema validation

## Database Schema

Current database structure:

```typescript
// Workflow table
workflows {
  id: serial (primary key)
  task: text
  steps: jsonb[]
}
```

## Project Structure

```
├── client/
│   └── src/
│       ├── components/
│       │   ├── task-input.tsx
│       │   └── workflow-display.tsx
│       ├── pages/
│       │   └── home.tsx
│       └── App.tsx
├── server/
│   ├── db.ts
│   ├── routes.ts
│   └── storage.ts
└── shared/
    └── schema.ts
```

## API Endpoints

### Implemented Endpoints
- `POST /api/workflows`: Create a new workflow
- `GET /api/workflows`: Get all workflows

## Setup Instructions

1. **Database Setup**
   ```bash
   # The database is automatically provisioned with the correct environment variables
   npm run db:push
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   This will start both the frontend and backend servers on port 5000.

## Environment Variables

The following environment variables are automatically configured:
- `DATABASE_URL`: PostgreSQL connection string
- `PGPORT`: Database port
- `PGUSER`: Database user
- `PGPASSWORD`: Database password
- `PGDATABASE`: Database name
- `PGHOST`: Database host

## Future Features

The following features are planned for future implementation:

1. **Authentication System**
   - User registration and login
   - Secure session management
   - User-specific workflows

2. **Enhanced Task Decomposition**
   - More sophisticated natural language processing
   - Support for complex multi-step workflows
   - Custom action definitions

3. **Workflow Execution Tracking**
   - Real-time execution status
   - Success/failure logging
   - Execution history

4. **UI/UX Improvements**
   - Enhanced workflow visualization
   - Interactive workflow editor
   - Progress indicators
