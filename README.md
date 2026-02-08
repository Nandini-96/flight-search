# FlightFinder - Multi-Stop Flight Search Engine

A full-stack flight connection search application that finds optimal flights with multiple layovers with support for direct flights, 1-stop, and 2-stop connections.

## Project Overview

FlightFinder helps users discover flight options by:
- **Finding direct flights** for fastest travel
- **Discovering 1-stop connections** for better pricing
- **Exploring 2-stop routes** for maximum flexibility
- **Validating layovers** with domestic (45 min) and international (90 min) minimum requirements
- **Handling timezones** accurately for cross-timezone and date-line-crossing flights

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Key Features](#-key-features)
- [Architecture Decisions](#-architecture-decisions)
- [Tradeoffs Considered](#-tradeoffs-considered)
- [Future Improvements](#-future-improvements)


---

## Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))

### Installation & Setup

#### 1. Clone or Extract the Project

```bash
cd flight-search
```

You should have two folders:
- `flight-search-backend/`
- `flight-search-frontend/`

#### 2. Setup Backend

```bash
# Navigate to backend
cd flight-search-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm run dev
```

Backend will start at: `http://localhost:3000`

#### 3. Setup Frontend (New Terminal)

```bash
# Navigate to frontend
cd flight-search-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the frontend server
npm run dev
```

Frontend will start at: `http://localhost:5173`

#### 4. Open the Application

Visit `http://localhost:5173` in your browser and start searching for flights!

**Example Search:**
- Origin: `JFK`
- Destination: `LAX`
- Date: `2026-03-15`

---

## Architecture Overview

### Tech Stack

#### Backend (API Server)
- **Node.js + Express** - Web server
- **TypeScript** - Type safety
- **date-fns + date-fns-tz** - Timezone handling
- **Zod** - Runtime validation
- **Jest** - Testing

#### Frontend (UI)
- **React 18 + TypeScript** - UI framework
- **Vite** - Build tool
- **TanStack Query** - Data fetching & caching
- **React Hook Form + Zod** - Form validation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Browser   │  HTTP   │   Express    │  Load   │ flights.   │
│  (React UI) │ ◄─────► │   Backend    │ ◄─────► │  json      │
└─────────────┘         └──────────────┘         └────────────┘
      ▲                        │
      │                        ▼
      │                 ┌──────────────┐
      │                 │    Search    │
      │                 │   Algorithm  │
      │                 └──────────────┘
      │                        │
      └────────────────────────┘
           TanStack Query
           (Caching Layer)
```

---

## Architecture Decisions

### 1. **In-Memory Data Storage vs Database**

**Decision**: In-memory with JSON file

**Why**:
- Faster startup for small datasets (<1000 flights)
- Simpler deployment (no database setup)
- Perfect for demo/prototype
- Sub-millisecond query times

**Tradeoff**:
- Not suitable for large datasets (>10,000 flights)
- No data persistence for bookings/user data
- Limited to single server instance

**When to switch**: Production scale (>10k flights) → Use either PostgreSQL or MongoDB

### 2. **Breadth-First Search Algorithm**

**Decision**: Iterative BFS for multi-stop connections

**Why**:
- Finds all valid paths efficiently
- Natural fit for layered search (0-stop, 1-stop, 2-stop)
- Easy to reason about and test
- Can stop early when max stops reached

**Algorithm Complexity**:
```
Direct:   O(1)        - Hash map lookup
1-stop:   O(m × k)    - m flights from origin, k connections
2-stop:   O(m × k × j) - j second-level connections
```

**Alternatives Considered**:
- Dijkstra's: Overkill for fixed max depth (2 stops)
- DFS: Could miss shortest paths, harder to limit depth
- A*: Unnecessary for small search space


### 3. **React Query for State Management**

**Decision**: TanStack Query instead of Redux/Context

**Why**:
- Built-in caching (reduces API calls)
- Automatic refetching
- Loading/error states handled
- Less boilerplate than Redux
- Perfect for server state

**Tradeoff**:
- Not suitable for complex client-side state
- But we don't have much client state (mostly server data)


### 4. **REST API vs GraphQL**

**Decision**: REST API

**Why**:
- Simpler for single-endpoint use case
- Standard HTTP verbs
- Easier to cache

**When GraphQL makes sense**:
- Multiple related resources
- Complex nested queries
- Mobile apps with limited bandwidth


## Tradeoffs Considered

### 1. **Performance vs Simplicity**

**Decision**: Favor simplicity with acceptable performance

**Tradeoffs**:
- Could pre-compute all possible routes → Faster queries, but complex startup
- Could implement caching layer → Unnecessary for static data
- **Chose**: Simple in-memory hash maps → Fast enough (<50ms)


### 2. **Search Results: Pagination vs All**

**Decision**: Return all results (no pagination)

**Why**:
- Dataset is small (~10-50 results per query)
- Simpler client-side filtering/sorting
- Better UX (see all options at once)

**When to paginate**: >100 results per query


### 3. **Authentication & Authorization**

**Decision**: Not implemented

**Why**:
- Out of scope for assessment
- Would add: JWT tokens, user sessions, protected routes

### 4. **Logging & Monitoring**

**Decision**: Console logging only

**Production would add**:
- Winston/Pino for structured logging
- Sentry for error tracking

---

## Future Improvements

### With More Time (Priority Order)

#### 1. **Search Algorithm Enhancements** (1-2 days)
- [ ] Add price-based optimization (cheapest route)
- [ ] Implement flexible dates (±3 days)
- [ ] Add preferred airlines filter
- [ ] Support multi-city routes (JFK → LAX → SFO)
- [ ] Optimize for specific preferences (fastest, cheapest, fewest stops)

#### 2. **Database Integration** (2-3 days)
- [ ] PostgreSQL for flight data
- [ ] Database indexing for performance
- [ ] Real-time flight updates
- [ ] Historical pricing data
- [ ] User preferences storage

#### 3. **Comprehensive Testing** (2 days)
- [ ] Search algorithm unit tests
- [ ] API integration tests
- [ ] React component tests (React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Load testing (Artillery/k6)
- **Target**: 80%+ code coverage


#### 4. **API Enhancements** (1 day)
- [ ] API versioning (v1, v2)
- [ ] GraphQL endpoint
- [ ] Webhook support
- [ ] API documentation (Swagger/OpenAPI)
- [ ] SDK for third-party integrations

#### 5. **Machine Learning** (5-7 days)
- [ ] Price prediction models
- [ ] Personalized recommendations
- [ ] Demand forecasting
- [ ] Optimal booking time suggestions


---
### Test Coverage

**Backend**:
- Connection rules: 10/10 tests passing
- Timezone handling: Manual testing
- Search algorithm: Should add unit tests

---

**Technologies Used**: React, TypeScript, Node.js, Express, Tailwind CSS, TanStack Query

---

### Challenges Overcome
1. **Timezone calculations**: Date line crossing (SYD → LAX)
2. **Connection validation**: Domestic vs international rules
3. **Search algorithm**: Efficient multi-stop pathfinding
4. **Type safety**: Shared types between frontend/backend
5. **UI/UX**: Balancing information density with clarity

### Would Do Differently
1. **Start with monorepo**: Share types from day one
2. **Write tests first**: TDD for search algorithm
3. **Database from start**: Easier to scale later
4. **More planning**: Sketch UI before coding
5. **Performance testing**: Load test early

---
