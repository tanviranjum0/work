# FullEstate

FullEstate is a React/Vite property search app served by an Express and MongoDB API.

## Local development

Use Node.js 20.19+ or 22.12+ for the Vite build.

1. Copy back/.env.example to back/.env, then set the MongoDB, JWT, cookie, and Cloudinary values. Generate different random values of at least 32 bytes for JWT_SECRET and COOKIE_SECRET.
2. Install and start the API from main/back with npm ci and npm run dev.
3. In another terminal, install and start the frontend from main/front with npm ci and npm run dev.

The Vite development server forwards /api requests to http://localhost:4000. Set VITE_API_TARGET in front/.env to use another backend address.

The server accepts exact frontend origins through FRONTEND_ORIGIN and CORS_ORIGINS. In production, serve the site over HTTPS and set NODE_ENV=production so authentication cookies use the Secure attribute.

Profile and property images are uploaded through the API. The backend checks file signatures and size before storing images in separate Cloudinary folders. Keep Cloudinary API credentials on the server; the frontend does not need an unsigned upload preset.
