import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { TextureInfoGL } from "../../gl-programs/TextureInfoGL";
import { AbstractRendererGL } from "../utils/AbstractRendererGL";
import { mat3 } from "../utils/Types";
import { Matrix3x3AttribsGL, Matrix3x3GL } from "./Matrix3x3GL";


export enum KernelProgramGL {
    IDENTITY,
    EDGE_DETECTION1,
    EDGE_DETECTION2,
    EDGE_DETECTION3,
    SHARPEN,
    BOX_BLUR
}

const Kernels = new Map<KernelProgramGL, {matrix: mat3, divider: number}>([
    [KernelProgramGL.IDENTITY, {matrix: [ 0, 0, 0,   0, 1, 0,   0, 0, 0], divider: 1}],
    [KernelProgramGL.EDGE_DETECTION2, {matrix: [ 0, -1, 0,   -1, 4,-1,   0,-1, 0], divider: 1}],
    [KernelProgramGL.SHARPEN, {matrix: [ 0, -1, 0,   -1, 4,-1,   0,-1, 0], divider: 1}],

])

export class Kernel3x3RendererGL extends AbstractRendererGL {
    private kernelProgram: Matrix3x3GL;
    
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.kernelProgram = new Matrix3x3GL(gl);
        this.kernelProgram.createBasicBuffers();
    }

    public render(programs: KernelProgramGL[], texture: TextureInfoGL): TextureInfoGL {
        let gl = this.gl;
        let kernelProgram = this.kernelProgram;
    
        this.initFrameBuffers(texture);

        for(let i = 0; i < programs.length; i++) {
            this.bindFrameBuffersAndTextures();
            let kernel = Kernels.get(programs[i]);
            kernelProgram.setAttributes(new Matrix3x3AttribsGL(kernel.matrix, kernel.divider, texture.width, texture.height));
            
            kernelProgram.render();
        }
        

        return new TextureInfoGL(this.cleanAndReturnTexture(), texture.width, texture.height);
    }
}