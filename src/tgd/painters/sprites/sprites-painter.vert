#version 300 es

uniform mat4 uniCamera;
in vec2 attPoint;
in vec2 attAtlasXY;
in vec2 attAtlasWH;
in vec2 attCenter;
in mat2 attTransform;
in vec3 attPosition;
out vec2 varUV;

void main() {
    varUV = attPoint * attAtlasWH + attAtlasXY;
    vec3 point = vec3(attTransform * (attPoint - attCenter) * attAtlasWH, 0.0) + attPosition;
    gl_Position = uniCamera * vec4(point, 1.0);
}
