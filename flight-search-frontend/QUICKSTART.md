# Quick Start Guide

Get the FlightFinder frontend running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm installed
- Backend API running on `http://localhost:3000`

## Installation

```bash
# 1. Navigate to project
cd flight-search-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser!

## Available Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Project Features

✅ **Search Flights** - Enter origin, destination, and date
✅ **View Results** - See direct and multi-stop itineraries
✅ **Detailed Info** - Flight times, layovers, prices
✅ **Error Handling** - Graceful error messages
✅ **Loading States** - Smooth loading indicators
✅ **Responsive Design** - Works on all screen sizes

## Testing the App

### Example Search
- **Origin**: JFK
- **Destination**: LAX
- **Date**: Any future date

### Expected Backend Response
The backend should return:
```json
{
  "itineraries": [...],
  "searchParams": {
    "origin": "JFK",
    "destination": "LAX",
    "date": "2024-02-07"
  },
  "totalResults": 5
}
```

## Common Issues

### Port already in use
```bash
# Change port in vite.config.ts
server: { port: 5174 }
```

### Backend not connecting
- Check `.env` has correct API URL
- Verify backend is running
- Check browser console for CORS errors

### TypeScript errors
```bash
npm run type-check
```

## File Structure

```
src/
├── components/       # React components
├── features/flights/ # Flight domain logic
├── lib/             # Shared utilities
├── schemas/         # Validation schemas
└── App.tsx          # Main app
```

## Next Steps

1. ✅ Start the backend API
2. ✅ Configure `.env` file
3. ✅ Run `npm run dev`
4. ✅ Open browser to `http://localhost:5173`
5. ✅ Try searching for flights!

## Need Help?

- Check the full [README.md](./README.md)
- Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Check browser console for errors
- Verify backend API is responding

---

**Ready to fly? 🛫**