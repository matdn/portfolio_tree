// import {
//     Color,
//     Mesh,
//     PlaneGeometry,
//     RepeatWrapping,
//     Shader,
//     Texture,
// } from 'three';
// import { Reflector } from 'three/examples/jsm/objects/Reflector';

// export class WaterSurface extends Mesh {
//     private _reflector: Reflector;
//     private _shader: Shader;

//     constructor(
//         dudvMap: Texture,
//         options?: {
//             size?: number;
//             waveStrength?: number;
//             waveSpeed?: number;
//             transmission?: number;
//             color?: Color;
//         }
//     ) {
//         const size = options?.size ?? 500;
//         const geometry = new PlaneGeometry(size, size);

//         // Configuration du dudv
//         // dudvMap.wrapS = dudvMap.wrapT = RepeatWrapping;

//         // Création du shader custom à partir de ReflectorShader
//         const shader = Reflector.ReflectorShader;
//         shader.vertexShader = `
//         uniform mat4 textureMatrix;
//         varying vec4 vUv;
//         #include <common>
//         #include <logdepthbuf_pars_vertex>
//         void main() {
//           vUv = textureMatrix * vec4(position, 1.0);
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//           #include <logdepthbuf_vertex>
//         }
//       `;
//         shader.fragmentShader = `
//         uniform vec3 color;
//         uniform sampler2D tDiffuse;
//         uniform sampler2D tDudv;
//         uniform float time;
//         uniform float waveStrength;
//         uniform float waveSpeed;
//         uniform float transmission;
  
//         varying vec4 vUv;
  
//         #include <logdepthbuf_pars_fragment>
  
//         void main() {
//           #include <logdepthbuf_fragment>
  
//           vec2 distortedUv = texture2D(tDudv, vec2(vUv.x + time * waveSpeed, vUv.y)).rg * waveStrength;
//           distortedUv = vUv.xy + vec2(distortedUv.x, distortedUv.y + time * waveSpeed);
//           vec2 distortion = (texture2D(tDudv, distortedUv).rg * 2.0 - 1.0) * waveStrength;
  
//           vec4 uv = vec4(vUv);
//           uv.xy += distortion;
  
//           vec4 base = texture2DProj(tDiffuse, uv);
//           gl_FragColor = vec4(mix(base.rgb, color, transmission), 1.0);
  
//           #include <tonemapping_fragment>
//           #include <encodings_fragment>
//         }
//       `;

//         shader.uniforms.tDudv = { value: dudvMap };
//         shader.uniforms.time = { value: 0 };
//         shader.uniforms.waveStrength = { value: options?.waveStrength ?? 0.02 };
//         shader.uniforms.waveSpeed = { value: options?.waveSpeed ?? 0.0003 };
//         shader.uniforms.transmission = { value: options?.transmission ?? 0.4 };
//         shader.uniforms.color = { value: options?.color ?? new Color(0x000000) };

//         const reflector = new Reflector(geometry, {
//             clipBias: 0.05,
//             textureWidth: window.innerWidth,
//             textureHeight: window.innerHeight,
//             shader,
//             color: options?.color ?? new Color(0x000000),
//         });

//         reflector.rotation.x = -Math.PI / 2;
//         super(geometry, reflector.material);

//         this._reflector = reflector;
//         this._shader = shader;

//         this.add(this._reflector);
//     }

//     public update(time: number) {
//         this._shader.uniforms.time.value = time;
//     }

//     public getReflector(): Reflector {
//         return this._reflector;
//     }
// }
