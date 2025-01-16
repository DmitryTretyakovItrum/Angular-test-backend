# Project Name: Angular-test-backend

## Description

This project is a backend application built using Bun and MongoDB, designed to handle various endpoints and database interactions. It runs in a Docker container based on Ubuntu 22.04, ensuring compatibility and ease of deployment.

## Features

- **Endpoints**:
  - `/jobs/get`: Fetch jobs with filtering and pagination.
  - `/jobs/patch`: Update existing jobs.
  - `/profile/get`: Retrieve profile information.
  - `/profile/patch`: Update profile information.
- **Database**: MongoDB is used for data persistence.
- **Package Manager**: Bun is utilized for managing dependencies and running the application.

## Prerequisites

Ensure the following tools are installed on your system:

- Docker
- Docker Compose (optional, if using a `docker-compose.yml` file)

## Installation and Setup

1. **Clone the Repository**:
   
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. **Build the Docker Image**:
   
   ```bash
   docker build -t angular-test-backend .
   ```
3. **Run the Docker Container**:
   
   ```bash
   docker run -p 3100:3100 angular-test-backend
   ```
   
   This will start the MongoDB server and the application on port `3100`.
4. **Access the Application**:
   Use a tool like Postman or cURL to interact with the API endpoints at `http://localhost:3100`.

## Development Notes

- The MongoDB data is stored in the `/data/db` directory within the container.
- Make sure to configure your `.env` file if required.
- The `.gitignore` file ensures that unnecessary files like logs and `node_modules` are excluded from version control.

## Contribution

Feel free to fork this repository and submit pull requests for any enhancements or bug fixes.

