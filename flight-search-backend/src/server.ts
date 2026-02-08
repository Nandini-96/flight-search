import dotenv from 'dotenv';
import path from 'path';
import createApp from './app';
import DataLoader from './services/DataLoader';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const FLIGHTS_DATA_PATH = process.env.FLIGHTS_DATA_PATH || path.join(__dirname, '../data/flights.json');

/**
 * Initialize and start the server
 */
async function startServer() {
  try {
    console.log('Starting FlightFinder API Server...\n');

    // Load flight data
    console.log('Loading flight data...');
    const dataLoader = DataLoader.getInstance();
    dataLoader.loadData(FLIGHTS_DATA_PATH);

    const stats = dataLoader.getStats();
    console.log(`\n Data Summary:`);
    console.log(`   • Total airports: ${stats.totalAirports}`);
    console.log(`   • Total flights: ${stats.totalFlights}`);
    console.log(`   • Airport codes: ${stats.airports.slice(0, 10).join(', ')}${stats.airports.length > 10 ? '...' : ''}`);

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`\n Server is running!`);
      console.log(`   • Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   • Port: ${PORT}`);
      console.log(`   • API Base URL: http://localhost:${PORT}/api`);
      console.log(`\n Available endpoints:`);
      console.log(`   • GET /api/flights/search?origin={code}&destination={code}&date={YYYY-MM-DD}`);
      console.log(`   • GET /api/flights/airports`);
      console.log(`   • GET /api/flights/stats`);
      console.log(`   • GET /api/health`);
      console.log(`\n Example request:`);
      console.log(`   curl "http://localhost:${PORT}/api/flights/search?origin=JFK&destination=LAX&date=2024-03-15"`);
      console.log('\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();