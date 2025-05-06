import { Action } from 'cookware';
import { DomEvent } from 'spices';

export class KeyboardManager {
  private static _KeyDownsMap = new Map<string, boolean>();
  private static _CodeDownsMap = new Map<string, boolean>();
  private static _KeyUpsMap = new Map<string, boolean>();
  private static _CodeUpsMap = new Map<string, boolean>();

  public static readonly OnKeyDown = new Action<[KeyboardEvent]>();
  public static readonly OnKeyUp = new Action<[KeyboardEvent]>();

  public static Init(): void {
    this._KeyDownsMap.clear();
    this._CodeDownsMap.clear();
  }

  public static Start(): void {
    this._AddCallbacks();
  }

  public static Stop(): void {
    this._RemoveCallbacks();
  }

  private static _AddCallbacks() {
    this._RemoveCallbacks();
    window.addEventListener(DomEvent.KEY_DOWN, this._OnKeyDown);
    window.addEventListener(DomEvent.KEY_UP, this._OnKeyUp);
  }

  private static _RemoveCallbacks() {
    window.removeEventListener(DomEvent.KEY_DOWN, this._OnKeyDown);
    window.removeEventListener(DomEvent.KEY_UP, this._OnKeyUp);
  }

  private static _OnKeyDown = (e: KeyboardEvent): void => {
    this._KeyDownsMap.set(e.key, true);
    this._CodeDownsMap.set(e.code, true);
    this.OnKeyDown.execute(e);
  };

  private static _OnKeyUp = (e: KeyboardEvent): void => {
    this.OnKeyUp.execute(e);
    this._KeyDownsMap.set(e.key, false);
    this._CodeDownsMap.set(e.code, false);
  };

  public static IsDown(name: string): boolean {
    if (this._KeyDownsMap.get(name)) return true;
    if (this._CodeDownsMap.get(name)) return true;
    return false;
  }

  public static IsDowns(names: string[]): boolean {
    for (let name of names) {
      if (this._KeyDownsMap.get(name)) return true;
      if (this._CodeDownsMap.get(name)) return true;
    }
    return false;
  }
}
