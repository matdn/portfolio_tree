import { ThreeAssetsManager } from "@cooker/three";
import InitCommandBase from "../../../../../commands/inits/initcommands/bases/InitCommandBase";
import { MainThree } from "../../../MainThree";
import { DebugOrbitThreeCameraController } from "../../../cameras/DebugOrbitThreeCameraController";
import { ThreeCamerasManager } from "../../../managers/ThreeCamerasManager";
import { ThreeMouseManager } from "../../../managers/ThreeMouseManager";
import { Object3DsProxy } from "../../../proxies/Object3DsProxy";
import { ThreeAnimationsProxy } from "../../../proxies/ThreeAnimationsProxy";
import { ThreeCamerasProxy } from "../../../proxies/ThreeCamerasProxy";
import { ThreePostProcessingsProxy } from "../../../proxies/ThreePostProcessingsProxy";
import { SwapableObject3DsProxy } from "../../../proxies/SwapableObject3DsProxy";



export class ThreeInitCommand extends InitCommandBase {

    public override async initProxies(): Promise<void> {
        Object3DsProxy.Init();
        ThreeAnimationsProxy.Init();
        ThreeCamerasProxy.Init();
        ThreePostProcessingsProxy.Init();
        ThreeCamerasProxy.AddCamera(new DebugOrbitThreeCameraController());
        SwapableObject3DsProxy.Init();
    }

    public override async initManagers(): Promise<void> {
        ThreeCamerasManager.Init();
        ThreeMouseManager.Init();
    }

    public override async addViews(): Promise<void> {
    }

    public override async addTheaters(): Promise<void> {
    }

    public override async initCommon(): Promise<void> {
    }

    public override async initPixi(): Promise<void> {
    }

    public override async initThree(): Promise<void> {
        ThreeAssetsManager.Init();
    }

    public override async initAfterLoad(): Promise<void> {
        MainThree.Init();
    }

}