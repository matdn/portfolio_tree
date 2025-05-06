import { AssetsUtils } from "../../../../utils/AssetsUtils";

export default abstract class InitCommandBase {

    public async initProxies(): Promise<void> {
        // 
    }

    public async initManagers(): Promise<void> {
        // 
    }

    public async addViews(): Promise<void> {
        // 
    }

    public async addTheaters(): Promise<void> {
        // 
    }

    public async initCommon(): Promise<void> {
        // 
    }

    public async initPixi(): Promise<void> {
        // 
    }

    public async initThree(): Promise<void> {
        // 
    }

    public async initAfterLoad(): Promise<void> {
        // 
    }

    protected _getAssetPath(url: string): string {
        return AssetsUtils.GetAssetURL(url);
    }


} 