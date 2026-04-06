# Quick Start Guide

## 🚀 Local Development

### Prerequisites
- Node.js 18+ with npm
- Python 3.12+
- PostgreSQL database

### Setup Frontend

```bash
cd website

# Install dependencies
npm install

# Set up environment variables
echo 'VITE_BACKEND_URL=http://localhost:8000' > .env.local

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template and update with your database
cp .env.example .env
# Edit .env with your database credentials and secrets

# Run the server
python server.py
```

Backend will be available at `http://localhost:8000`

### Test the Application

```bash
# In browser, visit:
# Frontend: http://localhost:5173
# API docs: http://localhost:8000/docs
# API status: http://localhost:8000/api/status
```

---

## 📦 Build for Production

### Frontend Build

```bash
cd website
npm run build
# Output: website/dist/
```

### Backend Deployment (via Vercel)

Your backend is deployed automatically with Vercel.

---

## 🌐 Deploy to Vercel

### Prerequisites
- GitHub/GitLab account with the project pushed
- Vercel account (https://vercel.com)

### One-Click Deployment

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: Other
   - Build Command: `cd website && npm install && npm run build`
   - Output Directory: `website/dist`

4. **Set Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   
   **Backend Environment:**
   ```
   DATABASE_URL = your-database-url
   JWT_SECRET = your-strong-secret-key
   ADMIN_EMAIL = admin@lion.uz
   ADMIN_PASSWORD = strong-password
   ```

   **Frontend Environment:**
   ```
   VITE_BACKEND_URL = https://your-deployment.vercel.app
   ```

5. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete
   - Visit your deployment URL

---

## ✅ Verification

After deployment, verify:

```bash
# Frontend loads
curl https://your-deployment.vercel.app

# API responds
curl https://your-deployment.vercel.app/api/materials

# API docs available
curl https://your-deployment.vercel.app/docs
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
- Check all dependencies in `package.json` and `requirements.txt`
- Run `npm install` and `pip install -r requirements.txt`

### Database connection errors
- Verify `DATABASE_URL` in environment variables
- Ensure database is accessible from Vercel
- Check PostgreSQL connection string format

### CORS errors
- Backend CORS is configured in `server.py`
- Ensure `VITE_BACKEND_URL` matches your deployment URL

### Build timeout
- Check Vercel logs: Dashboard → Deployments → Logs
- Optimize dependencies or build process
- Increase timeout in `vercel.json` if needed

---

## 📚 More Information

- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Vite Docs**: https://vitejs.dev
- **Full Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎯 Common Commands

```bash
# Frontend
cd website
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run linter

# Backend
cd backend
python server.py  # Start server
python -m pytest  # Run tests

# Verify deployment
node scripts/check-deployment.js  # Pre-deployment checklist
```

---

**Happy coding!** 🚀
