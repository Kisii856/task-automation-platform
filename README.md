// Workflow table
workflows {
  id: serial (primary key)
  task: text
  steps: jsonb[]  // Stores workflow steps with their actions and parameters
}

// Workflow Step Structure
interface WorkflowStep {
  action: string;      // Type of action (visit, click, input)
  selector?: string;   // DOM selector for UI interactions
  url?: string;        // URL for navigation steps
  value?: string;      // Input value for form fields
  description: string; // Human-readable step description
}
```

## Project Structure

```
├── client/
│   └── src/
│       ├── components/
│       │   ├── task-input.tsx      # Task description input form
│       │   └── workflow-display.tsx # Workflow visualization
│       ├── pages/
│       │   ├── home.tsx            # Main application page
│       │   └── not-found.tsx       # 404 page
│       ├── lib/
│       │   └── queryClient.ts      # API client configuration
│       └── App.tsx                 # Root component
├── server/
│   ├── db.ts                       # Database connection
│   ├── routes.ts                   # API endpoints
│   └── storage.ts                  # Data access layer
└── shared/
    └── schema.ts                   # Shared type definitions
```

## API Endpoints

### Implemented Endpoints
- `POST /api/workflows`: Create a new workflow
  - Request body: `{ task: string }`
  - Response: Created workflow object
- `GET /api/workflows`: Get all workflows
  - Response: Array of workflow objects

## Setup Instructions

1. **Database Setup**
   ```bash
   # The database is automatically provisioned with the correct environment variables
   npm run db:push
   ```

2. **Start Development Server**
   ```bash
   npm run dev