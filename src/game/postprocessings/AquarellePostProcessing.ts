import { Camera, Scene, WebGLRenderer, Vector2, TextureLoader } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { ThreePostProcessingBase } from "../core/_engine/threejs/postprocessings/bases/ThreePostProcessingBase";
import { PostProcessingId } from "../constants/games/PostProcessingId";
import { AquarelleShader } from "./shaders/AquarelleShader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ThreeAssetsManager } from "@cooker/three";
import { AssetId } from "../constants/games/AssetId";

export class AquarellePostProcessing extends ThreePostProcessingBase {
    private readonly _aquarellePass: ShaderPass;

    constructor() {
        super(PostProcessingId.AQUARELLE);
        this._aquarellePass = new ShaderPass(AquarelleShader);
        this._aquarellePass.uniforms['ratio'].value = new Vector2(window.innerWidth / window.innerHeight, 1);
        this._aquarellePass.uniforms['tAquarelle'].value = null; // Charge plus tard une texture
    }

    public override init(scene: Scene, camera: Camera, renderer: WebGLRenderer): void {
        if (this._isInit) return;
        super.init(scene, camera, renderer);

        // RenderPass pour s'assurer que la scène de base est rendue avant le shader
        const renderPass = new RenderPass(scene, camera);
        this._effectComposer.addPass(renderPass);

        // Charger la texture d'aquarelle
        const textureLoader = new TextureLoader();
        // const aquarelleTexture = textureLoader.load(
        //     "images/aquarelleText.webp",
        //     () => {
        //         console.log("Texture d'aquarelle chargée avec succès.");
        //     },
        //     undefined,
        //     (error) => {
        //         console.error("Erreur de chargement de la texture d'aquarelle : ", error);
        //     }
        // );
        // this._aquarellePass.uniforms['tAquarelle'].value = aquarelleTexture;
        // const aquarelleTexture = ThreeAssetsManager.GetTexture(AssetId.TEXTURE_AQUARELLE);
        // this._aquarellePass.uniforms['tAquarelle'].value = aquarelleTexture;

        // Ajouter l'effet aquarelle
        this._effectComposer.addPass(this._aquarellePass);
    }

    public override render(): void {
        super.render();
        this._aquarellePass.uniforms['time'].value += 0.01;
    }

    public override resize(width: number, height: number): void {
        super.resize(width, height);
        this._aquarellePass.uniforms['ratio'].value = new Vector2(width / height, 1);
    }
}
