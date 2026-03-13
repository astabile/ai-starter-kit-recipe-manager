---
name: deploy-docker
description: Build and deploy the MERN stack application using Docker and Docker Compose for production environments
---

# Docker Deployment Workflow

This skill guides you through containerizing and deploying the Recipe Manager application using Docker and Docker Compose.

## When to Use This Skill

Use this skill when:
- You need to **deploy the application to production**
- You want to **containerize the application**
- You're **setting up a Docker-based deployment**
- You need to **create production Docker images**
- You want to **deploy with Docker Compose**
- You're **troubleshooting Docker deployments**

## Prerequisites

- Docker installed (version 20.x or higher)
- Docker Compose installed (version 2.x or higher)
- Project built and tested locally
- Environment variables configured

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Compose              │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  Client  │  │  Server  │       │
│  │  (React) │  │ (Express)│       │
│  │  :80     │  │  :5001   │       │
│  └────┬─────┘  └────┬─────┘       │
│       │             │              │
│       │             │              │
│       │        ┌────▼─────┐       │
│       │        │ MongoDB  │       │
│       │        │  :27017  │       │
│       │        └──────────┘       │
└───────┼─────────────────────────┬─┘
        │                         │
        ▼                         ▼
   Port 80 (nginx)          Port 5001
```

## Workflow Steps

### 1. Create Backend Dockerfile

Create `server/Dockerfile`:

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
```

### 2. Create Frontend Dockerfile

Create `client/Dockerfile`:

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Create Nginx Configuration

Create `client/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://server:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Create Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:latest
    container_name: recipe-manager-mongodb-prod
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: recipe-manager
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    networks:
      - recipe-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API Server
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: recipe-manager-server-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 5001
      MONGODB_URI: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/recipe-manager?authSource=admin
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - recipe-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3

  # Frontend Client
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL:-http://localhost:5001/api}
    container_name: recipe-manager-client-prod
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      server:
        condition: service_healthy
    networks:
      - recipe-network

volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local

networks:
  recipe-network:
    driver: bridge
```

### 5. Create Production Environment File

Create `.env.production`:

```env
# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password-here

# API URL (for client)
VITE_API_URL=http://your-domain.com/api
```

### 6. Create .dockerignore Files

Create `server/.dockerignore`:
```
node_modules
npm-debug.log
dist
.env
.env.*
.git
.gitignore
README.md
coverage
*.test.ts
__tests__
```

Create `client/.dockerignore`:
```
node_modules
npm-debug.log
dist
.env
.env.*
.git
.gitignore
README.md
coverage
*.test.ts
*.test.tsx
__tests__
```

### 7. Build Docker Images

```bash
# Build backend image
docker build -t recipe-manager-api:latest ./server

# Build frontend image
docker build -t recipe-manager-client:latest ./client

# Or build all with docker-compose
docker-compose -f docker-compose.prod.yml build
```

### 8. Run Production Deployment

```bash
# Load environment variables
export $(cat .env.production | xargs)

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check service health
docker-compose -f docker-compose.prod.yml ps
```

### 9. Verify Deployment

```bash
# Check if containers are running
docker ps

# Test health endpoints
curl http://localhost/api/health

# Check MongoDB connection
docker exec -it recipe-manager-mongodb-prod mongosh -u admin -p your-password

# View application logs
docker logs recipe-manager-server-prod
docker logs recipe-manager-client-prod
```

## Deployment Commands

### Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f server
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose -f docker-compose.prod.yml build

# Restart services with new images
docker-compose -f docker-compose.prod.yml up -d
```

## Production Optimizations

### Multi-Stage Builds
- Reduces final image size
- Separates build and runtime dependencies
- Faster deployment times

### Security Best Practices
```dockerfile
# Use non-root user
USER nodejs

# Use specific versions
FROM node:22-alpine

# Minimize layers
RUN npm ci && npm cache clean --force

# Health checks
HEALTHCHECK --interval=30s CMD curl -f http://localhost/health || exit 1
```

### Resource Limits

Update `docker-compose.prod.yml`:

```yaml
services:
  server:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Monitoring and Maintenance

### Container Health Monitoring
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' recipe-manager-server-prod

# Auto-restart unhealthy containers
docker update --restart=unless-stopped recipe-manager-server-prod
```

### Log Management
```bash
# Limit log size in docker-compose.prod.yml
services:
  server:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Backup Database
```bash
# Create backup
docker exec recipe-manager-mongodb-prod mongodump --out=/backup

# Copy backup to host
docker cp recipe-manager-mongodb-prod:/backup ./mongodb-backup

# Restore from backup
docker exec -i recipe-manager-mongodb-prod mongorestore /backup
```

## Cloud Deployment

### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker tag recipe-manager-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/recipe-manager-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/recipe-manager-api:latest
```

### Google Cloud Run
```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/<project>/recipe-manager-api

# Deploy to Cloud Run
gcloud run deploy recipe-manager-api --image gcr.io/<project>/recipe-manager-api --platform managed
```

### DigitalOcean App Platform
```bash
# Use doctl CLI
doctl apps create --spec app.yaml
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs recipe-manager-server-prod

# Inspect container
docker inspect recipe-manager-server-prod

# Check network
docker network inspect recipe-network
```

### MongoDB Connection Issues
```bash
# Verify MongoDB is running
docker exec -it recipe-manager-mongodb-prod mongosh

# Check connection string
echo $MONGODB_URI

# Test connection from server container
docker exec -it recipe-manager-server-prod ping mongodb
```

### Port Conflicts
```bash
# Find process using port
lsof -i :80

# Change port in docker-compose
ports:
  - "8080:80"
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: docker-compose -f docker-compose.prod.yml build
      
      - name: Push to registry
        run: |
          docker tag recipe-manager-api:latest ${{ secrets.REGISTRY }}/recipe-manager-api:latest
          docker push ${{ secrets.REGISTRY }}/recipe-manager-api:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
```

## Success Criteria

✅ All containers start successfully
✅ Health checks pass for all services
✅ Application accessible on port 80
✅ API endpoints responding correctly
✅ Database persists data across restarts
✅ Logs show no errors
✅ Resource usage is optimal

## Next Steps

After deploying:
1. Set up SSL/TLS with Let's Encrypt
2. Configure domain and DNS
3. Set up monitoring (Prometheus, Grafana)
4. Configure automated backups
5. Implement rolling updates
6. Set up log aggregation
