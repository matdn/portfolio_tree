export class Viewport {
    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 0;
    private _height: number = 0;

    public setPosition(x: number, y: number): void {
        this._x = x;
        this._y = y;

    }
    public setSize(width: number, height: number): void {
        this._width = width;
        this._height = height;
    }

    //#region getter/setter
    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get width(): number { return this._width; }
    public get height(): number { return this._height; }
    //#endregion
}