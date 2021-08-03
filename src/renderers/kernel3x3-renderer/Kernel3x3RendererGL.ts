import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { Matrix3x3GL } from "./Matrix3x3GL";

export enum KernelProgramGL {
    IDENTITY,
    SHARPEN
}

export class Kernel3x3RendererGL {
    private gl: WebGL2RenderingContext;
    private kernelProgram: BasicProgramGL<any>;
    
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.kernelProgram = new Matrix3x3GL(gl);
        this.kernelProgram.createBasicBuffers();
    }

    public render(programs: KernelProgramGL[], texture: WebGLTexture) {
        let gl = this.gl;
        
    }
}