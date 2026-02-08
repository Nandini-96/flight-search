import { Request, Response, NextFunction } from 'express';
import FlightSearchService from '../services/FlightSearchService';
import DataLoader from '../services/DataLoader';
import type { SearchParams } from '../types';

/**
 * FlightController - Handles HTTP requests for flight operations
 */
class FlightController {
  private searchService: FlightSearchService;
  private dataLoader: DataLoader;

  constructor() {
    this.searchService = new FlightSearchService();
    this.dataLoader = DataLoader.getInstance();
  }

  /**
   * Search for flight itineraries
   * GET /api/flights/search?origin=JFK&destination=LAX&date=2024-03-15
   */
  public searchFlights = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get validated query params from middleware
      const validatedQuery = (req as any).validatedQuery as SearchParams;
      
      const results = this.searchService.search({
        origin: validatedQuery.origin,
        destination: validatedQuery.destination,
        date: validatedQuery.date,
      });

      res.json(results);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all available airports
   * GET /api/flights/airports
   */
  public getAirports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const airports = this.dataLoader.getAllAirports();
      
      res.json({
        airports,
        total: airports.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get service statistics
   * GET /api/flights/stats
   */
  public getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = this.dataLoader.getStats();
      
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Health check endpoint
   * GET /api/health
   */
  public healthCheck = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      dataLoaded: this.dataLoader.isDataLoaded(),
    });
  };
}

export default FlightController;