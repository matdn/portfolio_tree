// 

import { Mesh, MeshStandardMaterial, Object3D, PointLight, PointLightHelper, PlaneGeometry, Euler, ShaderMaterial, DoubleSide, BufferAttribute } from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { Object3DId } from "../../constants/games/Object3DId";
import { ViewId } from "../../constants/views/ViewId";
import { ViewPlacementId } from "../../constants/views/ViewPlacementId";
import { Object3DsProxy } from "../../core/_engine/threejs/proxies/Object3DsProxy";
import { WithoutTransitionThreeView } from "../../core/_engine/threejs/views/WithoutTransitionThreeView";
import { ThreeAssetsManager } from "@cooker/three";
import { AssetId } from "../../constants/games/AssetId";
import { Vector3 } from "yuka";
import { ThreeCameraControllerBase } from "../../core/_engine/threejs/cameras/bases/ThreeCameraControllerBase";
import gsap from "gsap";
import { ThreeCamerasProxy } from "../../core/_engine/threejs/proxies/ThreeCamerasProxy";
import Lenis from '@studio-freight/lenis';
import { Point } from "cookware";
import { Water } from 'three/examples/jsm/objects/Water';
import { handleCameraIndexChange } from "../doms/reacts/MainReactView";

export default class MainThreeView extends WithoutTransitionThreeView {
    private _scene: Object3D;
    private _light: PointLight;
    private _mirror: Reflector;
    private _cameraPositions: { position: Vector3; rotation: Euler; }[] = [];
    private _camera: ThreeCameraControllerBase;
    private _scrollProgress: number = 0;
    private _lenis: Lenis;
    private _backLight = new PointLight(0xffffff, 0);
    private _projectTextures = [
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
        ThreeAssetsManager.GetTexture(AssetId.IMAGE_THREE),
    ];
    private _water: Water;
    private _previousCameraIndex: number = -1;


