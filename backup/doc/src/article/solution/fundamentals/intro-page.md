# Solution: Drawing three triangles

There are only two blocks of code to change.

The first one is to define the attributes values:

```js
// Storing attributes data in GPU memory.
const data = new Float32Array([
    0, 10,
    5, -9,
    0, -5,
    0, 10,
    -5, -9,
    0, -5,
    0, 8,
    -5, 3,
    5, 3,
])
```

And tell WebGL to take `9` attributes (= 3 triangles of 3 vertices each):

```js
// Drawing the triangle.
gl.drawArrays(gl.TRIANGLES, 0, 9)
```

And here is the full code:

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
    0, 10,
    5, -9,
    0, -5,
    0, 10,
    -5, -9,
    0, -5,
    0, 8,
    -5, 3,
    5, 3,
])
const buff = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buff)
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
// Defining the structure of memory for attribute.
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0)
// Drawing the triangle.
gl.drawArrays(gl.TRIANGLES, 0, 9)
```

----

[Back to the lesson](#lesson/fundamentals)