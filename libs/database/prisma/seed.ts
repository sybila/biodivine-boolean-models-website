import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import path from 'path';
import fs from 'fs/promises';
import { z } from 'zod';

/**
 * Used to validate that the JSON files with metadata that we are reading are actually correct.
 */
const BooleanModelMetadataSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    'url-publication': z.string().url(),
    'url-model': z.union([z.string().url(), z.array(z.string().url()).nonempty()]),
    keywords: z.array(z.string()),
    variables: z.number().int().nonnegative(),
    inputs: z.number().int().nonnegative(),
    regulations: z.number().int().nonnegative(),
    notes: z.string(),
    bib: z.string(),
    'variable-names': z.array(z.string()),
    'input-names': z.array(z.string()),
    'output-names': z.array(z.string()),
});

type BooleanModelMetadata = z.infer<typeof BooleanModelMetadataSchema>;

// For some reason, this gets executed from libs/database/src/generated/prisma
const MODELS_DIR_PATH = path.join(__dirname, '..', '..', '..', '..', 'models');
console.log('Models directory path:', MODELS_DIR_PATH);
const METADATA_FILE_NAME = 'metadata.json';
const AEON_FILE_NAME = 'model.aeon';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

/*
    The seed function goes through every directory inside MODELS_DIR and creates a new database entry using
    the `metadata.json` and `model.aeon` files.
 */
async function main() {
    return prisma.$transaction(async (tx) => {
        const subFolders = await fs.readdir(MODELS_DIR_PATH, { withFileTypes: true });
        for (const subFolder of subFolders) {
            if (!subFolder.isDirectory()) {
                continue;
            }

            const metadataFilePath = path.join(MODELS_DIR_PATH, subFolder.name, METADATA_FILE_NAME);
            const aeonFilePath = path.join(MODELS_DIR_PATH, subFolder.name, AEON_FILE_NAME);

            const metadataContents = await fs.readFile(metadataFilePath, 'utf-8');
            const metadata: BooleanModelMetadata = BooleanModelMetadataSchema.parse(JSON.parse(metadataContents));
            const aeonData = await fs.readFile(aeonFilePath);

            await tx.booleanModel.create({
                data: {
                    id: metadata.id,
                    name: metadata.name,
                    urlPublication: metadata['url-publication'],
                    urlModel: Array.isArray(metadata['url-model'])
                        ? metadata['url-model']
                        : new Array(metadata['url-model']),
                    keywords: metadata.keywords,
                    variables: metadata.variables,
                    inputs: metadata.inputs,
                    regulations: metadata.regulations,
                    notes: metadata.notes,
                    bib: metadata.bib,
                    modelData: aeonData,
                    variableNames: metadata['variable-names'],
                    inputNames: metadata['input-names'],
                    outputNames: metadata['output-names'],
                },
            });

            console.log(`Imported data from ${subFolder.name}`);
        }

        console.log('All the files were successfully imported!');
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
