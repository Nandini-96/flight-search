import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Default error values
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err.message) {
    // Use error message if available
    message = err.message;
    
    // Map common error messages to appropriate status codes
    if (message.includes('Invalid') || message.includes('must be')) {
      statusCode = 400;
      code = 'VALIDATION_ERROR';
    } else if (message.includes('not found') || message.includes('does not exist')) {
      statusCode = 404;
      code = 'NOT_FOUND';
    }
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      statusCode,
      code,
      message,
      stack: err.stack,
    });
  }

  // Send error response
  res.status(statusCode).json({
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
}