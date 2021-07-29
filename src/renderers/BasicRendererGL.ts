import {WebGLRenderer} from "./WebGLRenderer";
import {BasicProgramGL} from "../gl-programs/basic-programs/BasicProgramGL";

export class BasicRendererGL extends WebGLRenderer<BasicProgramGL<any>> {
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
    }

    addProgram(program: BasicProgramGL<any>): void {

    }

    render(programIndex: number): void {
    }

    renderAll(): void {
    }

    drawResultToCanvas(): void {
    }



}