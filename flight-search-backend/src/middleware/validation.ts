import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Zod schema for search query parameters
 */
export const searchQuerySchema = z.object({
  origin: z
    .string()
    .length(3, 'Airport code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Airport code must be 3 uppercase letters')
    .transform(val => val.toUpperCase()),
  
  destination: z
    .string()
    .length(3, 'Airport code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Airport code must be 3 uppercase letters')
    .transform(val => val.toUpperCase()),
  
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date'),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * Middleware to validate search query parameters
 */
export function validateSearchQuery(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Validate and transform the query parameters
    const validated = searchQuerySchema.parse(req.query);
    
    // Store validated params in a custom property instead of overwriting req.query
    (req as any).validatedQuery = validated;
    
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    } else {
      next(error);
    }
  }
}