attribute vec4 attPoint;

const float DEG2RAD = 0.017453292519943295;

void main() {
    float rv = attPoint.x;
    float av = attPoint.y * DEG2RAD;
    float xv = rv * cos(av);
    float yv = rv * sin(av);
    gl_Position = vec4(xv, yv, 0.0, 1.0);
}