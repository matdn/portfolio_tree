import * as THREE from "three";
import { ThreeAssetsManager } from "@cooker/three";
import { WithoutTransitionThreeView } from "../../core/_engine/threejs/views/WithoutTransitionThreeView";
import { AssetId } from "../../constants/games/AssetId";
import { ThreeCameraControllerBase } from "../../core/_engine/threejs/cameras/bases/ThreeCameraControllerBase";
import { ViewId } from "../../constants/views/ViewId";
import { ViewPlacementId } from "../../constants/views/ViewPlacementId";
import { ThreeCamerasProxy } from "../../core/_engine/threejs/proxies/ThreeCamerasProxy";
import gsap from "gsap";

export default class TestThreeView extends WithoutTransitionThreeView {
    private _camera: ThreeCameraControllerBase;
    private _group = new THREE.Group();
    private _projectTextures = [
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_SEVEN),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_ONE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_TWO),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_FIVE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_FOUR),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_SIX),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_EIGHT),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_NINE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_SEVEN),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_ONE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_TWO),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_FIVE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_FOUR),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_SIX),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_EIGHT),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_NINE),
    ];

    private _targetRotationY: number = 0;
    private _rotationRange = Math.PI * 4;

    private _targetRotationX: number = 0;
    private _targetRotationZ: number = 0;

    private _carouselBrightness: number = 0;
    private _isInitialRotationAnimating: boolean = true;

    constructor() {
        super(ViewId.TEST_THREE, ViewPlacementId.THREE_MAIN);
        this._camera = ThreeCamerasProxy.CamerasMap.get('MAIN');
        this._camera.camera.position.set(0, 0, 60);
        this._camera.camera.lookAt(0, 0, 0);

        const planeWidth = 8;
        const planeHeight = 6;
        const radius = 42;
        const totalAngle = Math.PI * 2;
        const angleStep = totalAngle / this._projectTextures.length;

        this._projectTextures.forEach((texture, i) => {
            const angle = angleStep * i - (totalAngle / 2);

            const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
            geometry.rotateY(Math.PI / 4);

            const imageAspect = texture.image.width / texture.image.height;
            const planeAspect = planeWidth / planeHeight;

            let uvScaleX = 1.0;
            let uvScaleY = 1.0;
            let uvOffsetX = 0.0;
            let uvOffsetY = 0.0;

            if (imageAspect > planeAspect) {
                uvScaleX = planeAspect / imageAspect;
                uvOffsetX = (1.0 - uvScaleX) / 2.0;
            } else {
                uvScaleY = imageAspect / planeAspect;
                uvOffsetY = (1.0 - uvScaleY) / 2.0;
            }

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    map: { value: texture },
                    radius: { value: radius },
                    angleOffset: { value: angle },
                    uvScale: { value: new THREE.Vector2(uvScaleX, uvScaleY) },
                    uvOffset: { value: new THREE.Vector2(uvOffsetX, uvOffsetY) },
                    brightness: { value: this._carouselBrightness }
                },
                vertexShader: `
                    uniform float radius;
                    uniform float angleOffset;

                    varying vec2 vUv;

                    void main() {
                        vUv = uv;

                        float x = position.x;
                        float y = position.y;
                        float z = position.z;

                        float u_norm = (x + (4.0 / 2.0)) / 4.0;
                        float currentAngle = u_norm * ((4.0 / radius)) + angleOffset;

                        vec3 newPosition;
                        newPosition.x = radius * sin(currentAngle);
                        newPosition.y = y;
                        newPosition.z = radius * cos(currentAngle);

                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D map;
                    uniform vec2 uvScale;
                    uniform vec2 uvOffset;
                    uniform float brightness;
                    
                    varying vec2 vUv;

                    void main() {
                        vec2 scaledUv = vUv * uvScale + uvOffset;
                        vec4 texelColor = texture2D(map, scaledUv);
                        
                        gl_FragColor = vec4(texelColor.rgb * brightness, texelColor.a);
                    }
                `,
                side: THREE.DoubleSide,
                transparent: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            this._group.add(mesh);
        });

        this.add(this._group);
        this._group.position.set(0, 0, 0);

        this.startCarouselFadeIn();
        this.startInitialRotation();
    }

    private startCarouselFadeIn() {
        gsap.to(this, {
            _carouselBrightness: 1,
            duration: 2.5,
            delay: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this._group.children.forEach((mesh) => {
                    if (mesh instanceof THREE.Mesh && mesh.material instanceof THREE.ShaderMaterial) {
                        mesh.material.uniforms.brightness.value = this._carouselBrightness;
                    }
                });
            }
        });
    }

    private startInitialRotation() {
        // Commencez avec une rotation plus importante pour un effet visible
        this._group.rotation.y = THREE.MathUtils.degToRad(360); // Tourne une fois complète au début

        gsap.to(this._group.rotation, {
            y: 0,
            duration: 4, // Durée un peu plus longue pour un arrêt plus doux
            delay: 0.8,
            ease: "power3.out",
            onComplete: () => {
                this._group.rotation.y = 0;
                // MARQUEUR CLÉ : L'animation initiale est terminée, on peut activer le scroll
                this._isInitialRotationAnimating = false;
            }
        });
    }

    public setRotationProgress(progress: number) {
        this._targetRotationY = progress * this._rotationRange;
    }

    public setCarouselInclination(rotationX: number, rotationZ: number) {
        this._targetRotationX = rotationX;
        this._targetRotationZ = rotationZ;
    }

    public override update(dt: number): void {
        super.update(dt);

        // NOUVEAU : N'applique la rotation du scroll QUE si l'animation initiale est terminée
        if (!this._isInitialRotationAnimating) {
            gsap.to(this._group.rotation, {
                y: this._targetRotationY,
                duration: 0.5,
                ease: "power2.out",
            });
        }

        // Les rotations X et Z peuvent s'appliquer indépendamment car elles ne sont pas animées au démarrage
        gsap.to(this._group.rotation, {
            x: this._targetRotationX,
            z: this._targetRotationZ,
            duration: 1.0,
            ease: "power2.inOut",
        });
    }
}