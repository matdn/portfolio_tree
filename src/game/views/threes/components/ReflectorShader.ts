import { Color, Texture, Matrix4, IUniform } from 'three';

type ReflectorUniforms = {
    color: IUniform<Color>;
    dudvScale: IUniform<number>;
    tDiffuse: IUniform<Texture | null>;
    tDudv: IUniform<Texture | null>;
    time: IUniform<number>;
    waveStrength: IUniform<number>;
    waveSpeed: IUniform<number>;
    transmission: IUniform<number>;
    opacity: IUniform<number>;
    textureMatrix: IUniform<Matrix4>;
};

export const ReflectorShader: {
    uniforms: ReflectorUniforms;
    vertexShader: string;
    fragmentShader: string;
} = {
    uniforms: {
        color: { value: new Color(0x000000) },
        dudvScale: { value: 0.4 },
        tDiffuse: { value: null },
        tDudv: { value: null },
        time: { value: 0 },
        waveStrength: { value: 0.5 },
        waveSpeed: { value: 2.0 },
        transmission: { value: 0.1 },
        opacity: { value: 0.75 },
        textureMatrix: { value: new Matrix4() },
    },
    vertexShader: `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    #include <common>
    #include <logdepthbuf_pars_vertex>
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      #include <logdepthbuf_vertex>
    }
  `,
    fragmentShader: `
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
  `
};
