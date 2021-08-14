import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";

export class SaturationAttribsGL {
    saturation: number;

    constructor(saturation: number) {
        this.saturation = saturation;
    }
}

export class SaturationGL extends BasicProgramGL<SaturationAttribsGL> {

    
    setAttributes(attributes: SaturationAttribsGL): void {
        throw new Error("Method not implemented.");
    }

    

}