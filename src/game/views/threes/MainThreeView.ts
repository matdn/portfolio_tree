// 

import { ThreeAssetsManager } from "@cooker/three";
import Lenis from '@studio-freight/lenis';
import gsap from "gsap";
import { BufferAttribute, Color, Euler, FrontSide, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, PointLight, PointLightHelper, Quaternion, RepeatWrapping, ShaderMaterial, Texture, Vector3 } from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { Water } from 'three/examples/jsm/objects/Water';
import { AssetId } from "../../constants/games/AssetId";
import { Object3DId } from "../../constants/games/Object3DId";
import { ViewId } from "../../constants/views/ViewId";
import { ViewPlacementId } from "../../constants/views/ViewPlacementId";
import { ThreeCameraControllerBase } from "../../core/_engine/threejs/cameras/bases/ThreeCameraControllerBase";
import { Object3DsProxy } from "../../core/_engine/threejs/proxies/Object3DsProxy";
import { ThreeCamerasProxy } from "../../core/_engine/threejs/proxies/ThreeCamerasProxy";
import { WithoutTransitionThreeView } from "../../core/_engine/threejs/views/WithoutTransitionThreeView";
import { handleCameraIndexChange } from "../doms/reacts/MainReactView";
import { ViewsManager, ViewsProxy } from "pancake";
import { SnowParticles } from "./components/SnowParticles";
import { ReflectorShader } from "./components/ReflectorShader";

