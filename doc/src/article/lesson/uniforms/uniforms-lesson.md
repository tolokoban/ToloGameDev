# What are uniforms

Let's remember our [orange triangle](#lesson/fundamentals).
What if we are allergic to orange and want it to be pink instead?

One easy solution would be to change the fragment shader like this:
```glsl
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.6, 0.7, 1.0);
}
```

But now, we want the triangle to blink.
That means that we need to change the color according to the current time.
Since the shader code is passed as a string,
we still can modify it for every frame.
But in this case, the fragment shader will need to be compiled
and the whole program linked for every displayed frame.

This is expensive and our animation will lag.

__Uniforms__ are variables you can pass to your shaders without recompiling them. So we can write our fragment shader like this:

```glsl
precision mediump float;

uniform vec3 uniColor;

void main() {
    gl_FragColor = vec4(uniColor, 1.0);
}
```

# How to set the value of an uniform?

```js
// Creating data for a vec3 representing
// RGB components for pink.
const PINK = new Float32Array([1.0, 0.6, 0.7])
// We need to know where this uniform has been
// reserved in the GPU memory.
const uniColor = gl.getUniformLocation(prg, "uniColor")
// Storing data in the GPU memory.
gl.uniform3fv(uniColor, PINK)
```

`uniform3fv` is part of a family of functions all having a name starting
with `uniform`, followed by a digit (`1`, `2`, `3` or `4`),
then the type ("`f`" for float or "`i`" for integer) and an optional "`v`"
(meaning that we pass an array as argument).

The next two commands do the same thing:

``` js
gl.uniform3fv(
    uniColor, 
    new Float32Array([1.0, 0.6, 0.7])
)
```

``` js
gl.uniform3f(uniColor, [1.0, 0.6, 0.7])
```

# Using it in an animation

Animation is done by painting the canvas several times per second.
The best being to paint it __60 times per second__.

But if you just try to loop forever (like in the following example),
you will just freeze your browser.

``` js
while (true) {
    render(Date.now())
}
```

Javascript has a special way to achieve this:
``` js
function render(time) {
    window.requestAnimationFrame(render)
    ...
}

window.requestAnimationFrame(render)
```

`requestAnimationFrame` tells the Browser which function to call when it's
the best time for rendering.
The function called will get the current time (in milliseconds)
as sole argument.

[Check the code](example/uniforms.html) of the pulsating triangle!

# Exercise

<Exercise />

> Try to reproduce this animation of dancing triangles.  
> The attributes must be set only once.  
> Remember that uniforms can be used in both shaders.  
>  
> Hint: It's feasible with only one uniform.  
> Hint: Use a `vec4` as `uniPoint` attribute.
> It will give you 4 numbers for each vertex.

