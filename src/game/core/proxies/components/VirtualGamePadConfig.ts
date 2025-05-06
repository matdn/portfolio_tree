import { GamePadButtonId } from "../../constants/GamePadButtonId";

export class VirtualGamePadConfig {

    public static readonly BASE = 'base';

    protected _virtualGamePadConfigId: string = '';

    protected _hasButtonsMap = new Map<GamePadButtonId, boolean>([
        [GamePadButtonId.A, true],
        [GamePadButtonId.B, true],
        [GamePadButtonId.X, true],
        [GamePadButtonId.Y, true],
        [GamePadButtonId.LT, true],
        [GamePadButtonId.LB, true],
        [GamePadButtonId.RT, true],
        [GamePadButtonId.RB, true],
        [GamePadButtonId.DPadUp, true],
        [GamePadButtonId.DPadDown, true],
        [GamePadButtonId.DPadLeft, true],
        [GamePadButtonId.DPadRight, true],
        [GamePadButtonId.DPAD, true],
        [GamePadButtonId.ANALOG_LEFT, true],
        [GamePadButtonId.ANALOG_RIGHT, true],

    ]);
    protected _buttonLabelsMap = new Map<GamePadButtonId, string>([
        [GamePadButtonId.A, 'A'],
        [GamePadButtonId.B, 'B'],
        [GamePadButtonId.X, 'X'],
        [GamePadButtonId.Y, 'Y'],
        [GamePadButtonId.LT, 'LT'],
        [GamePadButtonId.LB, 'LB'],
        [GamePadButtonId.RT, 'RT'],
        [GamePadButtonId.RB, 'RB'],
        [GamePadButtonId.DPadUp, ''],
        [GamePadButtonId.DPadDown, ''],
        [GamePadButtonId.DPadLeft, ''],
        [GamePadButtonId.DPadRight, ''],
        [GamePadButtonId.DPAD, ''],
        [GamePadButtonId.ANALOG_LEFT, ''],
        [GamePadButtonId.ANALOG_RIGHT, ''],
    ]);


    constructor(virtualGamePadConfig: string) {
        this._virtualGamePadConfigId = virtualGamePadConfig;
    }

    public getLabel(buttonId: GamePadButtonId): string {
        return this._buttonLabelsMap.get(buttonId) || '';
    }

    public hasButton(buttonId: GamePadButtonId): boolean {
        return this._hasButtonsMap.get(buttonId) || false;
    }

    protected _setHasButtons(hasButon: boolean): void {
        for (const key of this._hasButtonsMap.keys()) {
            this._hasButtonsMap.set(key, hasButon);
        }
    }

    //#region Getters
    public get virtualGamePadConfigId(): string { return this._virtualGamePadConfigId; }
    //#endregion
}