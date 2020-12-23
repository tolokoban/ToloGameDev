uniform float uniTime;
attribute vec4 attPoint;

const float DEG2RAD = 0.017453292519943295;

void main() {
    float rv = attPoint.x * sin(uniTime * 0.0010574);
    float av = (attPoint.y + uniTime * 0.107) * DEG2RAD;
    float xv = rv * cos(av);
    float yv = rv * sin(av);
    float rc = attPoint.z * cos(uniTime * 0.0014574);
    float ac = (attPoint.w + uniTime * 0.0731) * DEG2RAD;
    float xc = rc * cos(ac);
    float yc = rc * sin(ac);
    float x = xv + xc;
    float y = yv + yc;
    gl_Position = vec4(x, y, 0.0, 1.0);
}