# Frontend Setup Instructions

This frontend is built with **Create React App**.

## Initial Setup

If you haven't created the React app yet, you can either:

### Option 1: Use Existing Frontend (Recommended)
The frontend is already set up. Just follow the steps below.

### Option 2: Create New React App
If you want to start fresh:

```bash
cd frontend
npx create-react-app .
# Say yes when asked if you want to overwrite existing files
```

Then copy over all the source files from `src/` directory.

## Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This will install:
   - React and React DOM
   - React Scripts (Create React App)
   - Material-UI components
   - React Router
   - Axios
   - And other dependencies

3. **Start the development server**
   ```bash
   npm start
   ```

   The app will:
   - Start on port 3000
   - Automatically open in your browser
   - Hot reload when you make changes

## Important Files

- `src/index.js` - Entry point
- `src/App.jsx` - Main app component with routing
- `src/setupProxy.js` - Proxy configuration for API calls
- `public/index.html` - HTML template
- `package.json` - Dependencies and scripts

## API Proxy Configuration

The frontend uses `setupProxy.js` to proxy API requests to the Django backend. This avoids CORS issues during development.

The proxy automatically forwards requests from `/api/*` to `http://localhost:8000/api/*`.

## Troubleshooting

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
PORT=3001 npm start
```

### API connection errors
- Make sure Django backend is running on port 8000
- Check that `setupProxy.js` exists in `src/` directory

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

