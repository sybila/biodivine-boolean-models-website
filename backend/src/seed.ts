import client from "./repositories/client";

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const processedFiles = new Set();

export const seed = async () => {
    try {
        const rootDir = path.join(__dirname, '..', '..', 'models'); // Adjust the path to access the 'validationModels' directory

        const subFolders = await readdir(rootDir, { withFileTypes: true });

        for (const subFolder of subFolders) {
            if (subFolder.isDirectory()) {
                const metadataFilePath = path.join(rootDir, subFolder.name, 'metadata.json');
                const aeonFilePath = path.join(rootDir, subFolder.name, 'model.aeon');

                if (!processedFiles.has(aeonFilePath)) {
                    try {
                        const metadata = JSON.parse(await readFile(metadataFilePath, 'utf-8'));
                        const aeonData = await readFile(aeonFilePath);

                        await client.model.create({
                            data: {
                                name: metadata.name,
                                urlPublication: metadata['url-publication'],
                                urlModel: Array.isArray(metadata['url-model']) ? metadata['url-model'][0] : metadata['url-model'],
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
    } catch (e) {
        console.error('Error reading subfolders!');
    } finally {
        await client.$disconnect();
    }
}
