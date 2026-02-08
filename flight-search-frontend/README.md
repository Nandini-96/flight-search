# FlightFinder - Flight Connection Search Engine Frontend

A modern, production-ready React application for searching flight itineraries with support for direct flights and multi-stop connections.

## 🚀 Features

- **Smart Search**: Find direct flights, 1-stop, and 2-stop connections
- **Real-time Validation**: Client-side form validation with helpful error messages
- **Responsive Design**: Mobile-first, beautiful UI that works on all devices
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error handling with user-friendly messages
- **Type Safety**: Full TypeScript support for reliability
- **Performance**: Optimized with React Query for caching and state management

## 🛠️ Technology Stack

### Core
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool with HMR

### State & Data Fetching
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client with interceptors

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - Schema validation

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icons

### Utilities
- **date-fns** - Date manipulation and formatting
- **class-variance-authority** - Variant-based component styling

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Alert.tsx
│   ├── search/                  # Search-specific components
│   │   ├── SearchForm.tsx       # Flight search form
│   │   ├── FlightResults.tsx    # Results container
│   │   ├── FlightCard.tsx       # Individual flight display
│   │   └── EmptyState.tsx       # No results state
│   └── common/                  # Shared components
│       └── LoadingSpinner.tsx
├── features/
│   └── flights/
│       ├── api/
│       │   └── flightApi.ts     # API service layer
│       ├── hooks/
│       │   └── useFlightSearch.ts # React Query hook
│       ├── types/
│       │   └── flight.types.ts  # TypeScript types
│       └── utils/
│           └── flightUtils.ts   # Helper functions
├── lib/
│   ├── axios.ts                 # Axios configuration
│   ├── queryClient.ts           # React Query setup
│   └── utils.ts                 # Utility functions
├── schemas/
│   └── searchSchema.ts          # Zod validation schemas
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## 🏗️ Architecture & Design Patterns

### 1. **Feature-Based Organization**
- Code organized by domain (flights)
- Co-located related files (types, hooks, API)

### 2. **Separation of Concerns**
- **UI Components**: Presentation only
- **Business Logic**: In hooks and utilities
- **API Layer**: Isolated in service files

### 3. **Type Safety**
- Shared TypeScript interfaces
- Zod schemas for runtime validation
- Type inference from schemas

### 4. **Error Handling**
- Global axios interceptors
- React Query error boundaries
- User-friendly error messages

### 5. **Performance Optimization**
- React Query caching
- Lazy loading where appropriate
- Debounced inputs (can be added)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd flight-search-frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
# VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 3: Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Build output will be in the `dist/` directory.

### Step 5: Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 🔧 Configuration

### API Endpoint
Update the API base URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Proxy Configuration
Vite is configured to proxy API requests in development (see `vite.config.ts`):
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

## 🧪 Development Guidelines

### Adding New Components

1. Create component file in appropriate directory
2. Use TypeScript for props
3. Follow existing naming conventions
4. Export from component file

Example:
```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  return <div>{title}</div>;
};
```

### Adding New API Endpoints

1. Add types in `flight.types.ts`
2. Add service method in `flightApi.ts`
3. Create hook in `hooks/`
4. Use in component

### Form Validation

Use Zod schemas for validation:
```typescript
const schema = z.object({
  field: z.string().min(1, 'Required'),
});
```

## 🎨 Styling Guidelines

### Tailwind Classes
- Use utility classes for most styling
- Create components for repeated patterns
- Use `cn()` helper for conditional classes

### Custom Components
- Follow shadcn/ui patterns
- Use CVA for variants
- Keep styles consistent

## 📝 Code Style

### TypeScript
- Use `interface` for object types
- Use `type` for unions/intersections
- Export types from their domain

### React
- Functional components only
- Custom hooks for logic
- Props destructuring

### Naming
- PascalCase for components
- camelCase for functions/variables
- UPPER_CASE for constants

## 🚦 API Integration

### Expected Backend Response Format

```typescript
// GET /api/flights/search?origin=JFK&destination=LAX&date=2024-02-07

{
  "itineraries": [
    {
      "id": "unique-id",
      "segments": [
        {
          "flightNumber": "AA100",
          "airline": "American Airlines",
          "origin": "JFK",
          "destination": "LAX",
          "departureTime": "2024-02-07T08:00:00-05:00",
          "arrivalTime": "2024-02-07T11:30:00-08:00",
          "duration": 330,
          "price": 299.99
        }
      ],
      "layovers": [],
      "totalDuration": 330,
      "totalPrice": 299.99,
      "stops": 0
    }
  ],
  "searchParams": {
    "origin": "JFK",
    "destination": "LAX",
    "date": "2024-02-07"
  },
  "totalResults": 1
}
```

### Error Response Format

```typescript
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

## 🔍 Testing (To Be Implemented)

Recommended testing setup:
- **Vitest** for unit tests
- **React Testing Library** for component tests
- **MSW** for API mocking

## 📈 Performance Considerations

1. **React Query Caching**: Search results cached for 5 minutes
2. **Lazy Loading**: Load components on demand
3. **Debouncing**: Add for autocomplete features
4. **Code Splitting**: Vite handles automatically
5. **Bundle Size**: Monitor with `vite-bundle-visualizer`

## 🐛 Common Issues & Solutions

### Issue: API requests failing
**Solution**: Check `.env` file and ensure backend is running

### Issue: Types not updating
**Solution**: Run `npm run type-check` or restart TypeScript server

### Issue: Styles not applying
**Solution**: Ensure Tailwind is configured correctly, check `tailwind.config.js`

## 🚀 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review code comments

---
