precision mediump float;

uniform sampler2D uniTexture;
varying vec2 varUV;

const float S = 1.0 / 1024.0;
const float Q = 1.0 / 64.0;

void main() {
    vec4 cNW = texture2D(uniTexture, varUV + vec2(-S, -S));
    vec4 cN  = texture2D(uniTexture, varUV + vec2(0, -S));
    vec4 cNE = texture2D(uniTexture, varUV + vec2(S, -S));
    vec4 cW  = texture2D(uniTexture, varUV + vec2(-S, 0));
    vec4 cE  = texture2D(uniTexture, varUV + vec2(S, 0));
    vec4 cSW = texture2D(uniTexture, varUV + vec2(-S, S));
    vec4 cS  = texture2D(uniTexture, varUV + vec2(0, S));
    vec4 cSE = texture2D(uniTexture, varUV + vec2(S, S));

    vec3 color = texture2D(uniTexture, varUV).rgb;

    float rH = 2.0;
    float rL = 1.0;
    if (cNW.r + cN.r + cNE.r >= rH) color.r += Q;
    if (cNW.r + cN.r + cNE.r <= rL) color.r -= Q;
    if (cSW.r + cS.r + cSE.r >= rH) color.r += Q;
    if (cSW.r + cS.r + cSE.r <= rL) color.r -= Q;
    if (cNW.r + cW.r + cSW.r >= rH) color.r += Q;
    if (cNW.r + cW.r + cSW.r <= rL) color.r -= Q;
    if (cNE.r + cE.r + cSE.r >= rH) color.r += Q;
    if (cNE.r + cE.r + cSE.r <= rL) color.r -= Q;

    float gH = 1.6;
    float gL = 1.4;
    if (cNW.g + cN.g + cNE.g >= gH) color.g += Q;
    if (cNW.g + cN.g + cNE.g <= gL) color.g -= Q;
    if (cSW.g + cS.g + cSE.g >= gH) color.g += Q;
    if (cSW.g + cS.g + cSE.g <= gL) color.g -= Q;
    if (cNW.g + cW.g + cSW.g >= gH) color.g += Q;
    if (cNW.g + cW.g + cSW.g <= gL) color.g -= Q;
    if (cNE.g + cE.g + cSE.g >= gH) color.g += Q;
    if (cNE.g + cE.g + cSE.g <= gL) color.g -= Q;

    float bH = 1.8;
    float bL = 1.2;
    if (cNW.b + cN.b + cNE.b >= bH) color.b += Q;
    if (cNW.b + cN.b + cNE.b <= bL) color.b -= Q;
    if (cSW.b + cS.b + cSE.b >= bH) color.b += Q;
    if (cSW.b + cS.b + cSE.b <= bL) color.b -= Q;
    if (cNW.b + cW.b + cSW.b >= bH) color.b += Q;
    if (cNW.b + cW.b + cSW.b <= bL) color.b -= Q;
    if (cNE.b + cE.b + cSE.b >= bH) color.b += Q;
    if (cNE.b + cE.b + cSE.b <= bL) color.b -= Q;

    gl_FragColor = vec4(color, 1);
}