# BetterBallot Deployment Guide

This guide walks you through deploying your BetterBallot application to production using **Render** (backend) and **GitHub Pages** (frontend).

---

## Overview

- **Frontend**: React app deployed to GitHub Pages (free, static hosting)
- **Backend**: Node.js/Express API deployed to Render (free tier with auto-sleep)
- **Database**: SQLite (stored on Render's persistent disk)

---

## Part 1: Deploy Backend to Render

### Step 1: Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account (recommended for easy integration)

### Step 2: Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `mokindacool/BetterBallot`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `betterballot-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Oregon, USA)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Instance Type:**
   - Select **"Free"** (spins down after 15 minutes of inactivity, auto-restarts on request)

### Step 3: Set Environment Variables

In the Render dashboard, go to **Environment** tab and add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | `5002` | Port for the backend server |
| `GOOGLE_PLACES_API_KEY` | `your-actual-api-key` | Your Google Places API key from .env |
| `FRONTEND_URL` | `https://mokindacool.github.io/BetterBallot` | Your GitHub Pages URL (update after frontend deploy) |
| `NODE_ENV` | `production` | Environment mode |
| `JWT_SECRET` | `your-random-secret-string` | For JWT authentication (generate a random string) |

**Important:**
- Copy your `GOOGLE_PLACES_API_KEY` from your local `backend/.env` file
- For `JWT_SECRET`, generate a random string: `openssl rand -base64 32` (run in terminal)

### Step 4: Add Persistent Disk (for SQLite Database)

1. In Render dashboard, go to **"Disks"** tab
2. Click **"Add Disk"**
3. Configure:
   - **Name**: `betterballot-db`
   - **Mount Path**: `/opt/render/project/src/backend/db`
   - **Size**: 1 GB (free tier)
4. Click **"Save"**

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete (watch the logs)
4. Once deployed, you'll get a URL like: `https://betterballot-backend.onrender.com`

### Step 6: Seed the Database

After first deployment:

1. Go to your Render service dashboard
2. Click **"Shell"** tab (opens a terminal)
3. Run these commands:
   ```bash
   cd backend
   npm run seed
   ```
4. Verify candidates were added successfully

### Step 7: Test the Backend

Open your browser and test:
- `https://your-backend-url.onrender.com/` - Should show "Backend server is running"
- `https://your-backend-url.onrender.com/api/candidates` - Should return candidate list

---

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Update Package.json

Add the homepage field to your root `package.json`:

```json
"homepage": "https://mokindacool.github.io/BetterBallot"
```

### Step 2: Update GitHub Actions Workflow

Edit `.github/workflows/static.yml` line 49 to use your Render backend URL:

```yaml
env:
  REACT_APP_BACKEND_URL: https://your-backend-url.onrender.com
  CI: false
```

Replace `your-backend-url` with the actual URL from Render.

### Step 3: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/mokindacool/BetterBallot`
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **"GitHub Actions"**
4. Save

### Step 4: Commit and Push

```bash
git add .
git commit -m "Configure deployment for production"
git push origin main
```

### Step 5: Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Watch the "Deploy static content to Pages" workflow
3. Once complete (green checkmark), your site is live!
4. Visit: `https://mokindacool.github.io/BetterBallot`

---

## Part 3: Update Backend with Frontend URL

Now that your frontend is deployed, update the backend:

1. Go back to your Render dashboard
2. Navigate to your web service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to: `https://mokindacool.github.io/BetterBallot`
5. Click **"Save Changes"**
6. Render will automatically redeploy with the new CORS settings

---

## Testing the Full Application

1. **Frontend**: Visit `https://mokindacool.github.io/BetterBallot`
2. **Backend API**: Check `https://your-backend-url.onrender.com/api/candidates`
3. **Test Features**:
   - Search for addresses (autocomplete should work)
   - View candidate profiles
   - Admin interface (if authentication is set up)

---

## Important Notes

### Free Tier Limitations (Render)

- **Auto-sleep**: Backend spins down after 15 minutes of inactivity
- **Cold starts**: First request after sleep takes ~30 seconds to wake up
- **Solution**: Consider upgrading to paid tier ($7/month) for 24/7 uptime

### Database Persistence

- SQLite data is stored on Render's persistent disk
- **Backup regularly**: Download database from Render Shell
  ```bash
  # In Render Shell
  cat backend/db/betterballot.db > /tmp/backup.db
  ```

### API Keys Security

- Never commit `.env` files to GitHub
- Always use Render's environment variables for sensitive data
- Rotate API keys periodically

### Custom Domain (Optional)

To use `www.betterballot.info`:

**For Frontend (GitHub Pages):**
1. Add CNAME file to `public/` folder with: `www.betterballot.info`
2. Configure DNS with your domain registrar
3. Update `homepage` in package.json

**For Backend (Render):**
1. Go to Render → Settings → Custom Domain
2. Add your domain
3. Configure DNS as instructed by Render

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `GOOGLE_PLACES_API_KEY` is valid

### Frontend can't reach backend
- Check browser console for CORS errors
- Verify `FRONTEND_URL` is set correctly in Render
- Ensure `REACT_APP_BACKEND_URL` points to correct Render URL

### Database is empty
- Run seed script in Render Shell: `npm run seed`
- Check persistent disk is mounted correctly

### GitHub Pages 404 errors
- Ensure `homepage` is set in package.json
- Check routing - React Router may need `HashRouter` instead of `BrowserRouter`
- Add a `404.html` file to handle client-side routing

---

## Maintenance

### Update Candidates
1. Use the admin interface at `/admin`
2. Or update via API calls
3. Changes persist in SQLite database on Render

### Redeploy Backend
- Push to GitHub `main` branch
- Render auto-deploys on push

### Redeploy Frontend
- Push to GitHub `main` branch
- GitHub Actions auto-deploys on push

---

## Cost Summary

| Service | Tier | Cost | Limitations |
|---------|------|------|-------------|
| Render (Backend) | Free | $0/month | Auto-sleep after 15 min, 750 hrs/month |
| GitHub Pages (Frontend) | Free | $0/month | Static files only, 100GB bandwidth/month |
| Total | - | **$0/month** | Good for development/testing |

### Upgrade Options:
- Render Starter: $7/month (no auto-sleep, more resources)
- Custom domain: ~$12/year (domain registration)

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to GitHub Pages
3. ✅ Update CORS settings
4. Test the full application
5. Set up custom domain (optional)
6. Configure monitoring/analytics
7. Set up database backups

---

## Support

If you encounter issues:
1. Check Render logs (Logs tab in dashboard)
2. Check GitHub Actions logs (Actions tab in repo)
3. Review browser console for frontend errors
4. Consult Render documentation: [https://render.com/docs](https://render.com/docs)

---

**Deployed by**: GitHub Actions + Render
**Last Updated**: 2024
