/**
 * Return the angle of `point` with X axis.
 */
float computeAngle(in vec2 point)
{
    float x = point.x;
    float y = point.y;
    bool s = (abs(x) > abs(y));
    return mix(1.5707963267948966 - atan(x,y), atan(y,x), s);
}