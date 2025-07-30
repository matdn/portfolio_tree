import { WithoutTransitionThreeView } from "../../core/_engine/threejs/views/WithoutTransitionThreeView";
import { ViewId } from "../../constants/views/ViewId";
import { ViewPlacementId } from "../../constants/views/ViewPlacementId";
import { Object3DId } from "../../constants/games/Object3DId";
import { Object3DsProxy } from "../../core/_engine/threejs/proxies/Object3DsProxy";
import {
    AmbientLight,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    NormalBlending,
    Object3D,
    PlaneGeometry,
    PointLight,
    PointLightHelper,
    TextureLoader
} from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { ThreeAssetsManager } from "@cooker/three";
import { AssetId } from "../../constants/games/AssetId";

export default class CinemaThreeView extends WithoutTransitionThreeView {
    private _scene: Object3D;
    private _mirror: Reflector;

    constructor() {
        super(ViewId.THREE_CINEMA, ViewPlacementId.THREE_MAIN);

        this._scene = Object3DsProxy.GetObject3D(Object3DId.CINEMA);
        this.add(this._scene);

        this.add(new AmbientLight(0xffffff, 10000));

        const pointLight = new PointLight(0xffffff, 10, 1000, 2);
        pointLight.position.set(0, 3, 0);
        this.add(pointLight);
        this.add(new PointLightHelper(pointLight, 1));

        const baseMaterial = new MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.5,
            roughness: 0.5,
        });

        const mirrorGeometry = new PlaneGeometry(20, 20);
        this._mirror = new Reflector(mirrorGeometry, {
            clipBias: 0.01,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0x000000,
        });

        this._mirror.rotation.x = -Math.PI / 2;
        this._mirror.position.set(0, 0.1, 0);
        this.add(this._mirror);

        // ✅ PLAN AVEC TEXTURE DE BLUR TRANSPARENTE
        const blurTexture = ThreeAssetsManager.GetTexture(AssetId.TEXT_BLUR);
        const blurOverlay = new Mesh(
            new PlaneGeometry(20, 20),
            new MeshBasicMaterial({
                map: blurTexture,
                transparent: true,
                depthWrite: false,
                alphaTest: 0.01,
            })
        );
        blurOverlay.rotation.x = -Math.PI / 2;
        blurOverlay.position.set(0, 0.101, 0); // juste au-dessus du miroir
        this.add(blurOverlay);

        // 🎭 Traverse la scène
        this._scene.traverse((child) => {
            if (child instanceof Object3D) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child instanceof Mesh) {
                    child.material = baseMaterial;
                }
            }
            if (child.name === Object3DId.CINEMA_WALL && child instanceof Mesh) {
                child.material = new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 0.5,
                });
            }
            if (child.name === Object3DId.CINEMA_BOX && child instanceof Mesh) {
                child.material = new MeshBasicMaterial({ color: 0x000000 });
            }
            if (child.name === Object3DId.CINEMA_BENCH && child instanceof Mesh) {
                child.material = new MeshStandardMaterial({
                    color: 0x000000,
                    metalness: 0.8,
                    roughness: 0.2,

                });
            }
        });
    }
}
