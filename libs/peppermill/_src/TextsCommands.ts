import { TextsProxy } from './TextsProxy';

export class TextsCommands {

    // function to generate all TextId
    public static CreateTextIds() {
        const keys = TextsProxy.textsMap.keys();

        let textIds = '';
        for (const key of keys) {

            const tab = key.split('.');
            tab.shift();
            const id = tab.join('_').toUpperCase();
            textIds += `  ${id} = "${key}",\n`;
        }

        textIds =`export enum TextId {\n${textIds} \n}`;
        
        console.groupCollapsed(`Remplacer le contenu du fichier TextId par : `);
        console.log(textIds);
        console.groupEnd()

    }


    // function to generate all JSONKeys for I18n trad files
    public static CreateJsonKeys() {
        const keys = Object.keys(TextsProxy.i18nData);

        let jsonKeys = '';

        for (const key of keys) {
            if (key !== '__EOF__') {
                const jsonKey = `  "${key}": "${key}", \n`;
                jsonKeys += jsonKey;
            } else {
                const jsonKey = `  "${key}": "${key}" \n`;
                jsonKeys += jsonKey;
            }
        }

        jsonKeys =`{ \n${jsonKeys} \n}`

        console.groupCollapsed(`Remplacer le contenu des fichiers trads (sauf celui par default) par : `);
        console.log(jsonKeys);
        console.groupEnd()

    }


    // function to generate Schema for Schema.json
    public static CreateJsonSchema() {
        const keys = Object.keys(TextsProxy.i18nData);

        let jsonKeys = '';

        for (const key of keys) {
             if (key !== '__EOF__') {
                const jsonKey = `  {\n    "name": "${key}"\n  },\n`;
                jsonKeys += jsonKey;
            } else {
                const jsonKey = `  {\n    "name": "${key}"\n  }\n`;
                jsonKeys += jsonKey;
            }
        }

        const exportable = `"schema": [ \n${jsonKeys}\n]`
        

        console.groupCollapsed(`Remplacer le contenu du schema dans le fichier schema.json par : `);
        console.log(exportable);
        console.groupEnd()

    }

}