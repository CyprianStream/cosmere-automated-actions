import fs from 'fs';

export function folderExistsAtPath(value) {
    const stats = fs.statSync(value, { throwIfNoEntry: false });
    return stats && stats.isDirectory();
}

export default {
    folderExistsAtPath
}