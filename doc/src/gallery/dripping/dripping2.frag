precision mediump float;

uniform float uniTime;
uniform sampler2D uniTexture;
varying vec2 varUV;

const float S = 1.0 / 1024.0;
const float Q = 1.0 / 256.0;
const float D2G = 0.017453292519943295;

void main() {
    float ANGLES[3];
    ANGLES[0] = -30.0 * D2G;
    ANGLES[1] = 0.0 * D2G;
    ANGLES[2] = +30.0 * D2G;
    vec3 cumul = vec3(0,0,0);
    for (int i=0; i<3; i++) {
        float ang = ANGLES[i];
        float u = varUV.x + S * sin(ang);
        float v = varUV.y - S * cos(ang);
        cumul += texture2D(uniTexture, vec2(u, v)).rgb;
    }

    vec3 color = texture2D(uniTexture, varUV).rgb;
    float factor = 5.5 +
        2.0 * cos(uniTime * 0.014532) * sin(uniTime * 0.0094841);
    color.r += cumul.r < 1.0 ? -Q * factor : +Q;
    color.g += cumul.g < 1.0 ? -Q * factor : +Q;
    color.b += cumul.b < 1.0 ? -Q * factor : +Q;
    
    gl_FragColor = vec4(color, 1);
}