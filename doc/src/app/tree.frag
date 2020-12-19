precision highp float;

uniform sampler2D uniTexture;
varying vec2 varUV;

void main() {
    vec4 color = texture2D( uniTexture, varUV);
    if (color.a < 0.9) discard;

    gl_FragColor = vec4(color.rgb, 1.0);
}