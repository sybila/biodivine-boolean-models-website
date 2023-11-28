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
There is need to adjust one file inside the frontend folder. Go to /frontend/src/services/base.ts file and adjust the file from this:
```
const axiosInstance = axios.create({
    baseURL: '${BACKEND_URL}',
});
```
to this:
```
const axiosInstance = axios.create({
    baseURL: 'http://localhost:[port]',
});
```
Replace [port] in the baseURL based on the PORT variable in .env file (http://localhost:3001 for this example).
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

