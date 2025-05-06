import fs from 'fs-extra';
import path from 'path';

export default function vitePluginWatchLog() {
    const jsonFilePattern = '*.json';

    return {
        name: 'vite-plugin-generate-textId', // name of the plugin

        configureServer(server) {
            server.watcher.on('change', (path) => {
                if (testPath(path)) {
                    geenerateTextId(path);
                }
            });

            server.watcher.on('add', (path) => {
                if (testPath(path)) {
                    geenerateTextId(path);
                }
            });

            server.watcher.on('unlink', (path) => {
                if (path.endsWith('.js')) {
                    console.log(`JavaScript file removed: ${path}`);
                }
            });
        },
    };
};

function testPath(path) {
    if (path.includes('schema')) return false;
    path = path.replace(/\\/g, '/');
    const reg = /public\/locales\/.*\.json/gmi;
    if(!reg.test(path)) return false;

    if (path.endsWith('en.json')) return true;
    if (path.endsWith('fr.json')) return true;
    return false;
}

async function geenerateTextId(srcPath) {
    const file = await fs.readFile(srcPath, 'utf-8');
    const json = JSON.parse(file);
    let t = 'export enum TextId {\n';
    for (const key in json) {
        if (key.startsWith('Experience')) {
            const tab = key.split('.');
            tab.shift();
            const id = tab.join('_').toUpperCase();
            const l = '\t' + id + ' = "' + key + '",\n';
            t += l;
        }
    }
    t += '}\n';
    const filePath = path.join('src', 'game', 'constants', 'texts', 'TextId.ts');
    try {
        // await fs.unlink(filePath);
        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, t, 'utf-8');
        console.log('TextId.ts generated');
    } catch (error) {
        console.error('Error while generating TextId.ts');
    }
}
