
# AutoFlow API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

## Workflow Endpoints

### POST /api/workflows
Create a new workflow (Requires Authentication)

**Request Body:**
```json
{
  "task": "string"
}
```

### GET /api/workflows
Get all workflows (Requires Authentication)

## Error Responses
All endpoints may return these status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 429: Too Many Requests
- 500: Internal Server Error
