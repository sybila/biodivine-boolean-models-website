import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { env } from 'process';

const database_url = process.env.DATABASE_URL ?? env.DATABASE_URL;
console.log('Configured database url:', database_url);

if (database_url === undefined) {
    throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({ connectionString: database_url });
const client = new PrismaClient({ adapter });

export default client;
