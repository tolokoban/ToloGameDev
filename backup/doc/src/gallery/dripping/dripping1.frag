precision mediump float;
uniform vec4 uniColorA0;
uniform vec4 uniColorA1;
uniform vec4 uniColorB0;
uniform vec4 uniColorB1;
uniform vec4 uniColorC0;
uniform vec4 uniColorC1;
uniform sampler2D uniTexture;
varying vec2 varUV;

const vec3 ORANGE = vec3(1.0, 0.5, 0.0);
const vec3 BLUE = vec3(0.0, 0.3, 0.8);

void main() {
    float u = varUV.x;
    float v = varUV.y;
    vec4 color = texture2D(uniTexture, vec2(u, v));
    float lum = color.r + color.g + color.b;
    float a = lum < 1.5 ? 0.0 : v;
    float b = lum < 1.5 ? 1.0 : 1.0 - v;
    vec4 colorA = mix(uniColorA0, uniColorA1, a);
    vec4 colorB = mix(uniColorA0, uniColorA1, b);
    vec4 final = mix(a, b, color.r)
        + mix(colorA, colorB, color.g)
        + mix(colorA, colorB, color.b);
    final = final * 0.33333333333333;
    gl_FragColor = vec4(final.rgb, 1.0);
    gl_FragColor = vec4(color.rgb, 1.0);
}