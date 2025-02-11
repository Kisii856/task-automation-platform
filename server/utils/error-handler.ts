
export class WorkflowError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 500
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

export const errorHandler = (err: Error) => {
  if (err instanceof WorkflowError) {
    return {
      status: err.status,
      error: {
        code: err.code,
        message: err.message
      }
    };
  }
  
  return {
    status: 500,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  };
};
