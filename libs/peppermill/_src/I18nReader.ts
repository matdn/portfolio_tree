import { ResourceKey } from 'i18next';

export class I18nReader {

  private static _I18nData: ResourceKey;
  private static _BaseKey: string = 'Experience';

  public static Init(i18nData: ResourceKey, baseKey: string) {
    this._I18nData = i18nData;
    this._BaseKey = baseKey;
    console.log(this._BaseKey);
  }

  public static ReadAsObject() {
    const textDataKeys = Object.keys(this._I18nData);
    const textDataValues = Object.values(this._I18nData);

    const object = {};

    for (const key in textDataKeys) {
      const myKey = textDataKeys[key].split('.')[0]; 

      if (myKey == this._BaseKey) {
        // const tab = textDataKeys[key].split('.');
        // tab.shift();
        // const id = tab.join('_').toUpperCase();
        object[textDataKeys[key]] = textDataValues[key];
      }
    }


    return object;
  }

  public static ReadAsNestedObject() {
    const textDataKeys = Object.keys(this._I18nData);
    const textDataValues = Object.values(this._I18nData);

    const nestedObject = {};

    const nestKeys = (object: any, keys: any, endValue: any) => {
      if (keys.length === 1) {
        object[keys] = endValue;
        return object;
      }

      const [currentKey, ...remainingKeys] = keys;
      object[currentKey] = object[currentKey] || {};

      return nestKeys(object[currentKey], remainingKeys, endValue);
    };

    for (const key in textDataKeys) {
      if (textDataKeys[key].includes(this._BaseKey)) {
        const subKeys = textDataKeys[key].split('.');
        nestKeys(nestedObject, subKeys, textDataValues[key]);
      }
    }

    return nestedObject[this._BaseKey];
  }

}