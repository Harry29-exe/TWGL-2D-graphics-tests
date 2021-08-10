import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { glsl, ProgramGL } from "../../gl-programs/ProgramGL";

const fragmentShader = glsl`
`;

export class HistogramArttribsGL {

}

export class HistogramProgramGL extends BasicProgramGL<any> {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShader);
    }

    setAttributes(attributes: any): void {
        throw new Error("Method not implemented.");
    }




}