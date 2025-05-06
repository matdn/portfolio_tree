const ZDepthShader = {

	uniforms: {
		'tDiffuse': { value: null },
		'tDepth': { value: null },
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
        uniform sampler2D tDepth;
		uniform float width;
		uniform float height;
		varying vec2 vUv;

		vec4 linearTosRGB( in vec4 value ) {
			return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
		}


		void main() {
			vec4 col = texture2D(tDepth, vUv);
			// vec4 result = linearTosRGB(col);

			gl_FragColor = col;
		}`

};

export { ZDepthShader };

