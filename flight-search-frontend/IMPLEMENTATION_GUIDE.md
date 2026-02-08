# Step-by-Step Implementation Guide

This guide walks through building the FlightFinder frontend from scratch.

## Phase 1: Project Setup (30 minutes)

### Step 1.1: Initialize Vite Project
```bash
npm create vite@latest flight-search-frontend -- --template react-ts
cd flight-search-frontend
```

### Step 1.2: Install Core Dependencies
```bash
npm install react react-dom
npm install @tanstack/react-query axios
npm install react-hook-form @hookform/resolvers zod
npm install date-fns date-fns-tz
npm install lucide-react
```

### Step 1.3: Install Styling Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
npm install clsx tailwind-merge class-variance-authority
npx tailwindcss init -p
```

### Step 1.4: Install Dev Dependencies
```bash
npm install -D @types/react @types/react-dom
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Step 1.5: Configure TypeScript
- Update `tsconfig.json` with strict settings
- Add path aliases (`@/*`)
- Configure module resolution

### Step 1.6: Configure Tailwind
- Update `tailwind.config.js` with custom theme
- Add CSS custom properties for theming
- Create `src/index.css` with Tailwind directives

---

## Phase 2: Project Architecture (45 minutes)

### Step 2.1: Create Directory Structure
```bash
mkdir -p src/{components/{ui,search,common},features/flights/{api,hooks,types,utils},lib,schemas}
```

### Step 2.2: Setup Core Utilities

**Create `src/lib/utils.ts`**
- Implement `cn()` helper for class merging
- Add type utilities if needed

**Create `src/lib/axios.ts`**
- Configure axios instance
- Add request/response interceptors
- Implement error handling

**Create `src/lib/queryClient.ts`**
- Configure React Query client
- Set cache and retry policies
- Configure default options

### Step 2.3: Define TypeScript Types

**Create `src/features/flights/types/flight.types.ts`**
- Define all domain types:
  - `Airport`
  - `FlightSegment`
  - `Layover`
  - `Itinerary`
  - `SearchParams`
  - `SearchResponse`
  - `ApiError`

---

## Phase 3: UI Components (1 hour)

### Step 3.1: Create Base UI Components

Follow shadcn/ui patterns for consistency:

**Button** (`src/components/ui/Button.tsx`)
- CVA variants (default, destructive, outline, etc.)
- Size variants (default, sm, lg, icon)
- Proper TypeScript types

**Input** (`src/components/ui/Input.tsx`)
- Forward ref for form integration
- Proper focus/disabled states
- Accessible attributes

**Card** (`src/components/ui/Card.tsx`)
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Composable design
- Consistent spacing

**Alert** (`src/components/ui/Alert.tsx`)
- Variants (default, destructive, warning)
- AlertTitle and AlertDescription sub-components
- Icon support

### Step 3.2: Create Common Components

**LoadingSpinner** (`src/components/common/LoadingSpinner.tsx`)
- Size variants
- Optional message
- Lucide icon integration

---

## Phase 4: Business Logic Layer (1 hour)

### Step 4.1: Create Validation Schema

**Create `src/schemas/searchSchema.ts`**
```typescript
- Origin validation (3-letter IATA code)
- Destination validation
- Date validation (not in past)
- Cross-field validation (origin ≠ destination)
```

### Step 4.2: Create API Service

**Create `src/features/flights/api/flightApi.ts`**
```typescript
- searchFlights(params) function
- formatDateForApi helper
- Proper error propagation
```

### Step 4.3: Create Custom Hook

**Create `src/features/flights/hooks/useFlightSearch.ts`**
```typescript
- Wrap API call in React Query
- Handle enabled state
- Configure caching
- Type the response
```

### Step 4.4: Create Utility Functions

**Create `src/features/flights/utils/flightUtils.ts`**
```typescript
- formatDuration(minutes): string
- formatTime(isoDateTime): string
- formatPrice(price): string
- getStopText(stops): string
- getLayoverCategory(minutes)
```

---

## Phase 5: Feature Components (1.5 hours)

### Step 5.1: Search Form Component

**Create `src/components/search/SearchForm.tsx`**

Implementation checklist:
- [ ] React Hook Form integration
- [ ] Zod schema validation
- [ ] Origin airport input with validation
- [ ] Destination airport input with validation
- [ ] Date picker with min date
- [ ] Submit button with loading state
- [ ] Error message display
- [ ] Helper text for inputs
- [ ] Auto-capitalize airport codes
- [ ] Search summary display

### Step 5.2: Empty State Component

**Create `src/components/search/EmptyState.tsx`**
- Icon display
- Helpful message
- Search tips
- Suggestions for user

### Step 5.3: Flight Card Component

**Create `src/components/search/FlightCard.tsx`**

Complex component - build incrementally:
1. **Header Section**
   - Origin/destination display
   - Departure/arrival times
   - Total price

2. **Flight Segments**
   - Timeline indicator
   - Airline and flight number
   - Segment times and duration
   - Price per segment

