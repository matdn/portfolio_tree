import { GameBase } from "../games/bases/GameBase";

export class GamesProxy {

    private static _GamesMap = new Map<string, GameBase>();

    public static Init() {
        this._GamesMap.clear();
    }

    public static AddGame(game: GameBase): void {
        this._GamesMap.set(game.gameId, game);
    }

    public static GetGame<T extends GameBase>(gameId: string): T {
        return this._GamesMap.get(gameId) as T;
    }
}