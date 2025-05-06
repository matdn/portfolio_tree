import { Camera, DepthTexture, HalfFloatType, RGBAFormat, Scene, WebGLRenderTarget, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";


export class ThreePostProcessingBase {

    protected _isInit: boolean = false;
    protected _effectComposer: EffectComposer | null = null;
    protected _renderTarget: WebGLRenderTarget;
    protected _renderPass: RenderPass | null = null;
    protected _postProcessingId: string;
    protected _depthTexture: DepthTexture;


    constructor(postProcessingId: string) {
        this._postProcessingId = postProcessingId;
        this._depthTexture = new DepthTexture(1024, 1024);
        this._renderTarget = new WebGLRenderTarget(1024, 1024, {
            type: HalfFloatType,
            format: RGBAFormat,
            depthTexture : this._depthTexture,
            depthBuffer: true,
        });
        this._renderTarget.samples = 8;
    }


    public init(scene: Scene, camera: Camera, renderer: WebGLRenderer): void {
        if (this._isInit) return;
        this._isInit = true;
        this._effectComposer = new EffectComposer(renderer, this._renderTarget);
        this._renderPass = new RenderPass(scene, camera);
        this._effectComposer.addPass(this._renderPass);

    }

    public setCamera(camera: Camera): void {
        if (this._renderPass) this._renderPass.camera = camera;
    }


    public render(): void {
        if (this._effectComposer) this._effectComposer.render();
    }

    public resize(width: number, height: number): void {
        if (this._effectComposer) this._effectComposer.setSize(width, height);
        this._renderTarget.setSize(width, height);
        this._depthTexture.dispose();
        this._depthTexture = new DepthTexture(width, height);
        this._renderTarget.depthTexture = this._depthTexture;
    }

    //#region getter/setter
    public get postProcessingId(): string { return this._postProcessingId; }
    //#endregion

}