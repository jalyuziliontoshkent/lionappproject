# Vercel Deployment Guide

This guide explains how to deploy the LIONJALYUZI project to Vercel.

## Project Structure

```
.
├── website/          # React + TypeScript frontend (built with Vite)
├── backend/          # FastAPI Python backend
├── frontend/         # React Native/Expo (skip for web deployment)
└── vercel.json       # Vercel configuration
```

## Prerequisites

- Vercel account (https://vercel.com)
- Project pushed to GitHub/GitLab
- Environment variables configured

## Environment Variables Setup

### Backend Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-strong-secret-key-min-32-chars
ADMIN_EMAIL=admin@lion.uz
ADMIN_PASSWORD=admin123secure
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong random value in production
- Use a secure PostgreSQL database URL (e.g., from Render, Railway, Supabase)
- Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Enable "Sensitive Data Encryption" for JWT_SECRET in Vercel

### Frontend Environment Variables

Set in Vercel Project Settings:

```
VITE_BACKEND_URL=https://your-deployment.vercel.app
```

Replace `your-deployment` with your actual Vercel deployment URL.

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: (leave empty or set to `.`)
   - **Build Command**: `cd website && npm install && npm run build`
   - **Output Directory**: `website/dist`
   - **Environment Variables**: Add the variables from above

### 3. Deploy

Click "Deploy" and Vercel will automatically:
- Install dependencies for both frontend and backend
- Build the React app
- Deploy the FastAPI backend
- Configure the routing

### 4. Verify Deployment

1. Check the Deployment logs in Vercel dashboard
2. Visit your deployment URL
3. Test API endpoints: `https://your-deployment.vercel.app/api/materials`
4. Verify frontend loads correctly

## Project Configuration Details

### vercel.json

The `vercel.json` file configures:

- **Frontend**: Static build with Vite (output to `dist/`)
- **Backend**: Python 3.12 serverless functions
- **Routes**: 
  - `/api/*` → FastAPI backend
  - `/assets/*` → Static assets
  - `/*` → Frontend SPA (index.html)

### Installation & Building

- **Frontend**: Uses `package.json` in website directory
- **Backend**: Uses `requirements.txt` for Python dependencies
- **Build**: Automatically runs `npm install`, `npm run build`, and generates backend serverless functions

## Development Locally

### Frontend Development

```bash
cd website
npm install
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Build for production
```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
python server.py  # Start FastAPI on http://localhost:8000
```

### Environment Setup

1. Create `website/.env.local`:
```
VITE_BACKEND_URL=http://localhost:8000
```

2. Backend uses `.env` in backend directory (already configured)

## Troubleshooting

### "Module not found" errors

- Check `requirements.txt` contains all dependencies
- Verify Python version compatibility (3.12)

### API responds with 500 errors

- Check **Vercel Logs** in dashboard
- Verify `DATABASE_URL` and `JWT_SECRET` are set
- Check database connectivity

### Frontend can't reach API

- Verify `VITE_BACKEND_URL` is set correctly
- Check CORS configuration in backend
- Ensure API routes are mapped in `vercel.json`

### Build fails

- Run `npm run build` locally to test
- Check `tsc -b` TypeScript compilation
- Verify all imports are correct

## Database Setup

The project expects a PostgreSQL database. Free options:

1. **Render.com**: https://render.com/docs/databases
2. **Supabase**: https://supabase.com
3. **Railway**: https://railway.app
4. **Vercel Postgres**: https://vercel.com/storage/postgres

## Custom Domain

1. In Vercel Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for DNS propagation (usually 24-48 hours)

## Monitoring & Logs

1. **Real-time logs**: Vercel Dashboard → Deployments → Logs
2. **Function logs**: Check individual serverless functions
3. **Analytics**: Monitor in Vercel Analytics tab

## Redeploy

1. Push changes to GitHub (main branch)
2. Vercel automatically deploys (if auto-deploy enabled)
3. Manual redeploy: Vercel Dashboard → Deployments → ... → Redeploy

## Security Best Practices

- ✅ Set strong `JWT_SECRET` (>32 characters)
- ✅ Use environment variables for all secrets (never commit `.env`)
- ✅ Enable "Sensitive Data Encryption" in Vercel
- ✅ Use HTTPS (automatic with Vercel)
- ✅ Set CORS headers appropriately in FastAPI
- ✅ Validate all API inputs
- ✅ Use secure database with strong passwords

## Performance Tips

1. Enable gzip compression (automatic with Vercel)
2. Optimize images in the frontend
3. Use CDN for static assets
4. Implement caching headers
5. Monitor Vercel Analytics

---

**For more help**: Check Vercel documentation at https://vercel.com/docs
