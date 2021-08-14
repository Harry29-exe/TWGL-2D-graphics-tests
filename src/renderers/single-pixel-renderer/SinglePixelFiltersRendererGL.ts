import {WebGLRenderer} from "../WebGLRenderer";
import {BasicProgramGL} from "../../gl-programs/BasicProgramGL";
import {BufferInfo, createBufferInfoFromArrays, createFramebufferInfo, createProgramInfo, createTexture} from "twgl.js";
import {indexes, uv, vertices} from "../../gl-programs/Scenne2D";
import {BrightnessArgs, BrightnessGL} from "./BrightnessGL";
import {TextureInfoGL} from "../../gl-programs/TextureInfoGL";
import {RenderToCanvasGL} from "../../gl-programs/RerenderToCanvasGL";
import { Matrix3x3AttribsGL, Matrix3x3GL } from "../kernel3x3-renderer/Matrix3x3GL";
import { ColorTempAttribsGL, ColorTempGL } from "./ColorTempGL";
import { ContrastArgsGL, ContrastGL } from "./ContrastGL";
import { AbstractRendererGL } from "../utils/AbstractRendererGL";
import { GammaAttribsGL, GammaGL } from "./GammaGL";
import { VibranceAttribsGL, VibranceGL } from "../hsv-rebderer/VibranceGL";

export enum SinglePixelPrograms {
    CONTRAST,
    BRIGHTNESS,
    COLOR_TEMPERATURE,
    GAMMA,

    TO_CANVAS,


    CONVERT_TO_HSV,
    SATURATION,
    VIBRANCE,
    
    HISTOGRAM
}

export class SinglePixelFiltersRendererGL extends AbstractRendererGL {
    private programs: Map<SinglePixelPrograms, BasicProgramGL<any>> = new Map<SinglePixelPrograms, BasicProgramGL<any>>();
    private defaultBuffer: BufferInfo;

    constructor(gl: WebGL2RenderingContext) {
        super(gl);

        this.defaultBuffer = createBufferInfoFromArrays(gl,
            {
                vertPos: {numComponents: 2, data: vertices},
                texCoords: {numComponents: 2, data: uv},
                indices: {numComponents: 3, data: indexes}}
        );
        this.init();
    }

    render(programsToUse: SinglePixelPrograms[], texture: TextureInfoGL): TextureInfoGL {
        const gl = this.gl;
        this.initFrameBuffers(texture);

        let lastFrameBuffer = 0;
        let currentProgram: BasicProgramGL<any>;
        for(let i = 0; i < programsToUse.length; i++) {
            this.bindFrameBuffersAndTextures();
            currentProgram = this.programs.get(programsToUse[i]);
            currentProgram.render();
            
        }

        
        return new TextureInfoGL(this.cleanAndReturnTexture(), texture.width, texture.height);
    }

    drawResultToCanvas(textureBuffer: TextureInfoGL): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, textureBuffer.textureGL);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        const p = this.programs.get(SinglePixelPrograms.TO_CANVAS) as RenderToCanvasGL;
        p.render();
    }


    setContrastsAttribs(contrast: number) {
        const p = this.programs.get(SinglePixelPrograms.CONTRAST) as BasicProgramGL<any>;
        p.setAttributes(new ContrastArgsGL(contrast));
    }

    setBrightnessAttribs(brightness: number) {
        const p = this.programs.get(SinglePixelPrograms.BRIGHTNESS) as BasicProgramGL<any>;
        p.setAttributes(new BrightnessArgs(brightness));
    }

    setColorAttribs(colorDiff: number) {
        if(colorDiff > 1 || colorDiff < -1) {
            console.warn('Color tempreature difference should be beteewn -1 and 1');
        };
        const p = this.programs.get(SinglePixelPrograms.COLOR_TEMPERATURE) as ColorTempGL;
        p.setAttributes(new ColorTempAttribsGL(colorDiff));
    }

    setGammaAttribs(gamma: number) {
        const p = this.programs.get(SinglePixelPrograms.GAMMA) as GammaGL;
        p.setAttributes(new GammaAttribsGL(gamma));
    }

    setVibranceAttribs(vibrance: number) {
        const p = this.programs.get(SinglePixelPrograms.VIBRANCE) as VibranceGL;
        p.setAttributes(new VibranceAttribsGL(vibrance));
    }


    private init() {
        const gl = this.gl;
        const defaultBuffer = this.defaultBuffer;

        const programs = this.programs;
        let p: BasicProgramGL<any>;

        p = new BrightnessGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(SinglePixelPrograms.BRIGHTNESS, p);

        p = new ContrastGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(SinglePixelPrograms.CONTRAST, p);

        p = new ColorTempGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(SinglePixelPrograms.COLOR_TEMPERATURE, p);

        p = new RenderToCanvasGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(SinglePixelPrograms.TO_CANVAS, p);

        p = new VibranceGL(gl);
        p.useBasicBuffers(defaultBuffer);
        programs.set(SinglePixelPrograms.VIBRANCE, p);
    }
}