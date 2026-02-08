# FlightFinder Backend - Windows Setup Guide

Complete setup instructions for Windows (Command Prompt, PowerShell, or Git Bash).

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Git (optional, for version control)

## Option 1: Command Prompt (CMD)

```cmd
REM Navigate to your projects directory
cd C:\Users\YourUsername\Projects

REM Create project directory
mkdir flight-search-backend
cd flight-search-backend

REM Initialize npm project
npm init -y

REM Install dependencies
npm install express cors helmet morgan compression dotenv zod date-fns date-fns-tz uuid

REM Install dev dependencies
npm install --save-dev @types/express @types/cors @types/morgan @types/compression @types/node @types/uuid @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest ts-jest tsx typescript

REM Create directory structure
mkdir src\controllers
mkdir src\services
mkdir src\middleware
mkdir src\routes
mkdir src\utils
mkdir src\utils\__tests__
mkdir src\types
mkdir data

REM Create empty files
type nul > src\controllers\FlightController.ts
type nul > src\services\DataLoader.ts
type nul > src\services\FlightSearchService.ts
type nul > src\middleware\validation.ts
type nul > src\middleware\errorHandler.ts
type nul > src\routes\index.ts
type nul > src\utils\dateUtils.ts
type nul > src\utils\connectionRules.ts
type nul > src\utils\__tests__\connectionRules.test.ts
type nul > src\types\index.ts
type nul > src\app.ts
type nul > src\server.ts
type nul > tsconfig.json
type nul > jest.config.js
type nul > .env
type nul > data\flights.json

REM Copy files from provided source code
REM (You'll need to manually copy the file contents)

REM Start development server
npm run dev
```

## Option 2: PowerShell (Recommended)

```powershell
# Navigate to your projects directory
Set-Location C:\Users\YourUsername\Projects

# Create project directory
New-Item -ItemType Directory -Path flight-search-backend
Set-Location flight-search-backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express cors helmet morgan compression dotenv zod date-fns date-fns-tz uuid

# Install dev dependencies
npm install --save-dev @types/express @types/cors @types/morgan @types/compression @types/node @types/uuid @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest ts-jest tsx typescript

# Create directory structure
New-Item -ItemType Directory -Force -Path src\controllers
New-Item -ItemType Directory -Force -Path src\services
New-Item -ItemType Directory -Force -Path src\middleware
New-Item -ItemType Directory -Force -Path src\routes
New-Item -ItemType Directory -Force -Path src\utils\__tests__
New-Item -ItemType Directory -Force -Path src\types
New-Item -ItemType Directory -Force -Path data

# Create files
$files = @(
    "src\controllers\FlightController.ts",
    "src\services\DataLoader.ts",
    "src\services\FlightSearchService.ts",
    "src\middleware\validation.ts",
    "src\middleware\errorHandler.ts",
    "src\routes\index.ts",
    "src\utils\dateUtils.ts",
    "src\utils\connectionRules.ts",
    "src\utils\__tests__\connectionRules.test.ts",
    "src\types\index.ts",
    "src\app.ts",
    "src\server.ts",
    "tsconfig.json",
    "jest.config.js",
    ".env",
    "data\flights.json"
)

foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force
}

Write-Host "✅ Project structure created!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Copy file contents from the provided source code"
Write-Host "2. Run: npm run dev"
Write-Host "3. Open: http://localhost:3000"
```

## Option 3: Automated PowerShell Script

Save this as `setup-backend.ps1`:

```powershell
# setup-backend.ps1
param(
    [string]$ProjectPath = "C:\Users\$env:USERNAME\Projects\flight-search-backend"
)

Write-Host "🚀 FlightFinder Backend Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Create project directory
Write-Host "📁 Creating project directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $ProjectPath | Out-Null
Set-Location $ProjectPath

# Initialize package.json
Write-Host "📦 Initializing npm project..." -ForegroundColor Yellow
$packageJson = @"
{
  "name": "flight-search-backend",
  "version": "1.0.0",
  "description": "Flight connection search engine API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["flight", "search", "api"],
  "license": "MIT"
}
"@
$packageJson | Out-File -FilePath "package.json" -Encoding UTF8

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
npm install --silent express cors helmet morgan compression dotenv zod date-fns date-fns-tz uuid

# Install dev dependencies
Write-Host "📥 Installing dev dependencies..." -ForegroundColor Yellow
npm install --silent --save-dev @types/express @types/cors @types/morgan @types/compression @types/node @types/uuid @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest ts-jest tsx typescript

# Create directory structure
Write-Host "📂 Creating directory structure..." -ForegroundColor Yellow
$directories = @(
    "src\controllers",
    "src\services",
    "src\middleware",
    "src\routes",
    "src\utils\__tests__",
    "src\types",
    "data"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Create .env file
Write-Host "⚙️  Creating .env file..." -ForegroundColor Yellow
@"
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*

# Data Configuration
FLIGHTS_DATA_PATH=./data/flights.json
"@ | Out-File -FilePath ".env" -Encoding UTF8

# Create .gitignore
Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
@"
node_modules/
dist/
.env
.env.local
*.log
coverage/
.DS_Store
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the source files into the appropriate directories"
Write-Host "2. Add your flights.json data to the data/ folder"
Write-Host "3. Run: npm run dev"
Write-Host "4. Visit: http://localhost:3000`n"

# Ask to open in VS Code
$openVSCode = Read-Host "Open in VS Code? (y/n)"
if ($openVSCode -eq 'y') {
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code .
    } else {
        Write-Host "VS Code not found in PATH" -ForegroundColor Yellow
    }
}
```

**To run:**
```powershell
# Run the script
.\setup-backend.ps1

# Or specify custom path
.\setup-backend.ps1 -ProjectPath "D:\MyProjects\flight-backend"
```

## After Setup

### 1. Copy Source Files

Copy all the TypeScript files from the provided source code into your project:

- Copy `src/` folder contents
- Copy `data/flights.json`
- Copy `tsconfig.json`
- Copy `jest.config.js`

### 2. Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check TypeScript compilation
npm run type-check

# List dependencies
npm list --depth=0
```

### 3. Start Development Server

```bash
# Development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 4. Test the API

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test search endpoint
curl "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2024-03-15"

# Test airports endpoint
curl http://localhost:3000/api/flights/airports
```

Or use PowerShell:

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# Test search endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2024-03-15"
```

## Troubleshooting

### Issue: npm not recognized

**Solution:**
```cmd
# Add Node.js to PATH or reinstall from nodejs.org
# Then restart your terminal
```

### Issue: Port 3000 already in use

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3001
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Run type check
npm run type-check

# Rebuild
npm run build
```

### Issue: Module not found

**Solution:**
```bash
# Clear node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: Permission errors

**Solution:**
```powershell
# Run PowerShell as Administrator
# Or use:
npm config set scripts-prepend-node-path true
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Development Workflow

1. **Make changes** to TypeScript files
2. **Auto-reload** happens via `tsx watch`
3. **Check types** with `npm run type-check`
4. **Run tests** with `npm test`
5. **Build** with `npm run build`

## IDE Setup (VS Code)

### Recommended Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Need help?** Check the main README.md or create an issue!