import { CommonAssetsManager } from "@cooker/common";
// import { ThreeAssetsManager } from "@cooker/three";

// Core
import { Core } from "../Core";
import InitCommand from "./inits/InitCommand";

export default class LoadingCommand {

    private static _ThreeAssetsManager: any;

    public static GetLoadingPercentage(): number {
        let progress = CommonAssetsManager.CurrentLoadIndex;
        let total = CommonAssetsManager.NumToLoad;

        if (Core.UseThree && InitCommand.ThreeAssetsManager) {
            progress += InitCommand.ThreeAssetsManager.CurrentLoadIndex;
            total += InitCommand.ThreeAssetsManager.NumToLoad;
        }

        const p = 100 * ((1 + progress) / (1 + total));
        if (progress == 0) return 0;
        return p;
    }
}