// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/scripts/setup_dev_env.sh
================================================================================

#!/bin/bash

# setup_dev_env.sh
# A utility shell script to help developers quickly set up a consistent local development environment.
# Supports Docker Compose and Tilt for multi-service orchestration.

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error.
# Exit if any command in a pipeline fails.
set -euo pipefail

# --- Configuration ---
PROJECT_NAME="OurAwesomePlatform" # Replace with your actual project name
DOCKER_COMPOSE_FILE="docker-compose.yml" # Or compose.yaml, ensure this matches your project
TILTFILE="Tiltfile" # Ensure this matches your project if using Tilt
ENV_TEMPLATE=".env.template" # Template for environment variables
ENV_FILE=".env" # Actual environment file

# --- Colors for output ---
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# --- Helper Functions ---

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

# Checks if a command exists.
# Usage: check_command "command_name" "Error message if not found"
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}[ERROR]${NC} $2" >&2
        return 1
    fi
    return 0
}

# Attempts to install Docker Compose.
install_docker_compose() {
    log_info "Attempting to install Docker Compose..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if check_command "brew" "Homebrew not found. Please install Homebrew (https://brew.sh) or Docker Compose manually."; then
            log_info "Installing Docker Compose via Homebrew..."
            brew install docker-compose || log_error "Failed to install Docker Compose via Homebrew. Please install it manually."
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if check_command "pip3" ""; then
            log_info "Installing Docker Compose via pip3..."
            sudo pip3 install docker-compose || log_error "Failed to install Docker Compose via pip3. Please install it manually."
        else
            log_warn "pip3 not found. Attempting to install python3-pip via system package manager..."
            if command -v apt &> /dev/null; then
                sudo apt update && sudo apt install -y python3-pip || log_error "Failed to install python3-pip via apt. Please install pip3 or Docker Compose manually."
            elif command -v yum &> /dev/null; then
                sudo yum install -y python3-pip || log_error "Failed to install python3-pip via yum. Please install pip3 or Docker Compose manually."
            elif command -v dnf &> /dev/null; then
                sudo dnf install -y python3-pip || log_error "Failed to install python3-pip via dnf. Please install pip3 or Docker Compose manually."
            else
                log_error "No suitable package manager found to install pip3. Please install pip3 or Docker Compose manually."
            fi
            # Try installing docker-compose again after pip3 is installed
            if check_command "pip3" ""; then
                log_info "Retrying Docker Compose installation via pip3..."
                sudo pip3 install docker-compose || log_error "Failed to install Docker Compose via pip3. Please install it manually."
            fi
        fi
    else
        log_error "Unsupported OS for automatic Docker Compose installation. Please install Docker Compose manually: https://docs.docker.com/compose/install/"
    fi

    # Verify installation
    if check_command "docker-compose" ""; then
        log_success "Docker Compose (standalone) installed successfully."
    elif check_command "docker" "" && docker compose version &> /dev/null; then
        log_success "Docker Compose (plugin) is available via 'docker compose'."
    else
        log_error "Docker Compose installation failed or could not be verified. Please install it manually: https://docs.docker.com/compose/install/"
    fi
}

# Attempts to install Tilt.
install_tilt() {
    log_info "Attempting to install Tilt..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if check_command "brew" "Homebrew not found. Please install Homebrew (https://brew.sh) or Tilt manually."; then
            log_info "Installing Tilt via Homebrew..."
            brew install tiltdev/tilt/tilt || log_error "Failed to install Tilt via Homebrew. Please install it manually."
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        log_info "Installing Tilt via curl..."
        curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash || log_error "Failed to install Tilt via curl. Please install it manually."
    else
        log_error "Unsupported OS for automatic Tilt installation. Please install Tilt manually: https://docs.tilt.dev/install.html"
    fi

    if check_command "tilt" ""; then
        log_success "Tilt installed successfully."
    else
        log_error "Tilt installation failed or could not be verified. Please install it manually: https://docs.tilt.dev/install.html"
    fi
}

# --- Main Script Logic ---

main() {
    log_info "Welcome to the ${PROJECT_NAME} Development Environment Setup!"
    log_info "This script will help you get your local development environment up and running."

    # 1. Check for Git
    if ! check_command "git" "Git is required but not installed."; then
        log_error "Git not found. Please install Git to continue."
    fi
    log_success "Git is installed."

    # 2. Check for Docker
    if ! check_command "docker" "Docker is required but not installed. Please install Docker Desktop (https://www.docker.com/products/docker-desktop)."; then
        log_error "Docker not found. Please install Docker Desktop and ensure it's running."
    fi
    log_success "Docker is installed."

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker Desktop and try again."
    fi
    log_success "Docker daemon is running."

    # 3. Check for .env file
    if [ ! -f "$ENV_FILE" ]; then
        log_warn "No '$ENV_FILE' found. Creating one from '$ENV_TEMPLATE'..."
        if [ -f "$ENV_TEMPLATE" ]; then
            cp "$ENV_TEMPLATE" "$ENV_FILE"
            log_success "'$ENV_FILE' created. Please review and update it with your local environment variables."
            log_info "You might need to edit '$ENV_FILE' with API keys, database credentials, etc."
        else
            log_warn "No '$ENV_TEMPLATE' found. You may need to create a '$ENV_FILE' manually based on project requirements."
        fi
    else
        log_info "'$ENV_FILE' already exists. Skipping creation."
    fi

    # 4. Determine setup method
    local use_tilt=false
    local use_docker_compose=false

    local tilt_available=false
    if check_command "tilt" ""; then
        tilt_available=true
        log_success "Tilt is installed."
    else
        log_warn "Tilt is not installed. It's recommended for a better development experience (live reloading, multi-service orchestration)."
        read -p "Do you want to install Tilt now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_tilt
            if check_command "tilt" ""; then
                tilt_available=true
            fi
        fi
    fi

    local docker_compose_available=false
    if check_command "docker-compose" "" || (check_command "docker" "" && docker compose version &> /dev/null); then
        docker_compose_available=true
        log_success "Docker Compose is installed."
    else
        log_warn "Docker Compose is not installed."
        read -p "Do you want to install Docker Compose now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_docker_compose
            if check_command "docker-compose" "" || (check_command "docker" "" && docker compose version &> /dev/null); then
                docker_compose_available=true
            fi
        fi
    fi

    # Prioritize Tilt if available and Tiltfile exists
    if $tilt_available && [ -f "$TILTFILE" ]; then
        log_info "Tiltfile found. Tilt is the recommended way to run this project for live development."
        read -p "Do you want to set up using Tilt? (Y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z "$REPLY" ]]; then
            use_tilt=true
        fi
    fi

    # Fallback to Docker Compose if Tilt is not chosen or not available, and docker-compose.yml exists
    if ! $use_tilt && $docker_compose_available && [ -f "$DOCKER_COMPOSE_FILE" ]; then
        log_info "Docker Compose file found."
        if ! $tilt_available || [ ! -f "$TILTFILE" ]; then
            log_info "Tilt is not available or Tiltfile not found. Proceeding with Docker Compose."
            use_docker_compose=true
        else
            read -p "Do you want to set up using Docker Compose instead of Tilt? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                use_docker_compose=true
            fi
        fi
    fi

    if ! $use_tilt && ! $use_docker_compose; then
        log_error "No valid setup method selected or available. Please ensure you have Docker Compose or Tilt installed and their respective configuration files (${DOCKER_COMPOSE_FILE} or ${TILTFILE}) exist."
    fi

    # 5. Execute chosen setup method
    if $use_tilt; then
        log_info "Starting development environment with Tilt..."
        log_info "This will build images, start services, and open the Tilt UI in your browser (usually http://localhost:10350)."
        log_info "Press Ctrl+C in the Tilt UI or this terminal to stop Tilt."
        tilt up --watch=true --port 10350 # Explicit port for clarity
        log_success "Tilt services stopped."
    elif $use_docker_compose; then
        log_info "Building Docker images with Docker Compose..."
        # Try 'docker compose' first (plugin), then 'docker-compose' (standalone)
        if command -v docker &> /dev/null && docker compose version &> /dev/null; then
            docker compose build || log_error "Docker Compose build failed."
        elif command -v docker-compose &> /dev/null; then
            docker-compose build || log_error "Docker Compose build failed."
        else
            log_error "Neither 'docker compose' nor 'docker-compose' command found. This should not happen if checks passed."
        fi
        log_success "Docker images built."

        log_info "Starting services with Docker Compose in detached mode..."
        if command -v docker &> /dev/null && docker compose version &> /dev/null; then
            docker compose up -d || log_error "Docker Compose services failed to start."
        elif command -v docker-compose &> /dev/null; then
            docker-compose up -d || log_error "Docker Compose services failed to start."
        fi
        log_success "Services started in detached mode."
        log_info "To view running containers: 'docker compose ps'"
        log_info "To view logs: 'docker compose logs -f'"
        log_info "To stop services: 'docker compose down'"
    fi

    log_success "Development environment setup complete!"
    log_info "You can now access your services. Check your project documentation for specific URLs."
    log_info "Happy coding!"
}

# Ensure the script is run from the project root
# This assumes the script is in scripts/setup_dev_env.sh
# Using `pwd -P` for portability and to resolve symlinks.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd -P )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ "$PWD" != "$PROJECT_ROOT" ]; then
    log_warn "You are not in the project root directory."
    read -p "Do you want to change to the project root ('$PROJECT_ROOT') and continue? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z "$REPLY" ]]; then
        cd "$PROJECT_ROOT" || log_error "Failed to change to project root: $PROJECT_ROOT"
        log_info "Changed directory to $PROJECT_ROOT."
    else
        log_error "Please run this script from the project root directory ($PROJECT_ROOT) or allow it to change directory."
    fi
fi

# Execute the main function
main "$@"