export class DebugManager {
  private static _DebugDiv = null;

  private static _IsDev: boolean = false;

  public static Init() {
    if (import.meta.env.DEV) {
      this._IsDev = true;
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === '42') {
      this._IsDev = true;
    }
  }

  public static Show(...text: any[]) {
    if (!this._DebugDiv) {
      this._DebugDiv = document.createElement('div');
      document.body.appendChild(this._DebugDiv);
      this._DebugDiv.style.position = 'absolute';
      this._DebugDiv.style.top = '0';
      this._DebugDiv.style.left = '0';
      this._DebugDiv.style.zIndex = '1000';
      this._DebugDiv.style.backgroundColor = 'rgba(255, 0, 0, 1)';
    }
    this._DebugDiv.innerHTML = text;
  }

  //#region getetr/settter
  public static get IsDev(): boolean {
    return this._IsDev;
  }

  //#endregion
}

DebugManager.Init();
