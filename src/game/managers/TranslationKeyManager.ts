import { TextsProxy } from 'peppermill';
import { ViewsManager } from 'pancake';
import { ViewId } from '../constants/views/ViewId';

const TRANSLATION_MODE_KEY = 'TRANSLATION_MODE';

export class TranslationKeyManager {
  private static _IsInit: boolean = false;
  private static _IsTranslationMode: boolean = false;
  private static _CurrentKey: string = null;

  public static async Init() {
    if (this._IsInit) {
      return;
    }

    this._IsInit = true;
    this._SetTranslationMode();
    await this.Load();
  }

  public static async Load() {
    await TextsProxy.Init();
  }

  public static ShowTranslationKey(key: string) {
    if (!this._IsTranslationMode) {
      return;
    }
    this._CurrentKey = key;
    ViewsManager.ShowById(ViewId.TRANSLATION_KEY);
  }

  public static HideTranslationKey() {
    if (!this._IsTranslationMode) {
      return;
    }
    this._CurrentKey = null;
    ViewsManager.HideById(ViewId.TRANSLATION_KEY);
  }

  private static _SetTranslationMode() {
    let translationMode = sessionStorage.getItem(TRANSLATION_MODE_KEY);

    if (translationMode === 'true') {
      this._IsTranslationMode = true;
      return;
    }

    const {searchParams} = new URL(window.location.href);

    translationMode = searchParams.get('translationMode');
    if (translationMode) {
      sessionStorage.setItem(TRANSLATION_MODE_KEY, 'true');
      this._IsTranslationMode = true;
    }
  }

  public static get IsTranslationMode() { return this._IsTranslationMode }
  public static get CurrentKey() { return this._CurrentKey }
}
