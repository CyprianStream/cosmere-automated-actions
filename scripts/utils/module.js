import fs from 'fs';
import path from 'path';

// Utils
import { folderExistsAtPath } from './fs.js';

const SRC_FOLDER = 'src';
const MANIFEST_FILE_NAME = 'module.json';

let _manifest = null;

function getManifest() {
    // If manifest is already loaded, return it
    if (_manifest) {
        return _manifest;
    }

    // Construct src path
    const srcFolderPath = path.join(process.cwd(), SRC_FOLDER);

    // Ensure src folder exists
    if (!folderExistsAtPath(srcFolderPath)) {
        console.error(`Could not find source folder. Are you at the root of the project?`);
        process.exit(1);
    }

    // Construct manifest file path
    const manifestFilePath = path.join(srcFolderPath, MANIFEST_FILE_NAME);

    // Ensure manifest file exists
    if (!fs.existsSync(manifestFilePath)) {
        console.error(`Could not find the manifest file at "${manifestFilePath}"`);
        process.exit(1);
    }

    // Read and parse the manifest file
    _manifest = JSON.parse(fs.readFileSync(manifestFilePath, 'utf-8'));

    // Ensure manifest has an id
    if (!_manifest.id) {
        console.error(`Malformed manifest file. The manifest file must have an "id" property.`);
        process.exit(1);
    }

    return _manifest;
}

function getId() {
    const manifest = getManifest();
    return manifest.id;
}

export const Module = {
    get manifest() {
        return getManifest();
    },
    get id() {
        return getId();
    }
}

export default Module;