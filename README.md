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

## 🗄️ Database Schema

```typescript
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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-automation-platform.git
cd task-automation-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

4. Push database schema
```bash
npm run db:push
```

5. Start development server
```bash
npm run dev