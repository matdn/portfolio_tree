import { TheaterBase } from "../theaters/TheatherBase";


export class TheatersProxy {

    private static _TheatersMap = new Map<string, TheaterBase>();

    public static Init() {
        this._TheatersMap.clear();
    }

    public static AddTheater(theater: TheaterBase): void {
        this._TheatersMap.set(theater.theaterId, theater);
    }

    public static GetTheater<T extends TheaterBase>(id: string): T {
        return this._TheatersMap.get(id) as T;
    }

    //#region getter/setter
    public static get TheatersMap(): ReadonlyMap<string, TheaterBase> { return this._TheatersMap; }
    //#endregion

}