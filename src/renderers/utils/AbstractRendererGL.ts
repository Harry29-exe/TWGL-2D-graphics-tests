import { createFramebufferInfo, createTexture } from "twgl.js";
import { TextureInfoGL } from "../../gl-programs/TextureInfoGL";

export abstract class AbstractRendererGL {
    protected gl: WebGL2RenderingContext;
    protected tex1: WebGLTexture;
    protected tex2: WebGLTexture;
    protected fb1: WebGLTexture;
    protected fb2: WebGLTexture;
    protected lastFrameBuffer: number = 0;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    protected bindFrameBuffersAndTextures() {

        if(this.lastFrameBuffer === 0) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex2);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb1);
            this.lastFrameBuffer = 1;
            return;
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex1);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb2);
        this.lastFrameBuffer = 0;
    }

    protected initFrameBuffers(inputTexture: TextureInfoGL): void {
        const gl = this.gl;

        this.tex1 = createTexture(gl, {src: null, width: inputTexture.width, height: inputTexture.height});
        this.tex2 = inputTexture.textureGL;
        gl.bindTexture(gl.TEXTURE_2D, this.tex2);
        this.fb2 = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb2);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex2, 0);
        // const fb1 = gl.createFramebuffer();
        this.fb1 = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb1);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex1, 0);

        this.lastFrameBuffer = 0;
    }

    protected cleanAndReturnTexture(): WebGLTexture {
        let gl = this.gl;
        // gl.deleteTexture(this.lastFrameBuffer === 0? this.tex1: this.tex2);
        if(this.lastFrameBuffer === 0) {
            gl.deleteTexture(this.tex1);
        }
        gl.deleteFramebuffer(this.fb1);
        gl.deleteFramebuffer(this.fb2);

        return this.lastFrameBuffer === 0? this.tex2: this.tex1;
    }
}