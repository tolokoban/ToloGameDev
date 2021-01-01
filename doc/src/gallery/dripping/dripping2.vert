attribute vec2 attPoint;
attribute vec2 attUV;
varying vec2 varUV;

void main() {
    varUV = vec2(attUV.x, 1.0 - attUV.y);
    gl_Position = vec4(attPoint, 0.0, 1.0);
}