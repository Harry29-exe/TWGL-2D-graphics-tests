import {createTexture} from "twgl.js";
import {SinglePixelPrograms, SinglePixelFiltersRendererGL} from "./renderers/single-pixel-renderer/SinglePixelFiltersRendererGL";
import {TextureInfoGL} from "./gl-programs/TextureInfoGL";
import { Kernel3x3RendererGL, KernelProgramGL } from "./renderers/kernel3x3-renderer/Kernel3x3RendererGL";

export function init() {
    document.body.innerHTML = `
        <canvas id="canvas" height="4446px" width="6241px" style="width: 621px; height: 444px"></canvas>`;
    let width = 6241;
    let height = 4446;
    let gl = (document.getElementById('canvas') as HTMLCanvasElement).getContext('webgl2');

    if(!gl) {
        throw new Error('No webgl2');
    }

    let tex0 = createTexture(gl, {target: gl.TEXTURE_2D, src: 'tex1.jpg'});
    let renderer = new SinglePixelFiltersRendererGL(gl);
    let kernelRenderer = new Kernel3x3RendererGL(gl);

    gl.flush();
    function draw(tex: WebGLTexture) {
        console.log('rendering');
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let time = performance.now();
        let texWrapper = new TextureInfoGL(tex, width, height);
        
        // renderer.setColorAttribs(0.2);
        // let out = renderer.render([SinglePixelPrograms.COLOR_TEMPERATURE], new TextureInfoGL(tex0, width, height));
        // let out = kernelRenderer.render([KernelProgramGL.SHARPEN], texWrapper);
        
        renderer.setContrastsAttribs(64);
        let out = renderer.render([
            SinglePixelPrograms.CONTRAST
        ], texWrapper);
        

        renderer.drawResultToCanvas(out);
        gl.deleteTexture(out.textureGL);
        console.log(`Time to draw ${performance.now() - time}ms`);
        
    }

    setTimeout(() => {
        draw(tex0);
    }, 2000);

}