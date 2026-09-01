# Deployment Guide

> How to deploy DrawingBoard to Render.com (free tier)

> **Last Updated:** 2026-09-01

## Architecture

```
┌─────────────────────────────────┐
│  MongoDB Atlas (M0 Free)        │
│  Already configured             │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  Render Web Service (Free)      │
│  Node/Express + Socket.io       │
│  drawingboard-api.onrender.com  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  Render Static Site (Free)      │
│  React build (dist/)            │
│  drawingboard.onrender.com      │
└─────────────────────────────────┘
```

## Prerequisites

- GitHub repo with your code
- MongoDB Atlas cluster (already have one)
- Render.com account (free)

## Step 1: Push to GitHub

```bash
cd "C:\Users\Administrator\Documents\Personal Projects\DrawingBoard"
git add .
git commit -m "Add deployment config"
git push
```

## Step 2: Deploy Backend (Web Service)

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Fill in:

| Field              | Value              |
| ------------------ | ------------------ |
| **Name**           | `drawingboard-api` |
| **Root Directory** | `server`           |
| **Runtime**        | `Node`             |
| **Build Command**  | `npm install`      |
| **Start Command**  | `npm start`        |
| **Instance Type**  | Free               |

4. Add Environment Variables (Advanced → Environment Variables):

| Key           | Value                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI` | `mongodb+srv://sherwincalantoc_db_user:O0LveNKoYty3PQSs@drawingboard.3olmlxt.mongodb.net/?appName=DrawingBoard` |
| `JWT_SECRET`  | `drawingboard-secret-key-2026`                                                                                  |
| `CORS_ORIGIN` | `https://drawingboard.onrender.com`                                                                             |
| `NODE_ENV`    | `production`                                                                                                    |

5. Click **Create Web Service**
6. Wait for deployment to complete
7. Note your backend URL: `https://drawingboard-api.onrender.com`

## Step 3: Deploy Frontend (Static Site)

1. **New +** → **Static Site**
2. Connect your GitHub repo
3. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `drawingboard` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Add Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://drawingboard-api.onrender.com` |
| `VITE_SOCKET_URL` | `https://drawingboard-api.onrender.com` |

5. Click **Deploy Static Site**

## Step 4: Update CORS Origin

After frontend deploys, get its URL (e.g., `https://drawingboard.onrender.com`) and update the backend's `CORS_ORIGIN` env var:

1. Go to Render Dashboard → `drawingboard-api` → **Environment**
2. Update `CORS_ORIGIN` to your actual frontend URL
3. Service will auto-redeploy

## Step 5: MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas → **Network Access**
2. Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Or specifically add Render's IP ranges

## How It Works

### Environment Detection

The client auto-detects the environment:

```js
// client/src/config.js
const isDev = import.meta.env.DEV;

const API_BASE_URL = isDev
  ? 'http://localhost:3000'                          // Development
  : import.meta.env.VITE_API_URL || window.location.origin;  // Production
```

### Dynamic CORS

The server reads the allowed origin from env vars:

```js
// server/server.js
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
```

## Free Tier Limitations

| Limitation | Detail |
|------------|--------|
| **Spin down** | Services spin down after 15min inactivity |
| **Cold start** | ~30s wake-up time on first request |
| **Build time** | 500min/month free build minutes |
| **Bandwidth** | 100GB/month free |
| **Static sites** | Always on (no spin down) |

## Troubleshooting

### "Invalid token" errors
- Ensure `JWT_SECRET` is set on the backend service
- Tokens from dev won't work in production (different secret)

### Socket.io not connecting
- Check that `CORS_ORIGIN` matches your frontend URL exactly
- Ensure backend is using `process.env.PORT` (already configured)

### Blank page after deploy
- Check build logs for errors
- Ensure `VITE_API_URL` is set on the frontend service
- Verify the `dist` folder is being built

### MongoDB connection refused
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify `MONGODB_URI` is correct in Render env vars

## Updating After Deploy

Push to GitHub → Render auto-deploys both services.

```bash
git add .
git commit -m "Update"
git push
# Render picks up changes and redeploys
```

## Manual Deploy via render.yaml

Alternatively, use the `render.yaml` for infrastructure-as-code:

1. Go to Render Dashboard → **New +** → **Blueprint**
2. Connect your repo
3. Render reads `render.yaml` and creates both services automatically
4. Set env vars manually (secrets can't be in yaml)
