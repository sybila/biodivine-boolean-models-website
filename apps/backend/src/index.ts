import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { env } from 'process';
import router from './routes.js';
import { ApiResponse } from './types.js';

// Read configuration from `.env` file
const port = process.env.PORT ?? env.PORT ?? 3000;
console.log('Configured port:', port);

const app = express();

app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Logging
app.use(morgan('combined'));

// My implemented routers
app.use(router);

// No route was taken - 404 - Resource (API endpoint) not found.
app.use((_req, res) => {
    const response: ApiResponse<object> = {
        status: 'failure',
        error: 'No matching endpoint was found.',
    };

    res.status(404).send(response);
});

if (env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`[${new Date().toISOString()}] RESTful API for model repository is listening on port ${port}`);
    });
}
