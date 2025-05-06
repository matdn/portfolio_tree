// Libs
import i18n, { ResourceKey } from 'i18next';

// Utils
import { I18nReader } from './I18nReader';

export class TextsProxy {

  private static _TextsMap = new Map<string, string>();
  private static _NestedObject: any;

  private static _I18nData: ResourceKey;

  private static _StartKey: string;

  public static async Init(startKey: string = 'Experience') {

    await this._WaitForI18n();

    this._StartKey = startKey;

    this._TextsMap.clear();

    this._I18nData = i18n.getDataByLanguage(localStorage.getItem('i18nextLng'))?.translation as ResourceKey;
    this._ReplaceDynamicTextInTranslation(this._I18nData);

    I18nReader.Init(this._I18nData, this._StartKey);

    this._AddAllTextsFromI18n(I18nReader.ReadAsObject());

    this._NestedObject = I18nReader.ReadAsNestedObject();

  }


  private static async _WaitForI18n(): Promise<void> {
    return new Promise((resolve: () => void) => {
      if (i18n.isInitialized) {
        resolve();
      } else {
        const onInitialize = () => {
          i18n.off('initialized', onInitialize);
          resolve();
        }
        i18n.on('initialized', onInitialize);
      }
    });
  }

  // GET
  public static get i18nData(): ResourceKey { return this._I18nData; };
  public static get textsMap(): Map<string, string> { return this._TextsMap; };
  public static get startKey(): string { return this._StartKey; };

  public static GetText(key: string): string {
    if (!this._TextsMap.has(key)) return key;
    return this._TextsMap.get(key) as string;
  }

  public static GetTemplate(textId: string, values: any) {
    const template = TextsProxy.GetText(textId);
    const func = new Function(...Object.keys(values), "return `" + template + "`;")
    return func(...Object.values(values));
  }

  // Replace Dynamic Text In Translation
  private static _ReplaceDynamicTextInTranslation(i18nData: ResourceKey): void {
    const keys = Object.keys(i18nData);
    for (const key of keys) {
      const value = i18nData[key];
      if (typeof value === 'string' && value.includes('${')) {
        const textKey = value.split('${')[1].split('}')[0];
        if (i18nData[textKey]) {
          i18nData[key] = value.replace('${' + textKey + '}', i18nData[textKey]);
        }
      }
    }
  }

  // Add text from I18n to Text Map
  private static _AddAllTextsFromI18n(textData: { [key: string]: string }): void {
    for (const key of Object.keys(textData)) {
      let id = key;
      this._AddKeyText(id as string, textData[id]);
    }
  }

  // Create Text in Text Map
  private static _AddKeyText(key: string, value: string): void {
    this._TextsMap.set(key, value);
  }

  //#region getter/setter
  public static get NestedObject(): any { return this._NestedObject; }
  //#endregion

}
