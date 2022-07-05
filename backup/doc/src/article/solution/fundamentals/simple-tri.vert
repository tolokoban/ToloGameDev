attribute vec2 attPoint;

void main() {
    gl_Position = vec4(attPoint.xy, 0.0, 1.0);
}