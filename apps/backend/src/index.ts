import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { env } from 'process';
import { ZodError } from 'zod';
import { ModelNotFoundError } from './repositories/types.js';
import router from './routes.js';
import { errResponse } from './types.js';

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
    res.status(404).send(errResponse('No matching endpoint was found.'));
});

// Error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Request error:', err);
    if (err instanceof ZodError) {
        // Thrown if request parameters are invalid.
        return res.status(400).send(errResponse(err.issues[0].message));
    }
    if (err instanceof ModelNotFoundError) {
        // Thrown if the requested model is not found.
        return res.status(404).send(errResponse(err.message));
    }
    return res.status(500).send(errResponse(err instanceof Error ? err.message : String(err)));
});

if (env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`[${new Date().toISOString()}] REST API for model repository is listening on port ${port}`);
    });
}
