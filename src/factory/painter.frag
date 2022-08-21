#version 300 es

precision mediump float;

in vec3 varColor;
out vec4 FragColor;

void main() {
    FragColor = vec4(varColor, 1.0);
}

/**
 * in vec4 gl_FragCoord
 * in bool gl_FrontFacing
 * in vec2 gl_PointCoord
 */
