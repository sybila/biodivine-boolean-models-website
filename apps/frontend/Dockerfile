FROM node:alpine AS builder
WORKDIR /usr/bbm-website

# Copy importable lib projects, the target frontend, monorepo package.json and package-lock and root tsconfig.json
COPY ./libs ./libs
COPY ./apps/frontend ./apps/frontend
COPY ./package*.json ./tsconfig*.json ./

# Copy backend tsconfig to shutup resolving paths warning in later build step
COPY ./apps/backend/tsconfig.json ./apps/backend/

# This is just a dummy URL for generating prisma schema; it won't be used in production
ENV DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"

# Install dependencies with npm clean install
RUN npm ci

# Generate database types
RUN npm run schema-generate

# Build frontend
RUN npm run build -w ./apps/frontend

##############################
FROM nginx:1-alpine AS runner

# Install bash
RUN apk update
RUN apk add --no-cache bash

COPY --from=builder /usr/bbm-website/apps/frontend/dist /www

COPY apps/frontend/nginx.conf /etc/nginx/nginx.conf
COPY apps/frontend/startup.sh .

RUN chmod +x ./startup.sh
CMD ["/bin/bash", "-c", "./startup.sh"]