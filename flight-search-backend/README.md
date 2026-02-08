# FlightFinder Backend API

A flight connection search engine API that finds flights with multiple layovers with timezone handling and connection validation.

# Features

- **Multi-Stop Search**: Find direct flights, 1-stop, and 2-stop connections
- **Timezone Aware**: Accurate duration calculations across timezones
- **Connection Rules**: Validates minimum/maximum layovers for domestic and international connections
- **Fast Performance**: Optimized search with indexed data structures
- **RESTful API**: Clean, intuitive endpoints
- **Error Handling**: Comprehensive validation and error messages

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **date-fns & date-fns-tz** - Timezone handling
- **Zod** - Runtime validation
- **Jest** - Testing framework

## Project Structure

```
src/
├── controllers/          # Request handlers
│   └── FlightController.ts
├── services/            # Business logic
│   ├── DataLoader.ts    # Loads and indexes flight data
│   └── FlightSearchService.ts  # Search algorithm
├── middleware/          # Express middleware
│   ├── validation.ts
│   └── errorHandler.ts
├── routes/              # API routes
│   └── index.ts
├── utils/               # Utility functions
│   ├── dateUtils.ts     # Timezone calculations
│   └── connectionRules.ts  # Connection validation
├── types/               # TypeScript types
│   └── index.ts
├── app.ts               # Express app setup
└── server.ts            # Server entry point
data/
└── flights.json         # Flight dataset
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Navigate to project directory
cd flight-search-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`

<!-- ### Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start -->
```

## API Endpoints

### Search Flights

Find flights with multiple layovers between two airports.

**Endpoint:** `GET /api/flights/search`

**Query Parameters:**
- `origin` (required) - 3-letter IATA airport code (e.g., JFK)
- `destination` (required) - 3-letter IATA airport code (e.g., LAX)
- `date` (required) - Date in YYYY-MM-DD format (e.g., 2024-03-15)


### Get Airports

List all available airports.

**Endpoint:** `GET /api/flights/airports`

### Get Statistics

Get dataset statistics.

**Endpoint:** `GET /api/flights/stats`

### Health Check

Check API health status.

**Endpoint:** `GET /api/health`


## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*

# Data Configuration
FLIGHTS_DATA_PATH=./data/flights.json
```

## Connection Rules

The system validates connections based on these rules:

| Rule | Requirement |
|------|-------------|
| **Minimum layover (domestic)** | 45 minutes |
| **Minimum layover (international)** | 90 minutes |
| **Maximum layover** | 6 hours (360 minutes) |
| **Airport changes** | Not allowed (must connect at same airport) |
| **Time zones** | All times in local airport time with proper UTC conversion |

**Domestic vs International:**
- A connection is **domestic** if both flights are within the same country
- Based on the `country` field in airport data
- Example: JFK→ORD→LAX = domestic (all US)
- Example: JFK→LHR→CDG = international (US→GB→FR)

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The project includes tests for:
- Connection validation rules
- Layover duration validation
- Domestic vs international detection
- Search functionality (to be added)

## Algorithm Overview

### Search Strategy

The search algorithm uses a breadth-first approach:

1. **Direct Flights**: Find all non-stop flights from origin to destination
2. **1-Stop Connections**: 
   - Find all flights from origin
   - For each, find connecting flights to destination
   - Validate layover times
3. **2-Stop Connections**:
   - Extend 1-stop logic with another layer
   - Prevent circular routes
   - Validate all layovers

### Time Complexity

- **Data Loading**: O(n) where n = number of flights
- **Indexing**: O(n) with hash maps for O(1) lookups
- **Direct Search**: O(1) average case
- **1-Stop Search**: O(m × k) where m = flights from origin, k = average connections
- **2-Stop Search**: O(m × k × j) where j = average second-level connections

### Optimizations

- **Indexed by origin/destination**: Fast airport-specific lookups
- **Indexed by date**: Quick date filtering
- **Early termination**: Skip invalid connections early
- **Pre-computed metadata**: UTC times and durations calculated once

## Timezone Handling

The system handles timezones correctly:

1. **Local Time Storage**: Flight times stored in local airport time
2. **UTC Conversion**: All calculations done in UTC
3. **Duration Calculation**: Accounts for timezone differences
4. **Date Line Crossing**: Handles flights that cross the international date line

**Example:**
```
SYD → LAX (crosses date line)
Departure: 2024-03-15T22:00:00 (Sydney time)
Arrival:   2024-03-15T17:30:00 (LA time)
↑ Arrives "before" departure in local time, but UTC is correct
```

## Error Handling

### Validation Errors (400)

```json
{
  "message": "Validation error",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "origin",
      "message": "Airport code must be 3 uppercase letters"
    }
  ]
}
```

### Not Found Errors (404)

```json
{
  "message": "Invalid origin airport code: XXX",
  "code": "NOT_FOUND"
}
```

### Server Errors (500)

```json
{
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

## Data Format

### Airport Data

```json
{
  "code": "JFK",
  "name": "John F. Kennedy International",
  "city": "New York",
  "country": "US",
  "timezone": "America/New_York"
}
```

### Flight Data

```json
{
  "flightNumber": "SP101",
  "airline": "SkyPath Airways",
  "origin": "JFK",
  "destination": "LAX",
  "departureTime": "2024-03-15T08:30:00",
  "arrivalTime": "2024-03-15T11:45:00",
  "price": 299.00,
  "aircraft": "A320"
}
```

**Important Notes:**
- Times are in **local airport time** (no timezone suffix)
- Use airport's `timezone` field for conversions
- Format: ISO 8601 without timezone

## Performance Considerations

### Current Performance

- **Startup Time**: ~100ms (loads and indexes data)
- **Search Time**: <50ms for most queries
- **Memory Usage**: ~10MB for sample dataset

### Scalability

For larger datasets:
- **Database Integration**: Replace JSON with PostgreSQL/MongoDB
- **Caching**: Add Redis for frequently searched routes
- **Pagination**: Implement result pagination
- **Rate Limiting**: Add request throttling

## Security

Current security measures:
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Zod schemas for all inputs
- **Error Sanitization**: No stack traces in production

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGIN` appropriately
- [ ] Set up process manager (PM2)
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Enable HTTPS
- [ ] Configure firewall

---
