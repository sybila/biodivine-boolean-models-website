import fs from 'fs/promises';
import path from 'path';
import client from './repositories/client';
import { ModelMetadata, ModelMetadataSchema } from './validationModels/modelMetadata';

const MODELS_DIR_PATH = path.join(__dirname, '..', '..', 'models'); // Currently inside backend/src/ - that is why .. ..
const METADATA_FILE_NAME = 'metadata.json';
const AEON_FILE_NAME = 'model.aeon';

const processedFiles = new Set();

export const seed = async () => {
    try {
        const subFolders = await fs.readdir(MODELS_DIR_PATH, { withFileTypes: true });

        for (const subFolder of subFolders) {
            if (subFolder.isDirectory()) {
                const metadataFilePath = path.join(MODELS_DIR_PATH, subFolder.name, METADATA_FILE_NAME);
                const aeonFilePath = path.join(MODELS_DIR_PATH, subFolder.name, AEON_FILE_NAME);

                if (!processedFiles.has(aeonFilePath)) {
                    try {
                        const metadataContents = await fs.readFile(metadataFilePath, 'utf-8');
                        const metadata: ModelMetadata = ModelMetadataSchema.parse(JSON.parse(metadataContents));
                        const aeonData = await fs.readFile(aeonFilePath);

                        await client.model.create({
                            data: {
                                name: metadata.name,
                                urlPublication: metadata['url-publication'],
                                urlModel: Array.isArray(metadata['url-model'])
                                    ? metadata['url-model'][0]
                                    : metadata['url-model'],
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
                    } catch (e) {
                        console.error(`Error importing data from ${subFolder.name}`, e as Error);
                    }
                }
            }
        }
        console.log('All the files were successfully imported!');
    } catch (e) {
        console.error('Error reading subFolders!', e as Error);
    } finally {
        await client.$disconnect();
    }
};