export default class MainThreeView extends WithoutTransitionThreeView {
    private _scene: Object3D;
    private _light: PointLight;
    private _mirror: Reflector;
    private _cameraPositions: { position: Vector3; rotation: Euler; }[] = [];
    private _camera: ThreeCameraControllerBase;
    private _scrollProgress: number = 0;
    private _lenis: Lenis;
    private _sweaterLight: PointLight;
    private _lockCameraOnScroll = true;
    private _isAnimating = true;
    private _isAboutPage = false;
    private _backLight = new PointLight(0xffffff, 0);
    private _cursorLight: PointLight | null = null;
    private _snowParticles: SnowParticles;
    private _sweaterMesh: Mesh | null = null;
    private _sweaterHasInteracted = false;

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
    ];

    private _previousCameraIndex: number = -1;


    constructor() {
        super(ViewId.THREE_MAIN, ViewPlacementId.THREE_MAIN);
        this._snowParticles = new SnowParticles();
        // this.add(this._snowParticles);
        this._scene = Object3DsProxy.GetObject3D(Object3DId.MAIN);
        this._camera = ThreeCamerasProxy.CamerasMap.get('MAIN');
        this._light = new PointLight(0xffffff, 2000, 0, 2.7);
        this._light.position.set(0, 5, 70);
        this._sweaterLight = new PointLight(0xffffff, 5.5, 2, 2.7);
        this._cursorLight = new PointLight(0xffffff, 200, 30);
        this._cursorLight.position.set(0, 0, 0);
        this.add(this._cursorLight);
        // this.add(new PointLightHelper(this._cursorLight, 1, 0xff0000));

        const dudvMap: Texture = ThreeAssetsManager.GetTexture(AssetId.IMAGE_DUDV);
        dudvMap.wrapS = dudvMap.wrapT = RepeatWrapping;

        const shader = ReflectorShader;
        shader.vertexShader = `
          uniform mat4 textureMatrix;
          varying vec4 vUv;
          #include <common>
          #include <logdepthbuf_pars_vertex>
          void main() {
            vUv = textureMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            #include <logdepthbuf_vertex>
          }
        `;

        shader.fragmentShader = `
        uniform vec3 color;
        uniform float dudvScale;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDudv;
        uniform float time;
        uniform float waveStrength;
        uniform float waveSpeed;
        uniform float transmission;
        uniform float opacity;

        varying vec4 vUv;
        #include <logdepthbuf_pars_fragment>
        void main() {
        #include <logdepthbuf_fragment>
        vec2 scaledUv = vUv.xy * dudvScale;
        vec2 distortedUv = texture2D(tDudv, vec2(scaledUv.x + time * waveSpeed, scaledUv.y)).rg * waveStrength;
        distortedUv = scaledUv + vec2(distortedUv.x, distortedUv.y + time * waveSpeed);
        vec2 distortion = (texture2D(tDudv, distortedUv).rg * 2.0 - 1.0) * waveStrength;
        vec4 uv = vec4(vUv);
        uv.xy += distortion;
        vec4 base = texture2DProj(tDiffuse, uv);
        gl_FragColor = vec4(mix(base.rgb, color, transmission), opacity);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        }


        `;

        shader.uniforms.tDudv = { value: dudvMap };
        shader.uniforms.time = { value: 0 };
        shader.uniforms.waveStrength = { value: 0.7 };
        shader.uniforms.waveSpeed = { value: 0.05 };
        shader.uniforms.transmission = { value: 0.2 };
        shader.uniforms.color = { value: new Color(0x000000) };
        shader.uniforms.dudvScale = { value: 0.01 };
        shader.uniforms.opacity = { value: 0.75 };
        this._mirror = new Reflector(new PlaneGeometry(800, 800), {
            clipBias: 0.003,
            textureWidth: window.innerWidth * 2,
            textureHeight: window.innerHeight * 2,
            shader,
            color: 0x000000,

        });
        const material = this._mirror.material;
        if (Array.isArray(material)) return;

        (material as ShaderMaterial).transparent = true;
        (material as ShaderMaterial).opacity = 0.15;
        this._mirror.rotation.x = -Math.PI / 2;
        this._mirror.position.set(0, -15, 0);
        this.add(this._mirror);

        const waveGeometry = new PlaneGeometry(800, 800, 400, 400);
        const count = waveGeometry.attributes.position.count;
        const randoms = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random();
        }
        waveGeometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));

        const fresnelMaterial = new ShaderMaterial({
            uniforms: {
                fresnelBias: { value: 0.1 },
                fresnelScale: { value: 1.0 },
                fresnelPower: { value: 2.0 },
                edgeColor: { value: new Color(0xffffff) },
                baseColor: { value: new Color(0x000000) }
            },
            vertexShader: `
              varying vec3 vNormal;
              varying vec3 vViewPosition;
          
              void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
              }
            `,
            fragmentShader: `
              uniform float fresnelBias;
              uniform float fresnelScale;
              uniform float fresnelPower;
              uniform vec3 edgeColor;
              uniform vec3 baseColor;
          
              varying vec3 vNormal;
              varying vec3 vViewPosition;
          
              void main() {
                vec3 viewDir = normalize(vViewPosition);
                float fresnel = fresnelBias + fresnelScale * pow(1.0 - dot(viewDir, normalize(vNormal)), fresnelPower);
                fresnel = clamp(fresnel, 0.0, 1.0);
                vec3 color = mix(baseColor, edgeColor, fresnel);
                gl_FragColor = vec4(color, 1.0);
              }
            `,
            side: FrontSide,
            transparent: false
        });


        this._scene.traverse((child) => {
            if (child.name === Object3DId.PROJECTS) {
                child.children.forEach((mesh, index) => {
                    if (mesh instanceof Mesh) {
                        const textureIndex = index % this._projectTextures.length;
                        mesh.material = new MeshStandardMaterial({
                            map: this._projectTextures[textureIndex],
                            envMapIntensity: 0,
                        });
                    }
                });
            }

            if (child.name === Object3DId.SWEATER) {
                if (child instanceof Mesh) {
                    child.material = fresnelMaterial;
                    const sweaterPos = child.position.clone();
                    this._sweaterLight.position.set(sweaterPos.x, sweaterPos.y + 0.5, sweaterPos.z);
                    this._sweaterLight.intensity = 1000;
                    this.add(this._sweaterLight);
                    this._sweaterMesh = child;
                }
            }

            if (child.name === Object3DId.SCREENS) {
                for (let i = 0; i < child.children.length; i++) {

                    const mesh = child.children[i] as Mesh;
                    const light = new PointLight(0xffffff, 100);

                    mesh.material = new MeshBasicMaterial({
                        color: 0x000000,
                        // metalness: 1,
                        // roughness: 0,
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
        this.add(this._mirror);
        this.add(this._backLight);

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

    public rotateCameraYBy(lookAt: Vector3, pos: Vector3, duration = 5.5) {
        gsap.to(this._camera.camera.position, {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            duration,
            ease: "power2.inOut"
        });
        gsap.to(this._camera.camera.rotation, {
            y: lookAt.y,
            duration,
            ease: "power2.inOut"
        });
    }

    private handleMouseMove = (event: MouseEvent) => {
        if (!this._sweaterHasInteracted) {
            this._sweaterHasInteracted = true;
            return;
        }
        const mouseX = event.clientX / window.innerWidth;
        const mouseY = event.clientY / (window.innerHeight * 2);

        const center = new Vector3(0.16, 17.07, 185);
        const range = 40;

        const targetX = center.x - (mouseX - 0.5) * range; // ← inversion corrigée ici
        const targetY = center.y - 20 + (0.5 - mouseY) * range;
        const targetZ = center.z;

        const targetPos = new Vector3(targetX, targetY, targetZ);

        if (this._cursorLight) {
            this._cursorLight.position.lerp(targetPos, 0.5);
        }

        if (this._sweaterMesh) {
            const sweaterPos = this._sweaterMesh.position.clone();

            // Distance entre le curseur et le sweat sur X
            const deltaX = targetX - sweaterPos.x;

            // Sensibilité et limite de rotation (en radians)
            const sensitivity = 0.02;
            const maxRotation = Math.PI / 6; // 30°

            // Calcul de l'angle cible (attention au signe pour que le sweat ne parte pas à l'envers)
            const targetRotationZ = MathUtils.clamp(-deltaX * sensitivity, -maxRotation, maxRotation);
            const targetRotationY = MathUtils.clamp((targetY - sweaterPos.y) * sensitivity, -maxRotation, maxRotation);
            // Appliquer la rotation de base pour corriger le sens initial si nécessaire
            const baseOffset = Math.PI; // ← rotation de 180° si ton modèle est à l’envers
            const finalTargetZ = targetRotationZ + baseOffset;
            const finalTargetY = targetRotationY + baseOffset;

            // Interpolation douce
            this._sweaterMesh.rotation.z += (finalTargetZ - this._sweaterMesh.rotation.z) * 0.1;
            // this._sweaterMesh.rotation.y += (finalTargetY - this._sweaterMesh.rotation.y) * 0.1;
        }
    };

    public getLenis(): Lenis {
        return this._lenis;
    }

    public setLockCameraOnScroll(value: boolean) {
        this._lockCameraOnScroll = value;

        if (value) {
            this._isAnimating = false;
            this._lenis.stop();
        } else {
            this._isAnimating = true;
            this._lenis.start();
            this.animate();
        }
    }


    public getLockCameraOnScroll(): boolean {
        return this._lockCameraOnScroll;
    }


    private animate() {
        if (!this._isAnimating) return;
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

    public resetCameraToInitialPosition() {
        if (this._cameraPositions.length === 0) return;

        const initial = new Vector3(0, 0, 120);
        this.setLockCameraOnScroll(true); // bloque les updates auto de la cam

        // gsap.to(this._camera.camera.position, {
        //     x: initial.x,
        //     y: initial.y,
        //     z: initial.z,
        //     duration: 2,
        //     ease: "power2.inOut",
        // });

        gsap.to(this._camera.camera.rotation, {
            y: Math.PI,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
                this._isAboutPage = false;
                this._cursorLight!.visible = false;
                window.removeEventListener("mousemove", this.handleMouseMove);

                ViewsManager.HideById(ViewId.ABOUT_REACT);
                ViewsManager.ShowById(ViewId.MAIN_REACT);
                this.setLockCameraOnScroll(false); // réactive scroll-cam
            }
        });
    }


    public override update(dt: number): void {
        super.update(dt);
        const mirrorMaterial = this._mirror.material as ShaderMaterial;
        if (mirrorMaterial.uniforms) {
            mirrorMaterial.uniforms.time.value = performance.now() * 0.0001;
        }
        this._lenis.raf(performance.now());
        this._backLight.power = (this._scrollProgress * 30) * 3000;
        if (this._light.decay > 2) this._light.decay -= 0.02;
        if (this._light.distance < 100) this._light.distance += 0.1;
        if (this._cameraPositions.length < 2) return;

        const index = Math.floor(this._scrollProgress * (this._cameraPositions.length - 1));

        if (index !== this._previousCameraIndex) {
            this._previousCameraIndex = index;

            if (handleCameraIndexChange) {
                handleCameraIndexChange(index);
            }
        }

        const material = (this as any)._waveMaterial;
        if (material) {
            material.uniforms.uTime.value += dt * 0.01;
        }

        const nextIndex = Math.min(index + 1, this._cameraPositions.length - 1);
        const lerpFactor = (this._scrollProgress * (this._cameraPositions.length - 1)) % 1;

        const start = this._cameraPositions[index];
        const end = this._cameraPositions[nextIndex];

        if (start && end) {
            if (!this._lockCameraOnScroll) {
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
        ViewsManager.DisplayedViewsList.forEach((view) => {
            if (view.viewId === ViewId.ABOUT_REACT) {
                this._isAboutPage = true;
            }
        });
        if (this._isAboutPage && !this._cursorLight?.visible) {
            this._cursorLight!.visible = true;
            window.addEventListener('mousemove', this.handleMouseMove);
        } else if (!this._isAboutPage && this._cursorLight?.visible) {
            this._cursorLight.visible = false;
            window.removeEventListener('mousemove', this.handleMouseMove);
        }

    }
}

