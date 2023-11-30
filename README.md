# Biodivine Model Repository


## Prerequisites
Make sure you have Docker and Docker Compose installed on your system. If not, follow the installation guides below:
- Docker: [Get Docker](https://www.docker.com/get-started)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Cloning the project
Clone the project repository from [GitHub](https://github.com/sybila/biodivine-boolean-models-website)
```
git clone https://github.com/sybila/biodivine-boolean-models-website.git
```

## Configuration
Before starting, configure the environment variables required for the application. In the project directory there are two .env files. One in backend directory, other in frontend directory. These files need to be renamed from .env.example to .env, so variables can be accessed. These example files should look like this:
```
# Backend .env file
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5555/my-db?schema=public"
```
and
```
# Frontend .env file
VITE_BACKEND_PORT=3001
```
The only important thing is to keep PORT and VITE_BACKEND_PORT with same values (to ensure fetching from the correct backend URL). DATABASE_URL can be modified, but then docker-compose.yml file needs to be edited as well (for this reason, it is recommended not to modify the DATABASE_URL).

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
Open your web browser and go to http://localhost:[port] to view the application. Replace [port] with the port number where the frontend server is running (should be displayed in terminal after running frontend server).

