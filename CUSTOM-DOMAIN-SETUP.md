# Custom Domain Setup for solilop.com

This guide explains how to configure your Cloudflare Workers deployment to work with the custom domain `solilop.com`.

## Prerequisites

- Domain `solilop.com` must be added to your Cloudflare account
- Domain DNS should be managed by Cloudflare (nameservers pointing to Cloudflare)

## Setup Steps

### 1. Add Domain to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add a Site" 
3. Enter `solilop.com`
4. Follow the setup wizard to change your nameservers to Cloudflare's

### 2. Configure DNS Records

In your Cloudflare DNS settings for `solilop.com`:

1. **Root domain** (`solilop.com`):
   - Type: `AAAA` 
   - Name: `@`
   - Content: `100::`
   - Proxy status: 🟠 Proxied

2. **WWW subdomain** (`www.solilop.com`):
   - Type: `AAAA`
   - Name: `www` 
   - Content: `100::`
   - Proxy status: 🟠 Proxied

> **Note**: `100::` is a placeholder IPv6 address. Cloudflare will automatically route requests to your Workers when proxied.

### 3. Deploy with Custom Domain

The `wrangler.toml` is already configured with custom domain routes:

```toml
routes = [
  { pattern = "solilop.com/*", custom_domain = true },
  { pattern = "www.solilop.com/*", custom_domain = true }
]
```

Deploy your worker:

```bash
npm run deploy
```

### 4. Verify Setup

After deployment, test your custom domain:

```bash
curl -I https://solilop.com
curl -I https://www.solilop.com
```

Both should return successful responses (200 OK) and serve your application.

## SSL Certificate

Cloudflare automatically provides SSL certificates for proxied domains. Your site will be available over HTTPS immediately.

## Troubleshooting

### Domain not working after deployment

1. **Check DNS propagation**: Use a tool like [WhatsMyDNS](https://www.whatsmydns.net/) to verify DNS records have propagated
2. **Verify proxy status**: Ensure DNS records are set to "Proxied" (🟠 orange cloud)
3. **Check Workers Routes**: In Cloudflare Dashboard → Workers → Your Worker → Triggers, verify the routes are configured
4. **SSL issues**: Wait 10-15 minutes for SSL certificates to be issued

### 502 Bad Gateway errors

1. Check your Worker logs: `wrangler tail`
2. Verify your Worker is deployed: `wrangler deployments list`
3. Test with the workers.dev subdomain first to isolate domain issues

### Custom domain not appearing in Workers

If the custom domain routes don't appear in your Workers dashboard:

1. Make sure the domain is added to your Cloudflare account
2. Verify the domain's zone is active (not pending)
3. Try deploying again after DNS setup is complete

## Alternative: Using Cloudflare Pages

If you prefer, you can also deploy this as a Cloudflare Pages project instead of Workers, which has built-in custom domain support:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build:frontend`
3. Set output directory: `public`
4. Add custom domain in Pages dashboard

## Production Environment Variables

Don't forget to set your production environment variables in the Cloudflare Dashboard:

1. Go to Workers & Pages → Your Worker → Settings → Environment Variables
2. Add production values for:
   - `JWT_SECRET`
   - Any other environment-specific variables

Your application should now be accessible at https://solilop.com! 🎉