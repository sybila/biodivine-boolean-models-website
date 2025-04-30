FROM node:22-alpine AS builder
WORKDIR /usr/bbm-website

# Copy importable lib projects, the target backend, monorepo package.json and package-lock and root tsconfig.json
COPY ./libs ./libs
COPY ./apps/backend ./apps/backend
COPY ./package*.json ./tsconfig.json ./

# Install dependencies with npm clean install
RUN npm ci

# Generate database types
RUN npm run generate -w database

# Build backend
RUN npm run build -w backend

################################
FROM node:22-alpine AS runner
WORKDIR /usr/bbm-website

# Copy root manifests for workspace map and exact versions, tsconfig for paths resolution
COPY --from=builder /usr/bbm-website/package.json /usr/bbm-website/package-lock.json /usr/bbm-website/tsconfig.json ./

# Copy the backend manifest to trick npm into understanding workspace dependencies
COPY --from=builder /usr/bbm-website/apps/backend/package.json  ./apps/backend/package.json

# Copy transpiled js files
COPY --from=builder /usr/bbm-website/apps/backend/dist ./

# Copy generated db js files
COPY --from=builder /usr/bbm-website/libs/database/src/generated ./libs/database/src/generated/

# Debug print to see if the repo structure fits
RUN tree  .

# Clean install only the backend’s production deps
RUN npm ci --omit=dev --workspace=apps/backend

# Debug print to see if appropriate modules were installed
RUN ls -a node_modules

EXPOSE 3000

CMD ["node", "-r", "tsconfig-paths/register", "apps/backend/src/index.js"]