import {
    createFramebufferInfo,
    createTexture,
} from "twgl.js";
import {BrightnessGL} from "./renderers/single-pixel-renderer/BrightnessGL";
import { ContrastGL } from "./renderers/single-pixel-renderer/ContrastGL";


export async function init() {
    document.body.innerHTML = `
        <canvas id="canvas" height="4446px" width="6241px" style="width: 621px; height: 444px"></canvas>`;
    let width = 6241;
    let height = 4446;
    let gl = (document.getElementById('canvas') as HTMLCanvasElement).getContext('webgl2');

    if(!gl) {
        throw new Error('No webgl2');
    }

    let brightness = new ContrastGL(gl);
    brightness.createBasicBuffers();
    brightness.setAttributes({contrast: 25});

    let tex0 = createTexture(gl, {target: gl.TEXTURE_2D, src: 'tex1.jpg'});
    let tex1 = createAndSetupTexture(gl);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
    let tex2 = createAndSetupTexture(gl);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
    let fb1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex1, 0);
    let fb2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);


    function render(tex: WebGLTexture, fb: WebGLFramebuffer) {
        setFramebuffer(fb, 6241, 4446);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.clearColor(0.2, 0.8, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        brightness.render();
        console.log('render');
    }

    setTimeout(() => render(tex0, fb1), 1000);
    setTimeout(() => render(tex1, fb2), 2000);
    setTimeout(() => render(tex2, null), 3000);


    function setFramebuffer(fbo: WebGLFramebuffer, width: number, height: number) {
        // make this the framebuffer we are rendering to.
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, width, height);
    }
}

function createAndSetupTexture(gl: WebGL2RenderingContext) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}



