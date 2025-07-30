import { Color, Vector2 } from "three";

export const ReflectorShader = {
  uniforms: {
    color: { value: new Color(0x000000) },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    blurAmount: { value: 2.0 }, // rayon du blur (en pixels)
    opacity: { value: 0.6 },
  },

  vertexShader: `
    uniform mat4 textureMatrix;
    varying vec4 vUv;

    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform float opacity;
    uniform float blurAmount;
    varying vec4 vUv;

    void main() {
      vec2 uv = vUv.xy / vUv.w;
      vec4 sum = vec4(0.0);
      float count = 0.0;

      for (float x = -2.0; x <= 2.0; x++) {
        for (float y = -2.0; y <= 2.0; y++) {
          vec2 offset = vec2(x, y) * blurAmount / 1024.0; // ajustable selon résolution
          sum += texture2D(tDiffuse, uv + offset);
          count += 1.0;
        }
      }

      vec4 base = sum / count;
      base.rgb = mix(base.rgb, color, 0.1); // désaturation légère

      gl_FragColor = vec4(base.rgb, opacity);
    }
  `
};
