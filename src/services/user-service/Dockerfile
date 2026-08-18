// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/user-service/Dockerfile
================================================================================

# Use a specific version of the official Go image as a builder.
# Using alpine for a smaller build image.
FROM golang:1.22-alpine AS builder

# Set necessary environment variables for the build
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files to leverage Docker cache
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed.
RUN go mod download
RUN go mod verify

# Copy the source code into the container
COPY . .

# Build the Go application.
# -a: force rebuilding of packages that are already up-to-date.
# -ldflags '-w -s': strip debug information to reduce binary size.
# -o /user-service: specify the output file name and location.
# ./cmd/server: path to the main package.
RUN go build -a -installsuffix cgo -ldflags '-w -s' -o /user-service ./cmd/server

# ---

# Start a new, final stage from a minimal base image.
# Alpine is a good choice for its small size and security.
FROM alpine:3.19

# Install ca-certificates for making HTTPS requests to external APIs (GCP, AWS, Auth0, Plaid, etc.)
RUN apk --no-cache add ca-certificates

# Create a dedicated, non-privileged user and group for the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory for the application
WORKDIR /home/appuser

# Copy the compiled binary from the builder stage
COPY --from=builder /user-service .

# Copy any necessary configuration files.
# It's assumed that production configuration will be mounted or passed as environment variables,
# but default/base configs can be included in the image.
COPY ./config/ ./config/

# Ensure the application user owns all the files
RUN chown -R appuser:appgroup /home/appuser

# Switch to the non-root user
USER appuser

# Expose the port the service will listen on.
# This should match the port configured in your application.
EXPOSE 8080

# Add a healthcheck to the container.
# This command will be run periodically by the container runtime to check the service's health.
# It assumes the application has a built-in health check mechanism exposed via a command or an HTTP endpoint.
# Using a command-line check is more self-contained than relying on tools like curl.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["./user-service", "health"]

# Define the entrypoint for the container.
# This makes the container behave like an executable.
ENTRYPOINT ["./user-service"]

# Define the default command.
# This can be overridden when running the container.
# e.g., `docker run <image> migrate` to run database migrations.
CMD ["serve"]