import express from 'express';
import cors from 'cors';
import { env } from 'process';
import { ApiResponse } from './types';
import modelRouter from "./routes/modelRoutes";
import bodyParser from "body-parser";
import webhookRouter from "./routes/webhookRoutes";
import morgan from 'morgan';

const app = express();
const port = env.PORT ?? 3000;

app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Logging
app.use(morgan('combined'))

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
        console.log(
            `[${new Date().toISOString()}] RESTful API for model repository is listening on port ${port}`
        );
    });
}

export default app;
