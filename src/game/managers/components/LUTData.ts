import { ThreeAssetsManager } from "@cooker/three";
import { ClampToEdgeWrapping, NearestFilter, Texture, Vector2 } from "three";
import { AssetId } from "../../constants/games/AssetId";

export class LUTData {

    private readonly _startHour: number = 0;
    private readonly _endHour: number = 0;
    private readonly _skyIntensity: number = 0;
    private readonly _textureUV: Vector2;

    constructor(startHour: number, endHour: number, skyIntensity: number, textureUV: Vector2) {
        this._startHour = startHour;
        this._endHour = endHour;
        this._skyIntensity = skyIntensity;
        this._textureUV = textureUV;
    }

    //#region Getters
    public get startHour(): number { return this._startHour; }
    public get endHour(): number { return this._endHour; }
    public get skyIntensity(): number { return this._skyIntensity; }
    public get textureUV(): Vector2 { return this._textureUV; }
    //#endregion
}