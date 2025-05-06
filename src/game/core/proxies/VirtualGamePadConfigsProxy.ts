import { VirtualGamePadConfig } from "./components/VirtualGamePadConfig";

export class VirtualGamePadConfigsProxy {

    private static _ConfigsMap = new Map<string, VirtualGamePadConfig>();

    public static Init(): void {
        this.Add(new VirtualGamePadConfig(VirtualGamePadConfig.BASE));
    }

    public static Add(config: VirtualGamePadConfig): void {
        this._ConfigsMap.set(config.virtualGamePadConfigId, config);
    }

    public static Get(configId: string): VirtualGamePadConfig {
        return this._ConfigsMap.get(configId);
    }

}