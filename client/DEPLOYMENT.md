# WorkMatch Deployment Guide

## Environment Setup

### Development (Localhost)
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **API URL**: `http://localhost:5000/api`

### Production
- **Frontend**: `https://labour-marketplace.netlify.app/`
- **Backend**: `https://labour-marketplace.vercel.app/`
- **API URL**: `https://labour-marketplace.vercel.app/api`

## Environment Variables

### Frontend (Client)
The frontend uses environment variables to switch between development and production API URLs:

#### `.env.local` (Development)
```
VITE_API_URL=http://localhost:5000/api
```

#### `.env.production` (Production)
```
VITE_API_URL=https://labour-marketplace.vercel.app/api
```

## API Configuration

All API calls now use the centralized configuration in `src/config/api.js`:

```javascript
import { createApiUrl, API_ENDPOINTS } from '../config/api';

// Example usage
const response = await axios.get(createApiUrl(API_ENDPOINTS.JOBS));
```

## Deployment Steps

### 1. Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Set environment variable in Netlify:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://labour-marketplace.vercel.app/api`

### 2. Backend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `server/`
3. Deploy as Node.js application

## Testing

### Local Development
1. Start backend: `cd server && npm start`
2. Start frontend: `cd client && npm run dev`
3. Frontend will automatically use local backend via `.env.local`

### Production Testing
1. Deploy backend to Vercel
2. Deploy frontend to Netlify
3. Frontend will automatically use production backend via `.env.production`

## Important Notes

- The Vite proxy has been removed from `vite.config.js`
- All API calls now use environment variables
- Environment files are automatically selected based on build mode
- Development uses `.env.local`
- Production uses `.env.production`

## Troubleshooting

### API Connection Issues
1. Check environment variables are set correctly
2. Verify backend is running and accessible
3. Check CORS settings in backend
4. Ensure API endpoints are correct

### Build Issues
1. Clear node_modules and reinstall: `npm ci`
2. Check for missing dependencies
3. Verify environment files exist and are readable

## File Structure
```
client/
├── .env.local          # Development API URL
├── .env.production     # Production API URL
├── src/
│   ├── config/
│   │   └── api.js      # Centralized API configuration
│   └── ...             # Updated components using new API config
└── vite.config.js      # Updated (proxy removed)
``` 