3. **Layover Information**
   - Layover duration
   - Domestic vs international
   - Visual indicators

4. **Footer Section**
   - Quick stats summary
   - Total duration
   - Number of flights/stops

### Step 5.4: Flight Results Component

**Create `src/components/search/FlightResults.tsx`**
- Results header with count
- Flight type breakdown
- Map over itineraries
- Empty state integration

---

## Phase 6: Main Application (30 minutes)

### Step 6.1: Create App Component

**Create `src/App.tsx`**

Implementation:
1. State management for search params
2. useFlightSearch hook integration
3. Header with branding
4. SearchForm integration
5. Loading state handling
6. Error state handling
7. Results display
8. Initial state (before search)
9. Footer

### Step 6.2: Create Entry Point

**Update `src/main.tsx`**
- Wrap App in React.StrictMode
- Import global styles
- Mount to DOM

---

## Phase 7: Configuration & Polish (30 minutes)

### Step 7.1: Environment Variables
```bash
# Create .env file
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 7.2: Vite Configuration
**Update `vite.config.ts`**
- Add path aliases resolution
- Configure proxy for API
- Set server port

### Step 7.3: HTML Template
**Update `index.html`**
- Add meta tags
- Set title
- Add favicon

### Step 7.4: Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Phase 8: Testing & Refinement (45 minutes)

### Step 8.1: Manual Testing

Test these scenarios:
- [ ] Valid search with results
- [ ] Valid search with no results
- [ ] Invalid airport codes
- [ ] Same origin and destination
- [ ] Past date selection
- [ ] Empty form submission
- [ ] Network error handling
- [ ] Server error handling

### Step 8.2: UI/UX Polish

- [ ] Responsive design on mobile
- [ ] Loading states smooth
- [ ] Error messages clear
- [ ] Success states celebratory
- [ ] Accessibility (keyboard navigation)
- [ ] Color contrast
- [ ] Font sizes readable

### Step 8.3: Performance

- [ ] Check bundle size
- [ ] Verify lazy loading
- [ ] Test React Query caching
- [ ] Optimize re-renders

---

## Phase 9: Documentation (30 minutes)

### Step 9.1: Code Comments
- Add JSDoc comments to complex functions
- Document prop types
- Explain business logic

### Step 9.2: README
- Installation instructions
- Configuration guide
- API integration details
- Troubleshooting section

### Step 9.3: Environment Template
- Create `.env.example`
- Document all variables

---

## Timeline Summary

| Phase | Duration | Description |
|-------|----------|-------------|
| 1. Project Setup | 30 min | Initialize project, install dependencies |
| 2. Architecture | 45 min | Create structure, setup utilities |
| 3. UI Components | 60 min | Build reusable components |
| 4. Business Logic | 60 min | API, hooks, utilities |
| 5. Feature Components | 90 min | Search form, results, cards |
| 6. Main App | 30 min | Integrate everything |
| 7. Configuration | 30 min | Environment, build config |
| 8. Testing & Polish | 45 min | Manual testing, refinement |
| 9. Documentation | 30 min | Comments, README |
| **Total** | **6 hours** | Complete implementation |

---

## Best Practices Applied

### 1. **Component Design**
- Single Responsibility Principle
- Composable components
- Reusable UI primitives

### 2. **Type Safety**
- TypeScript everywhere
- Zod for runtime validation
- Proper type inference

### 3. **State Management**
- React Query for server state
- Local state for UI state
- No global state needed

### 4. **Error Handling**
- Axios interceptors
- React Query error handling
- User-friendly messages

### 5. **Performance**
- React Query caching
- Proper memo usage (if needed)
- Code splitting ready

### 6. **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

### 7. **Code Organization**
- Feature-based structure
- Clear separation of concerns
- Consistent naming

---

## Next Steps (Future Enhancements)

### Short Term
1. Add autocomplete for airport codes
2. Implement flight sorting options
3. Add filters (price range, stops, airlines)
4. Save search history
5. Add favorites/bookmarks

### Medium Term
1. Add unit tests (Vitest)
2. Add E2E tests (Playwright)
3. Implement dark mode
4. Add print functionality
5. Email itinerary option

### Long Term
1. Multi-city search
2. Price alerts
3. Calendar view
4. Mobile app (React Native)
5. Offline support (PWA)

---

## Troubleshooting Guide

### Issue: Styles not applying
**Solution:**
- Check Tailwind config
- Verify CSS import order
- Run `npm run dev` fresh

### Issue: TypeScript errors
**Solution:**
- Run `npm run type-check`
- Check tsconfig.json
- Verify import paths

### Issue: API errors
**Solution:**
- Check `.env` configuration
- Verify backend is running
- Check network tab in DevTools
- Review axios interceptors

### Issue: React Query not caching
**Solution:**
- Check query keys
- Verify queryClient config
- Check enabled conditions

---

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Tools
- [Vite](https://vitejs.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

### Community
- [React Discord](https://discord.gg/react)
- [TypeScript Discord](https://discord.gg/typescript)
- Stack Overflow for specific issues

---
