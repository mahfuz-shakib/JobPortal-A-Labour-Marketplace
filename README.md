# Labour-Marketplace

## Deployment Guide

### Backend (Vercel)
1. Go to [Vercel](https://vercel.com/) and import the `server/` directory as a new project.
2. Set the following environment variables in the Vercel dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret for JWT
   - `SENDGRID_API_KEY`: (If using email features) Your SendGrid API key
   - `EMAIL_FROM`: (If using email features) The sender email address
3. Vercel will use `vercel.json` and `index.js` as entry point. No build step is needed for Node.js API.
4. Ensure CORS in `server/index.js` allows your frontend domain (already set for Netlify).

### Frontend (Netlify)
1. Go to [Netlify](https://netlify.com/) and import the `client/` directory as a new project.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. No environment variables are required for the frontend by default.
4. The Vite proxy in `vite.config.js` is set to the Vercel backend URL for `/api` requests.
5. (Optional) Add a `netlify.toml` file for SPA routing:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://labour-marketplace.vercel.app/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Testing
- After deployment, test the full flow: registration, login, job posting, bidding, reviews, etc.
- Check CORS and API connectivity from frontend to backend.

### Local Development
- Backend: `cd server && npm install && npm run dev`
- Frontend: `cd client && npm install && npm run dev`
- Ensure `.env` is set up in `server/` for local dev.
