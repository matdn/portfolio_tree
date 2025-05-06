import { Action } from "cookware";
import { TheatersManager } from "pancake";
import { VirtualGamePadConfig } from "../proxies/components/VirtualGamePadConfig";
import { VirtualGamePadConfigsProxy } from "../proxies/VirtualGamePadConfigsProxy";
import { SuperTheaterBase } from "../theaters/SuperTheaterBase";

export class VirtualGamePadConfigsManager {


    private static _CurrentConfig: VirtualGamePadConfig;

    public static readonly OnChange = new Action();

    public static Init(): void {
        this._CurrentConfig = VirtualGamePadConfigsProxy.Get(VirtualGamePadConfig.BASE);
    }


    private static _GetTopVirtualGamePadConfig(): VirtualGamePadConfig {
        let id = this._GetTopVirtualGamePadConfigId();
        if (id) return VirtualGamePadConfigsProxy.Get(id);
        return VirtualGamePadConfigsProxy.Get(VirtualGamePadConfig.BASE);
    }

    private static _GetTopVirtualGamePadConfigId(): string | null {
        let virtualGamePadConfigId: string | null = null;
        for (let i = TheatersManager.CurrentTheatersList.length - 1; i >= 0; i--) {
            const theater = TheatersManager.CurrentTheatersList[i];
            if (theater instanceof SuperTheaterBase) {
                if (theater.virtualGamePadConfigId) {
                    virtualGamePadConfigId = theater.virtualGamePadConfigId;
                }
            }
        }
        return virtualGamePadConfigId;
    }

    public static Start(): void {
        this._AddCallbacks();
    }

    public static Stop(): void {
        this._RemoveCallbacks();
    }

    private static _AddCallbacks() {
        this._RemoveCallbacks();
        TheatersManager.OnShowTheater.add(this._OnChangeTheater);
        TheatersManager.OnHideTheater.add(this._OnChangeTheater);
    }

    private static _RemoveCallbacks() {
        TheatersManager.OnShowTheater.delete(this._OnChangeTheater);
        TheatersManager.OnHideTheater.delete(this._OnChangeTheater);
    }

    private static _OnChangeTheater = (): void => {
        this._CurrentConfig = this._GetTopVirtualGamePadConfig();
        console.log('VirtualGamePadConfigsManager._OnChangeTheater', this._CurrentConfig);
        this.OnChange.execute();
    }

    //#region Getters
    public static get CurrentConfig(): VirtualGamePadConfig { return this._CurrentConfig; }
    //#endregion
}