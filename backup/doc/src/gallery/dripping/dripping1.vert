uniform float uniAspectRatio;
attribute vec2 attPoint;
attribute vec2 attUV;
varying vec2 varUV;

void main() {
    varUV = attUV;
    float x = attPoint.x;
    float y = attPoint.y;
    if (uniAspectRatio > 1.0) {
        gl_Position = vec4(x, y * uniAspectRatio, 0.0, 1.0);
    } else {
        gl_Position = vec4(x / uniAspectRatio, y, 0.0, 1.0);
    }
}