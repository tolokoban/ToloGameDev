// uniform float uniScaleX;
// uniform float uniScaleY;
uniform float uniX;
uniform float uniY;
uniform float uniZ;
uniform float uniScale;

attribute vec2 attPoint;

void main() {
    float x = attPoint.x * uniScale + uniX;
    float y = attPoint.y * uniScale + uniY;
    float z = uniZ;
    gl_Position = vec4(x, y, z, 1.0);
}