import { Vector2 } from "three";

const AquarelleShader = {
	uniforms: {
		'tDiffuse': { value: null },
		'tAquarelle': { value: null },
		'time': { value: 0 },
		'ratio': { value: new Vector2(1, 1) },
	},

	vertexShader: /* glsl */`
		precision mediump  float;
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			
		}`,

	fragmentShader: /* glsl */`
		precision mediump  float;
		uniform sampler2D tDiffuse;
    	uniform sampler2D tAquarelle;
		uniform float time;
		uniform vec2 ratio;
		varying vec2 vUv;

		vec4 linearTosRGB( in vec4 value ) {
			return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
		}
        
		void main() {

			vec2 uv = vUv;

			vec4 aquarelle = texture2D(tAquarelle, uv*ratio*0.3 + time*0.005);
			vec4 col = texture2D(tDiffuse, uv+((aquarelle.r-0.5)*0.005));
			col.r += aquarelle.r*0.02;
			col.g += -aquarelle.g*0.02;
			// col = floor(col*8.)/8.;
			vec4 result = linearTosRGB(col);
			gl_FragColor = vec4(result);
			// gl_FragColor = aquarelle;
		}
	`

};

export { AquarelleShader };

