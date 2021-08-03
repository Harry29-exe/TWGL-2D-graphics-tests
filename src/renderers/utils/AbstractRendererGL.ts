export abstract class AbstractRendererGL {
    private gl: WebGL2RenderingContext;

    private frameBuffers(inputTexture: Webgl): [WebGLFramebuffer, WebGLFramebuffer, WebGLTexture] {
        const gl = this.gl;

        const tex1 = createTexture(gl, {src: null, width: texture.width, height: texture.height});
        const tex2 = texture.textureGL;
        gl.bindTexture(gl.TEXTURE_2D, tex2);
        const fb2 = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);
        // const fb1 = gl.createFramebuffer();
        const fb1 = createFramebufferInfo(gl,)
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex1, 0);




        return [];
    }
}