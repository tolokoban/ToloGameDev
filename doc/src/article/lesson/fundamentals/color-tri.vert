attribute vec2 attPoint;
attribute vec3 attColor;
varying vec3 varColor;

void main() {
    varColor = attColor;
    gl_Position = vec4(attPoint.xy, 0.0, 1.0);
}