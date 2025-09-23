# Deployment Guide

This guide covers different deployment options for the Admin Dashboard application.

## 🚀 Quick Deploy Options

### 1. GitHub Pages (Recommended for Demo)

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **Deploy automatically**
   - Push to main branch
   - The GitHub Actions workflow will build and deploy automatically
   - Your app will be available at `https://yourusername.github.io/admin-dashboard`

### 2. Netlify

1. **Connect your repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"

3. **Custom domain (optional)**
   - Go to Site settings > Domain management
   - Add your custom domain

### 3. Vercel

1. **Deploy with Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect React settings

2. **Configure environment**
   - Build command: `npm run build`
   - Output directory: `build`
   - Install command: `npm install`

### 4. Heroku

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Add buildpack**
   ```bash
   heroku buildpacks:set https://github.com/mars/create-react-app-buildpack.git
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

## 🏗️ Production Build

### Build the application
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Test the production build locally
```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build

# Or use npx
npx serve -s build
```

## 🔧 Environment Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_ENVIRONMENT=production

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

### Build Configuration
The app uses Create React App, so you can configure:

- `PUBLIC_URL` - Set the public URL for the app
- `GENERATE_SOURCEMAP` - Set to false for production
- `INLINE_RUNTIME_CHUNK` - Set to false for better caching

## 🐳 Docker Deployment

### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build and run
```bash
docker build -t admin-dashboard .
docker run -p 80:80 admin-dashboard
```

## 🔒 Security Considerations

### HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Use secure headers

### Environment Variables
- Never commit sensitive data to version control
- Use environment variables for configuration
- Rotate API keys regularly

### Content Security Policy
Add CSP headers to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 📊 Performance Optimization

### Build Optimization
- The production build is already optimized
- Minified JavaScript and CSS
- Tree shaking enabled
- Code splitting implemented

### Caching
- Static assets are cached with long expiration
- Use CDN for better performance
- Enable gzip compression

### Monitoring
- Add analytics tracking
- Monitor Core Web Vitals
- Set up error tracking (Sentry, LogRocket)

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Routing issues**
   - Configure server to serve index.html for all routes
   - Check PUBLIC_URL environment variable

3. **API calls fail**
   - Check CORS configuration
   - Verify API endpoints
   - Check network connectivity

### Debug Mode
Enable debug mode by setting:
```env
REACT_APP_DEBUG=true
```

## 📝 Post-Deployment Checklist

- [ ] Test all user flows
- [ ] Verify responsive design
- [ ] Check performance metrics
- [ ] Test with different browsers
- [ ] Verify SSL certificate
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Update documentation

## 🔄 Continuous Deployment

### GitHub Actions
The repository includes GitHub Actions workflows for:
- CI/CD pipeline
- Automated testing
- Deployment to GitHub Pages

### Custom Deployment
For custom deployment, modify the `.github/workflows/deploy.yml` file to match your deployment target.

## 📞 Support

If you encounter issues during deployment:
1. Check the troubleshooting section
2. Review the logs
3. Create an issue on GitHub
4. Check the documentation

---

**Happy Deploying! 🚀**

