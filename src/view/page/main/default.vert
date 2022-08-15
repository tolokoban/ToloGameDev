#version 300 es

uniform float uniTime;
in vec2 attPoint;
in vec3 attColor;
out vec3 varColor;

void main() {
    float strength = 0.5 + 0.5 * cos(uniTime * 0.001);
    varColor = attColor * strength;
    gl_Position = vec4(attPoint, 0.0, 0.0);
}

/**
 * out vec4 gl_Position
 * out float gl_PointSize
 * out float gl_ClipDistance[] 
 * in int gl_VertexID
 * in int gl_InstanceID
 */
 