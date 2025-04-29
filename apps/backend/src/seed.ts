import client from '@database/client';
import fs from 'fs/promises';
import path from 'path';
import { BooleanModelMetadata, BooleanModelMetadataSchema } from './validationModels/booleanModelMetadata';

const MODELS_DIR_PATH = path.join(__dirname, '..', '..', '..', 'libs', 'models'); // Currently inside backend/src/ - that is why .. ..
const METADATA_FILE_NAME = 'metadata.json';
const AEON_FILE_NAME = 'model.aeon';

const processedFiles = new Set();

export const seed = () => {
    return client.$transaction(async (tx) => {
        const subFolders = await fs.readdir(MODELS_DIR_PATH, { withFileTypes: true });

        for (const subFolder of subFolders) {
            if (!subFolder.isDirectory()) {
                continue;
            }

            const metadataFilePath = path.join(MODELS_DIR_PATH, subFolder.name, METADATA_FILE_NAME);
            const aeonFilePath = path.join(MODELS_DIR_PATH, subFolder.name, AEON_FILE_NAME);
            if (processedFiles.has(aeonFilePath)) {
                console.log(`Skipping ${metadataFilePath} since it's already been processed.`);
                continue;
            }

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
                },
            });

            processedFiles.add(aeonFilePath);
            console.log(`Imported data from ${subFolder.name}`);
        }
        console.log('All the files were successfully imported!');
    });
};
