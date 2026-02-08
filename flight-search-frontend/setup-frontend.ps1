# setup-frontend.ps1
# Complete setup script for FlightFinder Frontend

Write-Host "Starting FlightFinder Frontend Setup..." -ForegroundColor Cyan

# Set project name
$ProjectName = "flight-search-frontend"

# Create project
Write-Host "`nCreating Vite project..." -ForegroundColor Yellow
npm create vite@latest $ProjectName -- --template react-ts

# Navigate into project
Set-Location $ProjectName

# Install dependencies
Write-Host "`nInstalling dependencies (this may take a few minutes)..." -ForegroundColor Yellow

# Core dependencies
npm install --silent react react-dom @tanstack/react-query axios react-hook-form @hookform/resolvers zod date-fns date-fns-tz lucide-react clsx tailwind-merge class-variance-authority

# Dev dependencies
npm install --silent -D tailwindcss postcss autoprefixer @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react-hooks eslint-plugin-react-refresh typescript vite @vitejs/plugin-react

# Initialize Tailwind
Write-Host "`n🎨 Initializing Tailwind CSS..." -ForegroundColor Yellow
npx tailwindcss init -p

# Create directory structure
Write-Host "`nCreating directory structure..." -ForegroundColor Yellow
$Directories = @(
    "src\components\ui",
    "src\components\search",
    "src\components\common",
    "src\features\flights\api",
    "src\features\flights\hooks",
    "src\features\flights\types",
    "src\features\flights\utils",
    "src\lib",
    "src\schemas"
)

foreach ($Dir in $Directories) {
    New-Item -ItemType Directory -Force -Path $Dir | Out-Null
}

# Create files
Write-Host "`nCreating component files..." -ForegroundColor Yellow
$Files = @(
    "src\components\ui\Button.tsx",
    "src\components\ui\Input.tsx",
    "src\components\ui\Card.tsx",
    "src\components\ui\Alert.tsx",
    "src\components\search\SearchForm.tsx",
    "src\components\search\FlightCard.tsx",
    "src\components\search\FlightResults.tsx",
    "src\components\search\EmptyState.tsx",
    "src\components\common\LoadingSpinner.tsx",
    "src\features\flights\api\flightApi.ts",
    "src\features\flights\hooks\useFlightSearch.ts",
    "src\features\flights\types\flight.types.ts",
    "src\features\flights\utils\flightUtils.ts",
    "src\lib\axios.ts",
    "src\lib\queryClient.ts",
    "src\lib\utils.ts",
    "src\schemas\searchSchema.ts",
    "tsconfig.node.json"
)

foreach ($File in $Files) {
    New-Item -ItemType File -Force -Path $File | Out-Null
}

# Create .env file
Write-Host "`nCreating environment file..." -ForegroundColor Yellow
@"
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=FlightFinder
"@ | Out-File -FilePath .env -Encoding UTF8

# Create .gitignore
Write-Host "`nCreating .gitignore..." -ForegroundColor Yellow
@"
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
"@ | Out-File -FilePath .gitignore -Encoding UTF8

Write-Host "`n Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Copy the file contents from the provided source code"
Write-Host "2. Run: npm run dev"
Write-Host "3. Open: http://localhost:5173"
Write-Host "`n Happy coding!" -ForegroundColor Magenta

# Open in VS Code if available
if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host "`nOpening project in VS Code..." -ForegroundColor Yellow
    code .
}