import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { AbstractRendererGL } from "../utils/AbstractRendererGL";

export enum HsvPrograms {

}

export class HsvRenderer extends AbstractRendererGL {
    private programs: Map<HsvPrograms, BasicProgramGL<any>> = new Map<HsvPrograms, BasicProgramGL<any>>();

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
    }
    



}