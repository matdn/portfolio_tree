import { ThreePostProcessingBase } from "../postprocessings/bases/ThreePostProcessingBase";

export class ThreePostProcessingsProxy {


    private static _PostProcessingsMap = new Map<string, ThreePostProcessingBase>();

    public static Init() {
        this._PostProcessingsMap.clear();
    }

    public static AddPostProcessing(postProcessing: ThreePostProcessingBase): void {
        this._PostProcessingsMap.set(postProcessing.postProcessingId, postProcessing);
    }

    public static GetPostProcessing<T extends ThreePostProcessingBase>(postProcessingId: string): T {
        if (this._PostProcessingsMap.has(postProcessingId)) {
            return this._PostProcessingsMap.get(postProcessingId) as T;
        }
        throw new Error(`The ThreePostProcessingBase ${postProcessingId} do not exist in the proxy`);
    }
}