    constructor() {
        super(ViewId.THREE_MAIN, ViewPlacementId.THREE_MAIN);

        this._scene = Object3DsProxy.GetObject3D(Object3DId.MAIN);
        this._camera = ThreeCamerasProxy.CamerasMap.get('MAIN');
        this._light = new PointLight(0xffffff, 2000, 0, 2.7);
        this._light.position.set(0, 5, 70);

        this._mirror = new Reflector(
            new PlaneGeometry(200, 200),
            {
                clipBias: 0.003,
                textureWidth: window.innerWidth * 2,
                textureHeight: window.innerHeight * 2,
                color: 0x777777,

            }

        );

        this._water = new Water(new PlaneGeometry(200, 200), {});

        this._mirror.position.set(0, -15, 0);
        this._mirror.rotation.x = -Math.PI / 2;
        const waveGeometry = new PlaneGeometry(800, 800, 400, 400);
        const count = waveGeometry.attributes.position.count;
        const randoms = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random();
        }
        waveGeometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));
        const waveMaterial = new ShaderMaterial({
            transparent: true,
            side: DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uAmplitude: { value: 0.5 },
                uFrequency: { value: 4.0 },
                uSpeed: { value: 1.0 },
            },
            vertexShader: `
               uniform float uTime;
                uniform float uAmplitude;
                uniform float uFrequency;
                uniform float uSpeed;

                attribute float aRandom;

                varying vec2 vUv;
                varying float vHeight;

                float smoothWave(vec2 p, float time, float scale, float speed, float offset) {
                    return sin(dot(p, vec2(scale, scale)) + time * speed + offset) * 0.5 +
                        cos(dot(p, vec2(scale * 0.5, scale * 1.3)) + time * speed * 0.7 + offset) * 0.3;
                }

                void main() {
                    vUv = uv;
                    vec3 pos = position;

                    vec2 p = pos.xy + aRandom * 10.0;

                    float wave = smoothWave(p, uTime, uFrequency, uSpeed, aRandom * 5.0);

                    pos.z += wave * uAmplitude;

                    vHeight = pos.z;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                varying float vHeight;

                void main() {
                    float baseAlpha = 0.02;

                    float glow = smoothstep(0.4, 0.7, vHeight);
                    vec3 color = mix(vec3(1.0), vec3(1.5), glow);

                    gl_FragColor = vec4(color, baseAlpha + glow * 0.1);
                }
                `,
        });

        const waveMesh = new Mesh(waveGeometry, waveMaterial);
        waveMesh.rotation.x = -Math.PI / 2;
        waveMesh.position.y = -14.99; // Juste au-dessus du miroir
        // this.add(waveMesh);

        // stocker dans la classe si tu veux y accéder dans update()
        (this as any)._waveMaterial = waveMaterial;
        this._scene.traverse((child) => {
            if (child.name === Object3DId.PROJECTS) {
                child.children.forEach((mesh, index) => {
                    if (mesh instanceof Mesh) {
                        const textureIndex = index % this._projectTextures.length; // Sélectionne une texture en boucle
                        mesh.material = new MeshStandardMaterial({
                            map: this._projectTextures[textureIndex], // Assigne la texture correspondante
                            envMapIntensity: 0,
                        });
                    }
                });
            }
            if (child.name === Object3DId.SCREENS) {
                for (let i = 0; i < child.children.length; i++) {

                    const mesh = child.children[i] as Mesh;
                    const light = new PointLight(0xff0000, 100);
                    // light.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
                    // light.position.y += 1;
                    // this.add(new PointLightHelper(light, 1));
                    // this.add(light);
                    mesh.material = new MeshStandardMaterial({
                        color: 0xeeeeee,
                        metalness: 0.9,
                        roughness: 0.8,
                        envMapIntensity: 0,
                    });
                }
            }
            if (child.name === Object3DId.CAMERAS_POS) {
                for (let i = 0; i < child.children.length; i++) {
                    const cam = child.children[i];
                    this._cameraPositions.push({
                        position: new Vector3(cam.position.x, cam.position.y, cam.position.z),
                        rotation: new Euler(cam.rotation.x, cam.rotation.y, cam.rotation.z),
                    });
                }
            }
        });
        this._backLight.position.set(0, 0, 0);

        this.add(this._scene);
        this.add(this._light);
        // this.add(new PointLightHelper(this._light, 1));
        this.add(this._mirror);
        this.add(this._backLight);
        // this.add(new PointLightHelper(this._backLight, 1));

        this._lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            gestureOrientation: "vertical",
        });

        this._lenis.on('scroll', ({ progress }) => {
            this.setScrollProgress(progress);
        });

        this.animate();
    }

    private animate() {
        this._lenis.raf(performance.now());
        requestAnimationFrame(() => this.animate());
    }

    public setScrollProgress(progress: number) {
        gsap.to(this, {
            _scrollProgress: progress,
            duration: 0.2,
            ease: "power2.out"
        });
    }

    public getCameraPositions() {
        return this._cameraPositions;
    }

    public override update(dt: number): void {
        super.update(dt);
        this._lenis.raf(performance.now());
        this._backLight.power = (this._scrollProgress * 30) * 1000;
        if (this._light.decay > 2) this._light.decay -= 0.02;
        if (this._light.distance < 100) this._light.distance += 0.1;
        if (this._cameraPositions.length < 2) return;

        const index = Math.floor(this._scrollProgress * (this._cameraPositions.length - 1));

        // Log si on change d'empty
        if (index !== this._previousCameraIndex) {
            this._previousCameraIndex = index;
            console.log(`🎥 Passage sur la caméra ${index}`);

            // Appelle la fonction exposée par React :
            if (handleCameraIndexChange) {
                handleCameraIndexChange(index);
            }
        }

        const material = (this as any)._waveMaterial;
        if (material) {
            material.uniforms.uTime.value += dt * 0.005;
        }

        const nextIndex = Math.min(index + 1, this._cameraPositions.length - 1);
        const lerpFactor = (this._scrollProgress * (this._cameraPositions.length - 1)) % 1;

        const start = this._cameraPositions[index];
        const end = this._cameraPositions[nextIndex];

        if (start && end) {
            gsap.to(this._camera.position, {
                x: start.position.x * (1 - lerpFactor) + end.position.x * lerpFactor,
                y: start.position.y * (1 - lerpFactor) + end.position.y * lerpFactor,
                z: start.position.z * (1 - lerpFactor) + end.position.z * lerpFactor,
                duration: 0.5,
                ease: "power2.out",
            });

            gsap.to(this._camera.rotation, {
                y: start.rotation.y * (1 - lerpFactor) + end.rotation.y * lerpFactor,
                duration: 0.5,
                ease: "power2.out",
            });
        }
    }

}

