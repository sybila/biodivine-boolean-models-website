# Biodivine Model Repository


## Prerequisites
Make sure you have Docker and Docker Compose installed on your system. If not, follow the installation guides below:
- Docker: [Get Docker](https://www.docker.com/get-started)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Configuration
Before starting, configure the environment variables required for the application. Create a `.env` file in the backend directory of project with the following content:

```
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5555/my-db?schema=public"
```


## Setting up the Database
First, run Docker desktop and wait for it to run.
Navigate to the backend directory where your `docker-compose.yml` is located and start the database container:

```
docker-compose up -d postgres
```

This command will set up a PostgreSQL container running on port 5555.

## Backend Setup
Navigate to backend directory:
```
cd backend
```

### 1. Install dependencies
```
npm install
```
### 2. Run Prisma migrations
```
npx prisma migrate dev --name init
```
### 3. Seed the database
```
npm run seed
```
### 4. Start the backend server
```
npm run start
```

The backend should now be running and listening on the port specified in the .env file.

## Frontend Setup
Open second terminal window and navigate to frontend directory:
```
cd frontend
```
### 1. Install dependencies
```
npm install
```
### 2. Run the frontend server
```
npm run dev
```
The frontend should now be accessible in your browser.

## Accessing the Application
Open your web browser and go to http://localhost:[frontend-port] to view the application. Replace [frontend-port] with the port number where the frontend server is running (should be displayed in terminal after running frontend server).

