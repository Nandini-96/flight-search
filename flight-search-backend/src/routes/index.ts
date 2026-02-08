import { Router } from 'express';
import FlightController from '../controllers/FlightController';
import { validateSearchQuery } from '../middleware/validation';

const router = Router();
const flightController = new FlightController();

/**
 * Flight search routes
 */

// Search for flights
router.get(
  '/flights/search',
  validateSearchQuery,
  flightController.searchFlights
);

// Get all airports
router.get('/flights/airports', flightController.getAirports);

// Get statistics
router.get('/flights/stats', flightController.getStats);

// Health check
router.get('/health', flightController.healthCheck);

export default router;