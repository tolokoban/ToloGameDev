# Coordinates System

<Coords/>

In this lesson, we will paint an orange triangle on the screen.
But to do that, we will need to learn few WebGL fundamentals.

The first one is the __coordinates system__.

Every pixel on the canvas can be adressed by two numbers: `(x, y)`.
They are __real numbers__ lying between `-1` and `+1`, regardless of
the aspect ratio of your canvas.  

That means that even if your canvas is rectangular, the top left pixel's
coordinates is always `(-1, +1)`.

# Rendering Pipeline

WebGL is mainly a __2D triangles painter__.
Every scene you will render, will be made of triangles.
That's why we really need to spend some time learning how to paint a triangle.

Here is the code to draw a triangle in WebGL:

```js
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

This function expects three arguments: the mode, the index of the first vertex and the number of vertices.

<Pipeline/>

This code just says:

> Paint as many __triangles__ as you can with `3` vertices.

To achieve this, WebGL must:

1. Read from memory the __attributes__ of each vertex.
2. Compute the __coordinates__ of each vertex using those attributes (`gl_Position`).
3. Compute the __color__ of each pixel of the final triangle (`gl_FragColor`).

# Storing attributes in memory

With WebGL, you can store data into the graphic card memory.

We decide to attach a simple attribute to each vertex, named `attPoint`.
It is a float vector of dimension 2 storing the coordinates of the vertex.

| __Vertex #__   | 0  |  1 |  2 |
| -------------- | -- | -- | -- |
| __attPoint.x__ | -7 | -1 | +5 |
| __attPoint.y__ | -5 | +7 | -8 |

We will then use 6 __floats__ to store our attributes:

```js
const data = new Float32Array([
    -7, -5,
    -1, +7,
    +5, -8
])
```

Now, we need to push this data into the graphic card memory:

```js
const buff = gl.createBuffer()
if (!buff) throw "Unable to create data buffer!"

gl.bindBuffer(gl.ARRAY_BUFFER, buff)
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
```

# Computing coordinates from attributes

<Coords/>

The magic of graphic cards is in the parallelism.
There are sereval processor in a GPU (Graphical Processor Unit),
so the three vertices coordinates (positions) are computed in the same time by three processors using the same program called a __vertex shader__:

```glsl
// Declare attribute attPoint,
// which is a vector of 2 floats.
attribute vec2 attPoint;

// A shader code is always executed by calling
// its "main()" function.
void main() {
    // Vertex position is a 4 dimensional vector: (x,y,z,w).
    // We already know that x and y are between -1 and +1.
    // We will explain the role of z in another lesson,
    // and the role of w very soon.
    gl_Position = vec4(attPoint / 10.0, 0.0, 1.0);
}
```

The syntax ressemble the `C/C++` one with some specific types and built-in functions.
Execution always starts by calling function `main()` which must, at least,
set the value of the global variable `gl_Position`.

This language comes in handy when dealing with vectors and matrices.
Look at this convenient syntax:

```glsl
float x = attPoint.x;
float y = attPoint.y;
vec2 transposed = attPoint.yx;
vec2 strangeDoubleX = attPoint.xx;
```

You can divide (or multiply) a vector by a scalar, and you get all the
components divided (or multiplied) by this scalar.

| attPoint | attPoint / 10.0 | gl_Position            |
| -------- | --------------- | ---------------------- |
| (-7, -5) | (-0.7, -0.5)    | (-0.7, -0.5, 0.0, 1.0) |
| (-1, +7) | (-0.1, +0.7)    | (-0.1, +0.7, 0.0, 1.0) |
| (+5, -8) | (+0.5, -0.8)    | (+0.5, -0.8, 0.0, 1.0) |

# Computing the color of each pixel of the triangle

With 3 `gl_Position` values, WebGL can paint a triangle.
Each pixel inside that triangle is called a __fragment__ and it holds few properties.
On of them is the __color__ and it is represented by a `vec4` whose components are: red, green, blue and alpha.
Every component is a value between 0 and 1.

And to define the color of a fragment, WebGL uses another program: the __fragment shader__. Here is what we need to paint our triangle in orange:

```glsl
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
}
```

As you can see, `gl_FragColor` is the global variable that defines the color of the fragment. As usual, the graphic card will use many processors at the same time and each one will deal with a different fragment.

# Structuring the memory

We are almost done! The last important thing to do is to tell the graphic card how we have structured the attributes in memory. This will become even more important when we will use several attributes. But for now, I will just show you the code for our `attPoint` unique attribute.

```js
gl.enableVertexAttribArray(0)
// Basically, we are telling WebGL to use an attribute
// which is a vector of 2 floats.
gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0)
```

We will explain more in depth this part in another lesson.

# Wrap it up!

Here is the full code that displays an orange triangle over a blue background.
I strongly advise you to study it and try few tweaks on it.
Once you are familiar with it, please try to solve the exercice at the end of this page.

* Play with it on [CodePen](https://codepen.io/tolokoban/pen/QWKMZaQ)
* Or [download](example/intro.html) the code.

```js
// Get the only canvas of this page.
const canvas = document.querySelector("canvas")
// Create a WebGL context.
const gl = canvas.getContext("webgl")
// Clearing the screen.
gl.clearColor(0, 0.4, 0.867, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
// Create Program with two shaders: vertex and fragment.
const prg = gl.createProgram()
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const vertexCode = `
attribute vec2 attPoint;
void main() {
    gl_Position = vec4(attPoint / 10.0, 0.0, 1.0);
}`
gl.shaderSource(vertexShader, vertexCode)
gl.compileShader(vertexShader)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
const fragmentCode = `
// precision highp float;
precision mediump float;
// precision lowp float;

void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
}
`
gl.shaderSource(fragmentShader, fragmentCode)
gl.compileShader(fragmentShader)
gl.attachShader(prg, vertexShader)
gl.attachShader(prg, fragmentShader)
gl.linkProgram(prg)
gl.useProgram(prg)
// Storing attributes data in GPU memory.
const data = new Float32Array([
    -7, -5,
    -1, +7,
    +5, -8
])
const buff = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buff)
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
// Defining the structure of memory for attribute.
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0)
// Drawing the triangle.
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

# Exercise

<Exercise />

> Try to modifiy the code above to get the following shape.  
> Hint: It is made of 3 triangles.

You can see [a solution here](#solution/fundamentals).

By playing with the code you will notice that WebGL has no forgiveness.
If you do something wrong, you will just end up with an empty screen
but no error message to help you find out what's going on.

If you are stuck, you can refer to the [troubleshooting](#lesson/troubleshooting) lesson to learn how to debug WebGL.
