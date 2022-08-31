/**
 * Given a seed and an index, returns a pseudo-random number
 * between 0.0 and 1.0.
 * The same number is always returned for the same pair (seed, index).
 */
float random(uint seed, uint index) {
    uvec2 v = uvec2(seed, index);
    v.x += ((v.y<<4u)+0xA341316Cu)^(v.y+0x9E3779B9u)^((v.y>>5u)+0xC8013EA4u);
    v.y += ((v.x<<4u)+0xAD90777Du)^(v.x+0x9E3779B9u)^((v.x>>5u)+0x7E95761Eu);
    v.x += ((v.y<<4u)+0xA341316Cu)^(v.y+0x3C6EF372u)^((v.y>>5u)+0xC8013EA4u);
    v.y += ((v.x<<4u)+0xAD90777Du)^(v.x+0x3C6EF372u)^((v.x>>5u)+0x7E95761Eu);
    uint mask = 0x1FFFFFu;
    return float(v.y & mask) / float(mask);
}