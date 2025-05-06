import { Action } from '../tools/Action';

export class ResizeManager {
  private static _Width: number = 0;
  private static _Height: number = 0;
  private static _TimeoutId: ReturnType<typeof setTimeout>;

  public static readonly OnResize = new Action();

  public static Start(): void {
    this.Stop();
    window.addEventListener('resize', this.Resize);
    clearTimeout(this._TimeoutId);
  }

  public static Stop(): void {
    window.removeEventListener('resize', this.Resize);
    clearTimeout(this._TimeoutId);
  }

  public static Resize = (): void => {
    if (this._Width == window.innerWidth && this._Height == window.innerHeight) return;

    this._Width = window.innerWidth;
    this._Height = window.innerHeight;

    clearTimeout(this._TimeoutId);
    this._TimeoutId = setTimeout(this.Resize, 250);
    this.OnResize.execute();
  };
}
