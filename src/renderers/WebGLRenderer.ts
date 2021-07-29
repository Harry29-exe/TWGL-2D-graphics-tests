import {ProgramGL} from "../gl-programs/ProgramGL";

export abstract class WebGLRenderer<PROGRAM_TYPE extends ProgramGL<any>> {
    protected gl: WebGL2RenderingContext;
    protected programs: ProgramGL<any>[] = [];
    protected renderingToCanvas: boolean = false;

    protected constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    abstract addProgram(program: PROGRAM_TYPE): void;

    abstract renderAll(): void;

    abstract render(programIndex: number): void;

    abstract drawResultToCanvas(): void;
}