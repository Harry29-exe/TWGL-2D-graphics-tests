import {createTexture} from "twgl.js";
import {SinglePixelPrograms, SinglePixelFiltersRendererGL} from "./renderers/single-pixel-renderer/SinglePixelFiltersRendererGL";
import {TextureInfoGL} from "./gl-programs/TextureInfoGL";

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

    setTimeout(() => {
        console.log('rendering');
        renderer.setColorAttribs(0.2);
        let out = renderer.render([SinglePixelPrograms.COLOR_TEMPERATURE], new TextureInfoGL(tex0, width, height));
        renderer.drawResultToCanvas(out);

    }, 2000);

    

}