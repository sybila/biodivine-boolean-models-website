FROM node:alpine
WORKDIR /usr/bbm-website

# Copy importable lib projects, the target backend, monorepo package.json and package-lock and root tscondig.json
COPY ./libs ./libs
COPY ./apps/backend ./apps/backend
COPY ./package*.json .
COPY ./tsconfig.json .

# Generate database types
WORKDIR /usr/bbm-website/libs/database
RUN npm ci
RUN npm run generate

# Install backend dependencies with npm clean install
WORKDIR /usr/bbm-website/apps/backend
RUN npm ci

# The port on which the backend is running
EXPOSE 3000

# Run server
CMD ["npm", "start"]