uniform float uniZ;
uniform mat3 uniTransfo;

attribute vec2 attPoint;

void main() {
    vec3 point = uniTransfo * vec3(attPoint, 1.0);
    point.z = uniZ;
    gl_Position = vec4(point, 1.0);
}