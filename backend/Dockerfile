# Container is based on Alpine linux with node.js preinstalled.
FROM node:alpine 
WORKDIR /usr/mynodeapp

# Copy backend files.
COPY ./ ./

# Install project dependencies.
RUN npm install

# The port on which the backend is running.
EXPOSE 3000

# Run server.
CMD ["npm", "start"]