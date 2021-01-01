# Varyings

There are three kind of variables in WebGL:

* __Uniforms__: constant during a render.
* __Attributes__: attached to a vertex.
* __Varyings__: attached to a fragment.

You can use __uniforms__ in either vertex or fragment shaders.
But __attributes__ are only for vertex shaders
and __varying__ only for fragment shaders.
Moreover, values for __varyings__ can only be set in vertex shader.

Since you need three vertices to paint a triangle,
your fragment shader will use an interpolation of the values set for varyings
for each vertex.

Look at those shaders:

```glsl
attribute vec2 attPoint;
attribute vec3 attColor;
// Declare a varying.
varying vec3 varColor;

void main() {
    // Set its value.
    varColor = attColor;
    gl_Position = vec4(attPoint, 0.0, 1000.0);
}
```

<TriColor />

```glsl
precision mediump float;
// Declare a varying.
varying vec3 varColor;

void main() {
    gl_FragColor = vec4(varColor, 1.0);
}
```

When the fragment shader reads the value of its varying `varColor`, it gets
an interpolation of the values set for the three vertices used to fill the
current triangle.

This interpolation doesn't know it's dealing with colors.
The interpolation is just made on numbers and you can use it for anythink.

# The attributes

Here are the attributes we used:

| __Name__ | __Type__ | __Size__ | __Normalized?__ | __Description__ |
| -------- | -------- | -------- | --------------- | --------------- |
| attPoint | SHORT    | 2        | False           | `(x,y)` integers within [-32768,+32767] |
| attColor | UBYTE    | 3        | True            | `(r,g,b)` integers within [0,255] |

We can see that we will use integers as inpupts for out attributes.
But the vertex shader will see them as vectors of floats.
WebGL is responsible of the convertion. Telling it to normalized `attColor`
means that we need the float values to be within `[0.0, 1.0]`.

The code to write to set the vertex attributes pointer and prepare the memory
is a boilerplate and is prone to mistakes.
That's why I suggest you use [my tool](#tool/attributes) to generate the code of the `Data` class
we will use in this article.

# The resulting code

<Coords />

```ts
const prg = createProgram(gl, {
    vert: `attribute vec2 attPoint;
attribute vec3 attColor;
// Declare a varying.
varying vec3 varColor;
void main() {
    // Set its value.
    varColor = attColor;
    gl_Position = vec4(attPoint, 0.0, 1000.0);
}`,
                    frag: `precision mediump float;
// Declare a varying.
varying vec3 varColor;
void main() {
    gl_FragColor = vec4(varColor, 1.0);
}`
})
const data = new Data(gl, 3)
data.set(   0, +900, 255, 128,   0)
data.set(+600, -700,   0, 102, 221)
data.set(-700, -600, 255, 255, 255)
data.init(prg)
data.send()
gl.clearColor(0, 0.4, 0.867, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

This code is way much simpler than the codes you saw in previous lessons.
And that's good because the shortest your code, the lesser errors you will make.

# Barycenteric coordinates

<Barycenter />

Let's try to add a new attribute: `attBarycenter`.
We will se how this allows us to get this ribbed triangle.

<Att>
attPoint short 2
attColor ubyte 3 true
attBarycenter ubyte 3 true
</Att>

Here is the vertex shader code:

```glsl
attribute vec2 attPoint;
attribute vec3 attColor;
attribute vec3 attBarycenter;
varying vec3 varColor;
varying vec3 varBarycenter;
void main() {
    varColor = attColor;
    varBarycenter = attBarycenter;
    gl_Position = vec4(attPoint, 0.0, 1000.0);
}
```

We use this new attribute is the same way we did for `attColor`.
And all the magic is done in the fragment shader:

```glsl
precision mediump float;
uniform float uniTime;
varying vec3 varBarycenter;
varying vec3 varColor;
void main() {
    float dist = max(
        varBarycenter.x,
        max(
            varBarycenter.y,
            varBarycenter.z
        ));
    vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
    float alpha = (cos(dist * 66.6 - uniTime * 0.01) + 1.0) * 0.5;
    gl_FragColor = vec4(
        mix(varColor, oppColor, alpha),
        1.0
    );
}
```

`mix(varColor, oppColor, alpha)` is a convenient function which means  
`(1.0 - alpha) * varColor + alpha * oppColor`.

* If `alpha == 0` the result will be `varColor`.
* If `alpha == 1` the result will be `oppColor`.
* Otherwise, the result will be an interpolation between `varColor` and `oppColor`.

`dist` will give us the distance to the nearest point.

Here is the initializing code:

```js
const data = new Data(gl, 3)
//        attPoint  |    attColor   | attBarycenter
data.set(   0,  900,  255, 128,   0,  255,   0,   0)
data.set( 600, -700,    0, 255, 128,    0, 255,   0)
data.set(-700, -600,  128,   0, 255,    0,   0, 255)
data.init(prg)
data.send()
```

And here is the animation part:

```js
gl.clearColor(0, 0.4, 0.867, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
const uniTime = gl.getUniformLocation(prg, "uniTime")
gl.uniform1f(uniTime, time)
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

# Exercises

Use this [website](https://www.shaderific.com/glsl-functions) to have an overview of the Shading Language and try to solve the following exercises. You are expected to write the fragment shader code to get the result you can see on the right. You can start with this fragment shader and modify it:

```glsl
precision mediump float;
uniform float uniTime;
varying vec3 varBarycenter;
varying vec3 varColor;
void main() {
    float dist = max(
        varBarycenter.x,
        max(
            varBarycenter.y,
            varBarycenter.z
        ));
    vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
    float alpha = (cos(dist * 66.6 - uniTime * 0.01) + 1.0) * 0.5;
    gl_FragColor = vec4(
        mix(varColor, oppColor, alpha),
        1.0
    );
}
```

This exercises are very difficult. So don't be ashamed to look at the solutions if you are stuck and study them before going to the next one.

Here are some hints:

* __Borders__: Use the __min__ instead of the __max__.
* __Hexagon__: Try the difference between the __max__ and the __min__.
* __Stripes__: Use __discard__, __mix__ and __cos__.
* __Blocks__: Use __gl_FragCoord__.

<Ex />