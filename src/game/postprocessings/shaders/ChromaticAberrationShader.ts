import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    Vector2,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// Shader pour aberration chromatique
const ChromaticAberrationShader = {
    uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        amount: { value: 0.005 }, // Intensité de l'effet
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float amount;

        varying vec2 vUv;

        void main() {
            vec2 offset = amount / resolution;
            vec4 color = vec4(
                texture2D(tDiffuse, vUv + vec2(offset.x, 0.0)).r,
                texture2D(tDiffuse, vUv).g,
                texture2D(tDiffuse, vUv - vec2(offset.x, 0.0)).b,
                1.0
            );
            gl_FragColor = color;
        }
    `,
};

export default class AberrationEffect {
    private _composer: EffectComposer;

    constructor(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
        // EffectComposer configuration
        this._composer = new EffectComposer(renderer);

        // RenderPass
        const renderPass = new RenderPass(scene, camera);
        this._composer.addPass(renderPass);

        // Chromatic Aberration Pass
        const chromaticAberrationPass = new ShaderPass(ChromaticAberrationShader);
        chromaticAberrationPass.uniforms.amount.value = 0.01; // Réglez l'intensité ici
        this._composer.addPass(chromaticAberrationPass);

        // Bloom (optionnel)
        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this._composer.addPass(bloomPass);

        // Resize listener
        window.addEventListener("resize", () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            this._composer.setSize(width, height);
        });
    }

    render(delta: number) {
        this._composer.render(delta);
    }
}
