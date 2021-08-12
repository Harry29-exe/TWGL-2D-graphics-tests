import { BufferInfo, createBufferInfoFromArrays } from "twgl.js";
import { indexes, uv, vertices } from "../../gl-programs/Scenne2D";
import { AbstractRendererGL } from "../utils/AbstractRendererGL";
import { HistogramArttribsGL, HistogramProgramGL } from "./HistogramProgramGL";

export class HistogramRendererGL extends AbstractRendererGL {
    private histogramProgram: HistogramProgramGL;
    private defaultBuffer: BufferInfo;

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.defaultBuffer = createBufferInfoFromArrays(gl,
            {
                vertPos: {numComponents: 2, data: vertices},
                texCoords: {numComponents: 2, data: uv},
                indices: {numComponents: 3, data: indexes}}
        );

        this.histogramProgram = new HistogramProgramGL(gl);
        this.histogramProgram.useBasicBuffers(this.defaultBuffer);
    }

    render(minimum: number, middle: number, maximum: number) {
        let gl = this.gl;
        let program = this.histogramProgram;

        program.setAttributes(new HistogramArttribsGL(minimum, middle, maximum));
        program.render();
    }

}