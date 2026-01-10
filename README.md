# Biodivine Model Repository

This repository contains the website for [Biodivine Boolean Models](https://github.com/sybila/biodivine-boolean-models), which is currently deployed at [bbm.sybila.fi.muni.cz](https://bbm.sybila.fi.muni.cz/). If you are just looking for the models, please head to the BBM Github repository.

## Project Structure

 - `libs/models` A complete copy of the BBM dataset (in the future, this will be synchronized with the BBM repository).
 - `libs/database` A library project that defines a [Prisma](https://www.prisma.io/) client for a database used to access the BBM data. The library also provides a seeding routine to initialize a fresh database with BBM models.
 - `apps/backend` A simple read-only REST API using [express](https://expressjs.com/) for accessing the model database.
 - `apps/frontend` The main website UI built with [react](https://react.dev/) which displays a searchable model list and model details.

## Local setup

**Prerequisites:** Make sure you have `node`, `npm` and `docker` installed. After first cloning the project, run `npm install` to fetch all dependencies across all sub-projects.

### Database setup

**Option A:** If you are not planning to do any changes to the database (adding new data, changing the schema, etc.), you can use the pre-built database image:

```
docker compose -f docker-compose.db-prebuilt.yml up -d
```

To stop the database, run `docker stop bbm-database`.

**Option B:** Building the database yourself. You need to do this on every data/schema change. *There is currently no procedure to "upgrade" an existing database, only seeding from scratch.* However, this should not be an issue since the database is immutable.

(1) Start your development database. A default configuration is provided in `docker-compose.dev-db.yml`. To use it, run `docker compose -f docker-compose.dev-db.yml up -d` (remove `-d` if you want to monitor the docker container live instead of running it on background).

(2) Set up your `libs/database/.env` file, in particular the `DATABASE_URL` variable. The one given in `libs/database/.env.example` should work for the default database that we just started.

(3) If you changed the database schema in `/libs/database/prisma`, you need to run `npm run schema-generate` and then `npm run schema-migrate` to update the database. If you already have a database, you can reset it using `npm run database-reset`.

> Tip: Since the database is immutable, there is no need to actually run migrations. If you changed the schema, it is ok to remove the `migrations` directory in libs/database/prisma, reset the database using `npm run database-reset` and only then run `npm run schema-generate` and `npm run schema-migrate`. This should then behave as a fresh project.  

(4) As the final step, you need to seed the database with the models. To do this, run `npm run database-seed`. There is also `npm run database-recreate`, which is a combination of `database-reset` and `database-seed`.



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

