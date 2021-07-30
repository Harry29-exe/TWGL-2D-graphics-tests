import {ProgramGL} from "../gl-programs/ProgramGL";

export abstract class WebGLRenderer<PROGRAM_TYPE extends ProgramGL<any>, PROGRAM_LIST> {
    protected gl: WebGL2RenderingContext;
    protected programs: Map<PROGRAM_LIST, PROGRAM_TYPE> = new Map<PROGRAM_LIST, PROGRAM_TYPE>();
    protected renderingToCanvas: boolean = false;

    protected constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    abstract addProgram(program: PROGRAM_TYPE): void;

    abstract renderAll(): void;

    abstract render(programIndexes: PROGRAM_LIST[]): ImageData;

    abstract renderToFrameBuffer(programIndexes: PROGRAM_LIST[]): ImageData;

    abstract drawResultToCanvas(): void;
}