import Stats from 'stats.js';
import { Ticker } from './Ticker';

export class CustomStats {

    private static _Stats: Stats;

    public static Init() {
        this._Stats = new Stats()
        this._Stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this._Stats.dom)
        this._Stats.dom.classList.add('stats');
        Ticker.Add(this._Update);
    }

    private static _Update = (): void => {
        if (!this._Stats) return;
        this._Stats.update();
    }

}