
varying vec4 vCoord;
uniform mat4 textureMatrix;

void main() {
    vCoord = textureMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
