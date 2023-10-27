# model-repository



## Getting started

To run this project you need to do  following:

You need to have docker, docker compose installed. Then run following command to run the database

```
cd backend
docker-compose up -d
```

When your db is running successfully, you can run the backend with following command (make sure you are in backend directory).

```
npm i // to install all the dependencies
npm run start // to run the backend script
```

When backend is running, open another terminal and run frontend (make sure to be in frontend folder).

```
cd frontend 
npm i
npm run dev
```

After these steps, your project should be running on localhost url provided in terminal.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
