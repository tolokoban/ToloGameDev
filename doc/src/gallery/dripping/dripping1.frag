precision mediump float;
uniform sampler2D uniTexture;
varying vec2 varUV;

const vec3 ORANGE = vec3(1.0, 0.5, 0.0);
const vec3 BLUE = vec3(0.0, 0.3, 0.8);

void main() {
    float u = varUV.x;
    float v = varUV.y;
    vec4 color = texture2D(uniTexture, vec2(u, v));
    gl_FragColor = vec4(color.rgb, 1.0);
}