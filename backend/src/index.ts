import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from 'process';
import modelRouter from './routes/modelRoutes';
import webhookRouter from './routes/webhookRoutes';
import { ApiResponse } from './types';

const app = express();
const port = env.PORT ?? 3000;

app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Logging
app.use(morgan('combined'));

// My implemented routers
app.use(modelRouter);
app.use(webhookRouter);

// No route was taken - 404 - Resource (API endpoint) not found.
app.use((_req, res) => {
    const response: ApiResponse<object> = {
        status: 'failure',
        data: {},
        error: 'No matching endpoint was found.',
    };

    return res.status(404).send(response);
});

if (env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`[${new Date().toISOString()}] RESTful API for model repository is listening on port ${port}`);
    });
}

export default app;
