import fs from 'fs-extra';

export default function vitePluginGenerateSchema() {

    return {
        name: 'vite-plugin-generate-schema', // name of the plugin

        configureServer(server) {
            server.watcher.on('change', (path) => {
                if (testPath(path)) {
                    generateSchema(path);
                }
            });

            server.watcher.on('add', (path) => {
                if (testPath(path)) {
                    generateSchema(path);
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
    if (!reg.test(path)) return false;

    if (path.endsWith('en.json')) return true;
    if (path.endsWith('fr.json')) return true;
    return false;
}

// async function generateSchema(srcPath) {
//     console.log('*********************');
//     console.log('*********************');
//     console.log('*********************');
//     console.log('*********************');
//     console.log('****************Generating schema from ' + srcPath);
//     let dir = await fs.readdir('./public/locales/');
//     let langs = [];
//     let reg = /(.*)\.json/gmi;
//     for (let i = 0; i < dir.length; i++) {
//         // if(dir[i].endsWith('.json')) langs.push(dir[i]);
//         let match = reg.exec(dir[i]);
//         if (match && match != 'schema') langs.push(match[1]);
//     }
//     let schemas = [];
//     const file = await fs.readFile(srcPath, 'utf-8');
//     const json = JSON.parse(file);
//     for (const key in json) {
//         let o = {
//             'name': key,
//         }
//         schemas.push(o);
//     }

//     let result = {
//         'mainLanguage': 'en',
//         'activeLanguages': ['en', 'fr'],
//         "supportedLanguages": langs,
//         "schema": schemas,
//     }

//     let output = JSON.stringify(result, null, 2);

//     const filePath = './public/locales/schema.json';
//     try {
//         // await fs.unlink(filePath);
//         await fs.ensureFile(filePath);
//         await fs.writeFile(filePath, output, 'utf-8');
//         console.log('schema.json generated');
//     } catch (error) {
//         console.error('Error while generating shema.json');
//     }
// }


async function generateSchema(srcPath) {
    // console.log('*********************');
    // console.log('*********************');
    // console.log('*********************');
    // console.log('*********************');
    // console.log('****************Generating schema from ' + srcPath);
    const schemaPath = './public/locales/schema.json';
    const file = await fs.readFile(schemaPath, 'utf-8');
    const schema = JSON.parse(file);
    for (let i = schema.schema.length - 1; i >= 0; i--) {
        if (schema.schema[i].name.startsWith('Experience.')) schema.schema.splice(i, 1);
    }

    const local = await fs.readFile(srcPath, 'utf-8');
    const json = JSON.parse(local);
    for (const key in json) {
        if (key.startsWith('Experience.')) {
            let o = {
                'name': key,
            }
            schema.schema.push(o);
        }
    }
    let output = JSON.stringify(schema, null, 2);

    const filePath = './public/locales/schema.json';
    try {
        // await fs.unlink(filePath);
        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, output, 'utf-8');
        console.log('schema.json generated');
    } catch (error) {
        console.error('Error while generating shema.json');
    }
}


const args = process.argv;
if (args.indexOf('start') > -1) generateSchema('./public/locales/en.json');
