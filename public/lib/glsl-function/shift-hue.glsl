/**
 * Fast hue shifting for colors.
 * @param hue Expressed in radians.
 */
vec3 shiftHue(vec3 color, float hue)
{
    const vec3 k = vec3(0.5773502691896258);
    float cosAngle = cos(hue);
    return vec3(
        color * cosAngle 
        + cross(k, color) * sin(hue) 
        + k * dot(k, color) * (1.0 - cosAngle)
    );
}