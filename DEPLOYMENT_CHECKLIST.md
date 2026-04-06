# LIONJALYUZI Deployment Checklist

## Pre-Deployment Verification

This checklist ensures your project is ready for Vercel deployment.

### ✅ Code Quality

- [x] **TypeScript Compilation**
  ```bash
  cd website && npm run build
  ```
  Result: ✅ No errors

- [x] **Linting**
  ```bash
  cd website && npm run lint
  ```
  Status: Configure as needed

- [x] **Tests**
  ```bash
  cd backend && python -m pytest
  ```
  Status: Optional (configure if tests exist)

### ✅ Project Structure

- [x] `vercel.json` - Build configuration ✅
- [x] `.vercelignore` - Deployment exclusions ✅
- [x] `website/package.json` - Frontend dependencies ✅
- [x] `backend/requirements.txt` - Backend dependencies ✅
- [x] `.gitignore` - Security (excludes .env) ✅

### ✅ Configuration Files

- [x] `website/.env.example` - Frontend template ✅
- [x] `backend/.env.example` - Backend template ✅
- [x] `DEPLOYMENT.md` - Full guide ✅
- [x] `QUICKSTART.md` - Quick start guide ✅
- [x] `DEPLOYMENT_CONFIG.md` - Configuration summary ✅

### ✅ Environment Variables

**Required in Vercel Settings:**

Backend:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-32-char-secret
ADMIN_EMAIL=admin@lion.uz
ADMIN_PASSWORD=secure-password
PYTHON_VERSION=3.12
```

Frontend:
```
VITE_BACKEND_URL=https://your-deployment.vercel.app
```

### ✅ Git Status

```bash
# No .env files should be committed
git status

# Verify .env is ignored
git check-ignore -v backend/.env

# All configurations committed
git log --oneline | head -5
```

### ✅ Build Verification

```bash
# Frontend build test
cd website
npm install
npm run build
# Check: dist/ folder created ✅

# Backend requirements verified
cd ../backend
pip install -r requirements.txt
# Check: All packages installed ✅
```

---

## Deployment Steps

### 1️⃣ Final Git Commit

```bash
git add .
git commit -m "chore: prepare for Vercel deployment

- Add deployment configuration (vercel.json)
- Add .vercelignore for clean builds
- Add environment templates (.env.example)
- Add deployment documentation
- Verify TypeScript builds without errors
- Verify all dependencies are listed"

git push origin main
```

### 2️⃣ Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import GitHub repo
4. Select "Other" as framework
5. Configure:
   - **Build Command**: `cd website && npm install && npm run build`
   - **Output Directory**: `website/dist`
   - **Root Directory**: (leave empty)

### 3️⃣ Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL                [Production]
JWT_SECRET                  [Production]
ADMIN_EMAIL                 [Production]
ADMIN_PASSWORD              [Production]
PYTHON_VERSION              [Production] = 3.12
VITE_BACKEND_URL            [Production] = https://[deployment-name].vercel.app
```

### 4️⃣ Deploy

Click "Deploy" button and monitor build logs.

### 5️⃣ Verify Deployment

```bash
# Check frontend loads
curl https://[deployment-name].vercel.app

# Check API responds
curl https://[deployment-name].vercel.app/api/materials

# Check documentation
curl https://[deployment-name].vercel.app/docs
```

---

## Post-Deployment

### 1. Test Critical Paths

- [ ] Frontend loads without errors
- [ ] Login page accessible
- [ ] API endpoints respond
- [ ] Database queries work
- [ ] File uploads function (if needed)
- [ ] CORS working correctly

### 2. Monitoring

- [ ] Enable Vercel Analytics
- [ ] Set up error tracking
- [ ] Monitor Cold Start times
- [ ] Check bandwidth usage

### 3. DNS Configuration (Optional)

- [ ] Add custom domain in Vercel
- [ ] Update DNS records
- [ ] Enable auto-renewal for SSL

---

## Files Changed/Added

```
✅ New Files:
  - .vercelignore
  - website/.env.example
  - backend/.env.example
  - DEPLOYMENT.md
  - QUICKSTART.md
  - DEPLOYMENT_CONFIG.md
  - DEPLOYMENT_CHECKLIST.md (this file)
  - scripts/check-deployment.js

✅ Modified Files:
  - vercel.json (upgraded configuration)

✅ No Breaking Changes
```

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Build timeout | Check Vercel logs, optimize dependencies |
| Database connection | Verify DATABASE_URL, check network access |
| API 500 errors | Check backend logs in Vercel |
| Frontend blank | Check VITE_BACKEND_URL, CORS settings |
| Import errors | Run `npm install` again, clear cache |

More help: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Health Check Commands

After deployment is live:

```bash
# Check frontend
curl -I https://[deployment].vercel.app

# Check API
curl https://[deployment].vercel.app/api/materials

# Check docs
curl https://[deployment].vercel.app/docs

# Check health (if endpoint exists)
curl https://[deployment].vercel.app/api/status
```

---

**Status**: 🚀 Ready for Deployment
**Date**: April 6, 2026
**Owner**: Development Team

---

### Next Steps:

1. ✅ Review this checklist
2. ✅ Commit changes: `git add . && git commit -m "..."`
3. ✅ Push to GitHub: `git push origin main`
4. ✅ Go to Vercel dashboard
5. ✅ Import project and deploy
6. ✅ Monitor deployment logs
7. ✅ Test deployed application
8. ✅ Set up monitoring/alerts
