# Deployment Setup

This project is configured for automatic deployment to Cloudflare Workers on every push to the main branch.

## GitHub Actions Setup

### Required Repository Secrets

You need to add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:

#### `CLOUDFLARE_API_TOKEN`
- Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
- Click "Create Token"
- Use "Custom token" template
- Set permissions:
  - **Account**: `Cloudflare Workers:Edit`
  - **Zone**: `Zone Settings:Read, Zone:Read` (if using custom domain)
- Set Account Resources: `Include - All accounts`
- Set Zone Resources: `Include - All zones` (if using custom domain)
- Copy the generated token

#### `CLOUDFLARE_ACCOUNT_ID`
- Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
- Select your account
- Copy the Account ID from the right sidebar

## Manual Deployment

If you need to deploy manually:

```bash
# Build frontend and deploy
npm run deploy

# Or step by step:
npm run build:frontend
wrangler deploy --minify
```

## Local Development

```bash
# Start development environment
./dev.sh

# Or run separately:
npm run dev:frontend  # Frontend dev server (port 5173)
npm run dev           # Backend dev server (port 8787)
```

## Environment Variables

For local development, create a `.dev.vars` file in the root directory:

```
JWT_SECRET=your-development-secret
```

For production, set environment variables in Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Go to Settings → Environment Variables
4. Add production secrets

## Custom Domain

This project is configured to deploy to the custom domain `solilop.com`. See [CUSTOM-DOMAIN-SETUP.md](./CUSTOM-DOMAIN-SETUP.md) for detailed domain configuration instructions.

## Deployment Pipeline

1. **Trigger**: Push to main/master branch
2. **Build**: 
   - Install Node.js dependencies
   - Build React frontend with Vite
   - Optimize assets for production
3. **Deploy**: 
   - Deploy to Cloudflare Workers with custom domain routes
   - Update static assets in KV storage
   - Apply minification

## Rollback

If you need to rollback a deployment:

```bash
# Deploy a specific version
wrangler versions deploy [VERSION_ID]

# Or rollback to previous version
wrangler rollback
```

## Monitoring

- **Workers Dashboard**: Monitor function invocations and errors
- **Analytics**: View request analytics and performance metrics  
- **Logs**: Use `wrangler tail` for real-time logs during development

```bash
# View real-time logs
wrangler tail

# View logs for specific deployment
wrangler tail --format=pretty
```