import { DepthTexture, DisplayP3ColorSpace, HalfFloatType, LinearDisplayP3ColorSpace, LinearSRGBColorSpace, NoColorSpace, ShaderMaterial, SRGBColorSpace, WebGLRenderer, WebGLRenderTarget } from "three";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass";
import { FollowCameraControllerBase } from "../../cameras/bases/FollowCameraControllerBase";
import { ThreeCamerasManager } from "../../core/_engine/threejs/managers/ThreeCamerasManager";

export class BlurPass extends Pass {

    private readonly _mixMaterial: ShaderMaterial;
    private readonly _mixQuad: FullScreenQuad;

    private readonly _blurMaterial: ShaderMaterial;
    private readonly _blurQuad: FullScreenQuad;

    private readonly _blurRenderTarget: WebGLRenderTarget;

    constructor() {

        super();

        this._mixMaterial = new ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                tBlur: { value: null },
                tDepth: { value: null },
                near: { value: 0 },
                far: { value: 0 },
                center: { value: 0 },
                distance: { value: 0 },
            },
            vertexShader: /* glsl */`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */`
                uniform sampler2D tDiffuse;
                uniform sampler2D tBlur;
                uniform sampler2D tDepth;
                uniform float near;
                uniform float far;
                uniform float center;
                uniform float distance;
                varying vec2 vUv;       

                const vec3 POW_CONSTANT = vec3(0.41666);
                const vec3 THRESHOLD = vec3(0.0031308);
                const vec3 DECAL = vec3(0.055);

                // float getDepth( const in vec2 screenPosition ) {
                //     return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
                // }
    
                float linearizeDepth(float depth, float near, float far) {
                    return -( near * far ) / ( ( far - near ) * depth - far );
                    // return perspectiveDepthToViewZ( depth, near, far );
                    // return (2.0 * near) / (far + near - depth * (far - near));
                }

                vec4 linearTosRGB(in vec4 value) {
                    vec3 linearRGB = pow(value.rgb, POW_CONSTANT);
                    vec3 sRGB = mix(linearRGB * 1.055 - DECAL, linearRGB * 12.92, step(linearRGB, THRESHOLD));
                    return vec4(sRGB, value.a);
                }

                void main() {
                    vec4 diff = texture2D(tDiffuse, vUv);
                    vec4 blur = texture2D(tBlur, vUv);
                    float depth = linearizeDepth(texture2D(tDepth, vUv).r, near, far) / (far - near);
                    // depth = abs(depth - center);
                    depth = center - depth;
                    depth = 1.- depth;
                    depth += distance;
                    depth = pow(depth, 40.);
                    depth =smoothstep(0.75, 0.95, depth);

                    float y = smoothstep(0.1, 0.25, vUv.y);
                    depth *= y;

                    // depth = 1.- depth;
                    vec4 color = mix(blur,diff, depth);
                    // color = linearTosRGB(color);
                    gl_FragColor.rgb = color.rgb;
                    // gl_FragColor.rgb = vec3(depth);
                    // gl_FragColor.rgb = blur.rgb;
                    gl_FragColor.rgb = diff.rgb;
                    gl_FragColor.a = 1.;

                }
            `,
        });

        this._blurMaterial = new ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null }, // Uniforme pour la texture d'entrée
            },
            vertexShader: /* glsl */`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */`
                uniform sampler2D tDiffuse;
                varying vec2 vUv;       
                void main() {
                    vec4 color = vec4(0.0);
                    float offset = 1.0 / 512.0;
                    vec2 uvOffset;
                    for (int x = -2; x <= 2; x++) {
                        for (int y = -2; y <= 2; y++) {
                            uvOffset = vUv + vec2(float(x), float(y)) * offset;
                            color += texture2D(tDiffuse, uvOffset);
                        }
                    }
                    color /= 25.0; // 5x5 = 25 échantillons
                    gl_FragColor = color;
                    // vec3 color = texture2D(tDiffuse, vUv).rgb;
                    // gl_FragColor.rgb = color.rgb;
                    // gl_FragColor.a = 1.;

                }
            `,
        });
        this._blurQuad = new FullScreenQuad(this._blurMaterial);
        this._blurRenderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            // depthBuffer: true,
            // colorSpace: SRGBColorSpace,
            type: HalfFloatType,
        });
        // this._blurRenderTarget.texture.colorSpace = SRGBColorSpace;


        this._mixQuad = new FullScreenQuad(this._mixMaterial);

    }


    public override render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, _deltaTime?: number, _maskActive?: boolean): void {

        let followCamera: FollowCameraControllerBase | null = null;
        // let followCamera: FollowCameraControllerBase | null = null;
        // followCamera = ThreeCamerasProxy.GetCamera(CameraId.TWEED_DUNE_FOLLOW);
        if (ThreeCamerasManager.ActivCamera instanceof FollowCameraControllerBase) {
            followCamera = ThreeCamerasManager.ActivCamera;
        }
        const camera = followCamera.camera;
        let center = 0;
        let distance = 2;
        // if (followCamera) center = followCamera.position.distanceTo(followCamera.lookAtPosition);
        // center *= distance;
        // center = ThreeMouseManager.RelativeMouseY * 100;
        // distance = ThreeMouseManager.RelativeMouseY * 10;
        // console.log(center);
        // distance = this._linearizeDepth(center, camera.near, camera.far);
        center = (center) / (camera.far - camera.near);
        distance = (distance) / (camera.far - camera.near);
        renderer.setRenderTarget(this._blurRenderTarget);
        this._blurMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this._blurQuad.render(renderer);

        renderer.setRenderTarget(null);
        this._mixMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this._mixMaterial.uniforms.tBlur.value = this._blurRenderTarget.texture;
        this._mixMaterial.uniforms.near.value = camera.near;
        this._mixMaterial.uniforms.far.value = camera.far;
        this._mixMaterial.uniforms.center.value = center;
        this._mixMaterial.uniforms.distance.value = distance;
        this._mixQuad.render(renderer);

    }

    public dispose(): void {
        this._blurQuad.dispose();
        this._mixQuad.dispose();
        this._blurMaterial.dispose();
        this._mixMaterial.dispose();
    }

    public setSize(width: number, height: number): void {
        let s = 0.5;
        this._blurRenderTarget.setSize(width * s, height * s);
    }

    public setDepthTexture(depthTexture: DepthTexture): void {
        this._mixMaterial.uniforms.tDepth.value = depthTexture;
    }
}
