uniform mat3 uniTransfo;

attribute vec4 attPoint;
varying vec2 varUV;

void main() {
    varUV = attPoint.zw;
    vec3 point = uniTransfo * vec3(attPoint.xy, 1.0);
    point.z = 1.0;
    gl_Position = vec4(point, 1.0);
}