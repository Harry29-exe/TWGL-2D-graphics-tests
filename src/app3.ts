import {createFramebufferInfo, createTexture, drawBufferInfo} from "twgl.js";
import {SinglePixelPrograms, SinglePixelFiltersRendererGL} from "./renderers/single-pixel-renderer/SinglePixelFiltersRendererGL";
import {TextureInfoGL} from "./gl-programs/TextureInfoGL";
import { Kernel3x3RendererGL, KernelProgramGL } from "./renderers/kernel3x3-renderer/Kernel3x3RendererGL";

export function init() {
    let width = 6241 * 0.2;
    let height = 4446 * 0.2;
    document.body.innerHTML = `
        <canvas id="canvas" height="${height}px" width="${width}px" ></canvas>`;
    
    let gl = (document.getElementById('canvas') as HTMLCanvasElement).getContext('webgl2');

    if(!gl) {
        throw new Error('No webgl2');
    }

    let tex0 = createTexture(gl, {target: gl.TEXTURE_2D, src: 'tex1.jpg',width: width, height: height});
    let renderer = new SinglePixelFiltersRendererGL(gl);

    gl.flush();

    function draw(tex: WebGLTexture, vibrance: number): void {
        
       
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, tex);
        let t0 = performance.now();

        renderer.setVibranceAttribs(vibrance);
        let out = renderer.render([SinglePixelPrograms.VIBRANCE], new TextureInfoGL(tex, width, height));
        // gl.deleteTexture(out.textureGL);
        console.log((performance.now() - t0) / 1000);

        renderer.drawResultToCanvas(out);
    
    }

    setTimeout(() => {
        console.log('start');
        draw(tex0, 1);
    }, 2_000);
    

    let input = document.createElement('input') as HTMLInputElement;
    input.type = 'range';
    input.value = '1.0';
    input.max = '2';
    input.min = '0';
    input.step = '0.01';
    // input.style.height = '500px';
    input.oninput = (event: any) => {
        let val = Number.parseFloat(event.target.value);
        console.log(val);
        
        draw(tex0, val);
    }
    document.body.appendChild(input);
}