import {WebGLRenderer} from "./WebGLRenderer";
import {BasicProgramGL} from "../gl-programs/basic-programs/BasicProgramGL";
import {ContrastArgsGL, ContrastGL} from "../gl-programs/imlementacions/ContrastGL";
import {BufferInfo, createBufferInfoFromArrays, createFramebufferInfo, createProgramInfo, createTexture} from "twgl.js";
import {indexes, uv, vertices} from "../gl-programs/default-buffers/Scenne2D";
import {BrightnessGL} from "../gl-programs/imlementacions/BrightnessGL";
import {TextureInfoGL} from "../gl-programs/TextureInfoGL";
import {RenderToCanvasGL} from "../gl-programs/imlementacions/RerenderToCanvasGL";

export enum BasicPrograms {
    CONTRAST,
    BRIGHTNESS,
    TO_CANVAS
}

export class BasicRendererGL {
    private programs: Map<BasicPrograms, BasicProgramGL<any>> = new Map<BasicPrograms, BasicProgramGL<any>>();
    private gl: WebGL2RenderingContext;
    private defaultBuffer: BufferInfo;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        let defaultBuffer = createBufferInfoFromArrays(gl,
            {
                vertPos: {numComponents: 2, data: vertices},
                texCoords: {numComponents: 2, data: uv},
                indices: {numComponents: 3, data: indexes}}
        );
        this.defaultBuffer = defaultBuffer;

        let programs = this.programs;
        let p: BasicProgramGL<any>;

        p = new BrightnessGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(BasicPrograms.BRIGHTNESS, p);

        p = new ContrastGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(BasicPrograms.CONTRAST, p);

        p = new RenderToCanvasGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(BasicPrograms.TO_CANVAS, p);
    }

    render(programsToUse: BasicPrograms[], texture: TextureInfoGL): TextureInfoGL {
        let gl = this.gl;

        let tex1 = createTexture(gl, {src: null, width: texture.width, height: texture.height});
        let tex2 = texture.textureGL;
        gl.bindTexture(gl.TEXTURE_2D, tex2);
        let fb2 = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);
        let fb1 = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex1, 0);

        let lastFrameBuffer = 0;
        let currentProgram: BasicProgramGL<any>;
        // debugger;
        for(let i = 0; i < programsToUse.length; i++) {
            lastFrameBuffer = this.bindFrameBuffersAndTextures(fb1, fb2, tex1, tex2, lastFrameBuffer);
            currentProgram = this.programs.get(programsToUse[i]);
            currentProgram.render();
        }

        return lastFrameBuffer === 0?
            new TextureInfoGL(tex2, texture.width, texture.height)
            :
            new TextureInfoGL(tex1, texture.width, texture.height);
    }

    drawResultToCanvas(textureBuffer: TextureInfoGL): void {
        let gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, textureBuffer.textureGL);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        let p: BasicProgramGL<any> = this.programs.get(BasicPrograms.TO_CANVAS) as BasicProgramGL<any>;
        p.render();
    }


    setContrastsAttribs(contrast: number) {
        let p = this.programs.get(BasicPrograms.CONTRAST) as BasicProgramGL<any>;
        p.setAttributes(new ContrastArgsGL(contrast));
    }

    setBrightnessAttribs(brightness: number) {
        let p = this.programs.get(BasicPrograms.BRIGHTNESS) as BasicProgramGL<any>;
        p.setAttributes(brightness);
    }

    private bindFrameBuffersAndTextures(
        fb1: WebGLFramebuffer, fb2: WebGLFramebuffer,
        tex1: WebGLTexture, tex2: WebGLTexture,
        lastFrameBuffer: number): number {

        if(lastFrameBuffer === 0) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, tex2);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb1);
            return 1;
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, tex1);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb2);
        return 0;
    }

    private setUpContrastProgram(): void {
        let program = new ContrastGL(this.gl);
        program.createBasicBuffers();
    }

}