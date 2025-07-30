
#include <common>

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform vec3 color;
uniform float opacity;
uniform float blurAmount;
uniform float depthScale;

varying vec4 vCoord;

void main() {
    vec2 uv = vCoord.xy / vCoord.w;

    vec4 base = vec4(0.0);
    float total = 0.0;

    // Simple Gaussian blur approximation
    for (float x = -4.0; x <= 4.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
            vec2 offset = vec2(x, y) * blurAmount;
            base += texture2D(tDiffuse, uv + offset);
            total += 1.0;
        }
    }

    base /= total;
    gl_FragColor = vec4(mix(base.rgb, color, 0.2), opacity);
}
