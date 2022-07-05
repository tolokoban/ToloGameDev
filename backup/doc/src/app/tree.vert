uniform float uniAspectRatio;
uniform vec3 uniCamera;
attribute vec3 attPoint;
attribute vec2 attUV;
varying vec2 varUV;

void main() {
    varUV = attUV;
    vec3 point = attPoint - uniCamera;
    float w = point.y;
    float x = point.x;
    float y = point.z * uniAspectRatio;
    float z = (point.y - 1.0) * 0.01 * w;
    gl_Position = vec4(x, y, z, w);
}