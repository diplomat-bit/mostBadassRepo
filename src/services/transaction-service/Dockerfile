// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/transaction-service/Dockerfile
================================================================================

# Stage 1: Build Environment
# Use a specific Node.js Long Term Support (LTS) version on a minimal Alpine base for reproducibility and small image size.
# This 'builder' stage compiles the application and installs all necessary dependencies.
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and the lock file to leverage Docker's layer caching.
# This layer is only rebuilt when these files change.
COPY package*.json ./

# Install all dependencies, including development dependencies required for building/testing.
# 'npm ci' is used for faster, more reliable, and reproducible builds from the lock file.
RUN npm ci

# Copy the rest of the application's source code into the container.
COPY . .

# Run the build script defined in package.json (e.g., for transpiling TypeScript).
# This creates the production-ready code in a 'dist' directory.
RUN npm run build

# After the build, remove development dependencies to reduce the size of the node_modules
# directory that will be copied to the final image.
RUN npm prune --production


# Stage 2: Production Environment
# Start from a fresh, clean base image to create the final, lean production image.
FROM node:20-alpine AS production

# Set crucial environment variables for production.
# NODE_ENV=production enables performance optimizations in many libraries (e.g., Express).
ENV NODE_ENV=production
# Define the application port, making it configurable.
ENV PORT=3000

# Set the working directory for the production application.
WORKDIR /usr/src/app

# Create a dedicated, non-root user and group for running the application.
# This is a critical security best practice to limit the container's privileges.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the necessary artifacts from the 'builder' stage.
# 1. Copy the pruned production node_modules.
COPY --from=builder /usr/src/app/node_modules ./node_modules
# 2. Copy the compiled application code.
COPY --from=builder /usr/src/app/dist ./dist
# 3. Copy package.json for metadata (e.g., reading the app version).
COPY --from=builder /usr/src/app/package.json ./package.json

# Set the ownership of the application files to the non-root user.
# This ensures the application runs with the correct permissions.
RUN chown -R appuser:appgroup /usr/src/app

# Switch to the non-root user for executing the application.
USER appuser

# Expose the port that the application will listen on.
EXPOSE ${PORT}

# Add a health check to allow container orchestrators (like Kubernetes) to verify
# the application's status. The service should expose a '/healthz' endpoint.
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:${PORT}/healthz || exit 1

# The command to start the application when the container launches.
# It executes the main entry point of the compiled application using Node.js.
CMD [ "node", "dist/main.js" ]