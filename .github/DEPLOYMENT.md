# Deployment Guide

## 🚀 Quick Deployment Setup

### Step 1: Choose Your Hosting Platform

#### **Vercel (Web Frontend) - Recommended**
Best for: React, Next.js, Vue, Svelte frontends

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import this GitHub repository
4. Select root directory: `apps/web`
5. Set environment variables from `.env.example`
6. Deploy!

**GitHub Secrets needed:**
```
VERCEL_TOKEN=your_token_here
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

#### **Railway (Full Stack) - Good Alternative**
Best for: Complete monorepo deployment

1. Go to [railway.app](https://railway.app)
2. Create new project → GitHub
3. Select this repository
4. Add services:
   - Web (Dockerfile target: web-prod)
   - API (Dockerfile target: api-prod)
   - PostgreSQL (included)
5. Deploy!

#### **Docker + Self-Hosted (VPS/Dedicated)**
Best for: Full control, custom requirements

```bash
# Build images
docker build --target web-prod -t your-registry/domislink-web .
docker build --target api-prod -t your-registry/domislink-api .

# Push to registry
docker push your-registry/domislink-web
docker push your-registry/domislink-api

# Deploy with docker-compose
docker-compose up -d
```

### Step 2: Configure GitHub Secrets

Go to: **Settings** → **Secrets and variables** → **Actions**

#### For Vercel Deployment:
```
VERCEL_TOKEN: From https://vercel.com/account/tokens
VERCEL_ORG_ID: From Vercel dashboard settings
VERCEL_PROJECT_ID: From Vercel project settings
```

#### For Railway Deployment:
```
RAILWAY_TOKEN: From https://railway.app/account/tokens
```

### Step 3: Configure Environment Variables

1. Copy `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Update each hosting platform with environment variables:
   - **Vercel**: Project Settings → Environment Variables
   - **Railway**: Project → Variables
   - **Docker**: Update `docker-compose.yml` or `.env`

### Step 4: Trigger Deployment

#### **Automatic (Recommended)**
Push to `main` branch - GitHub Actions will:
- Build all apps
- Run linting & type checks
- Deploy automatically

#### **Manual**
```bash
# For Vercel
vercel --prod --token $VERCEL_TOKEN

# For Railway
railway deploy --token $RAILWAY_TOKEN
```

## 📊 Deployment Architecture

### Vercel (Frontend Only)
```
GitHub → Push → GitHub Actions → Vercel Deploy
                                    ↓
                            domislink-web.vercel.app
                            (calls external API)
```

### Railway (Full Stack)
```
GitHub → Push → GitHub Actions → Railway
                                    ├── Web Service (Port 80)
                                    ├── API Service (Port 3000)
                                    └── PostgreSQL (Port 5432)
```

### Docker (Self-Hosted)
```
GitHub → Push → GitHub Actions → Docker Registry
                                    ↓
                        Your VPS/Server
                        (docker-compose up)
```

## 🔍 Monitoring Deployments

### GitHub Actions
- Go to repository → **Actions** tab
- Watch build and deployment logs in real-time

### Vercel
- Dashboard shows build status and analytics
- Environmental metrics and performance

### Railway
- Dashboard shows deployment status
- Logs available in real-time

## 🔧 Troubleshooting

### Build Fails
```bash
# Check logs
npm run lint
npm run type-check
npm run build

# Clear cache
npm run clean
npm install
npm run build
```

### Deployment Fails
1. Check GitHub Actions logs
2. Verify environment variables are set
3. Ensure all secrets are configured
4. Check platform-specific logs (Vercel/Railway dashboard)

### Performance Issues
1. Check Docker images: `docker images`
2. Verify resource limits in docker-compose.yml
3. Enable gzip compression (nginx.conf)
4. Use CDN (Cloudflare, Vercel Edge)

## 📈 Scaling

### Horizontal Scaling
```bash
# docker-compose.yml
services:
  api:
    deploy:
      replicas: 3
```

### Using load balancer (nginx)
```nginx
upstream api {
    server api1:3000;
    server api2:3000;
    server api3:3000;
}
```

## 🔐 Security Best Practices

1. **Never commit `.env`** - Only use `.env.example`
2. **Rotate secrets regularly** in GitHub and hosting platforms
3. **Use HTTPS** - Enable on all platforms
4. **Enable branch protection** on main branch
5. **Require status checks** before merging PR
6. **Regular backups** of PostgreSQL data

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Docker Docs**: https://docs.docker.com
- **GitHub Actions**: https://docs.github.com/en/actions
