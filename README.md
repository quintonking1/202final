# OnSight - Climbing Route Finder

A React application for discovering and exploring climbing routes using interactive maps.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Mapbox GL JS** - Interactive maps
- **react-map-gl** - React wrapper for Mapbox

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Mapbox API token ([Get one here](https://account.mapbox.com/access-tokens/))

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd 202final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Mapbox token:
   ```
   VITE_MAPBOX_TOKEN= mapbox token goes here. 
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # React components
├── data/          # Mock data and constants
├── utils/         # Utility functions
└── assets/        # Images, icons, etc.
```

## Development

This project uses:
- **Hot Module Replacement (HMR)** for instant updates during development
- **ESLint** for code quality
- **Tailwind CSS** for styling

## License

Private project
