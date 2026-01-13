import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { env } from 'process';

export function newClient(database_url: string | undefined = undefined): PrismaClient {
    const url = database_url ?? process.env.DATABASE_URL ?? env.DATABASE_URL;
    if (url === undefined) {
        throw new Error('DATABASE_URL is not defined');
    }

    console.log('Creating client with database url:', url);

    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({ adapter });
}