import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Compression middleware
  app.use(compression());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // API routes
  app.use('/api', routes);

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'FlightFinder API',
      version: '1.0.0',
      description: 'Flight connection search engine with multi-stop itinerary support',
      endpoints: {
        search: 'GET /api/flights/search?origin={code}&destination={code}&date={YYYY-MM-DD}',
        airports: 'GET /api/flights/airports',
        stats: 'GET /api/flights/stats',
        health: 'GET /api/health',
      },
      documentation: 'See README.md for detailed API documentation',
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;