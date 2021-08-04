import { createTexture } from "twgl.js";

export function init() {
    document.body.innerHTML = `
        <canvas id="canvas" height="4446px" width="6241px" style="width: 621px; height: 444px"></canvas>
        <img id="image" src="tex1.jpg" style="display: none;"/>
        `;
    let width = 6241;
    let height = 4446;
    let gl = (document.getElementById('canvas') as HTMLCanvasElement).getContext('webgl2');

    let times: number[] = [];
    let i = 0;
    const textTexture = (imgData: ImageData) => {
        console.log('loading');
        
        let time = performance.now();
        let tex0: WebGLTexture = createTexture(gl, {target: gl.TEXTURE_2D, src: imgData.data, width: imgData.width, height: imgData.height}, () => {
            console.log('done');
            
           
        });
        gl.deleteTexture(tex0);
        gl.flush();
        times.push(performance.now() - time);
        if(++i < 100) {
            textTexture(imgData);
        } else {
            let sum = 0;
            times.forEach(t => sum += t);
            console.log(sum / 100);
        }
    }

    // textTexture();
    let imgData: ImageData;
    setTimeout(() => {
        let img = document.getElementById("image") as HTMLImageElement;
        var canvas = document.createElement('canvas') as HTMLCanvasElement;
        var context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0 );
        imgData = context.getImageData(0, 0, img.width, img.height);

        textTexture(imgData);
    }, 1000);

    
    
    
}