const BlurShader = {

	uniforms: {
		'tDiffuse': { value: null },
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
		uniform sampler2D tBlur;
		uniform sampler2D tNoise;
		uniform vec2 tNoiseOffset;
		uniform float width;
		uniform float height;
		varying vec2 vUv;

		vec4 linearTosRGB( in vec4 value ) {
			return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
		}

		vec3 getColor(vec2 uv, float dx, float dy) {
			return texture2D(tDiffuse, uv+vec2(dx, dy)).rgb;
		}

		vec3 getBlurColor(vec2 uv, float d) {
			vec3 col = vec3(0.0);
			col += getColor(uv, d, 0.0);
			col += getColor(uv, -d, 0.0);
			col += getColor(uv, 0.0, d);
			col += getColor(uv, 0.0, -d);
			return col / 4.0;
		}

		void main() {
			float blur = texture2D(tBlur, vUv).r;
			vec4 noise = texture2D(tNoise, vUv + tNoiseOffset);		
			vec3 col1 = getBlurColor(vUv, blur*0.005);
			vec3 col2 = getBlurColor(vUv, blur*0.0025);
			vec3 col = (col1+col2) *0.5;	

			vec4 result = vec4(col, 1.0);// + noise*0.02;
			result = linearTosRGB(result);
			gl_FragColor = vec4(result);
		}`

};

export { BlurShader };

