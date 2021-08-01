import {ProgramGL} from "../ProgramGL";
import {
    BufferInfo,
    createBufferInfoFromArrays,
    createProgramInfo,
    drawBufferInfo,
    setBuffersAndAttributes
} from "twgl.js";
import {indexes, uv, vertices} from "../default-buffers/Scenne2D";
import {BasicProgramGL} from "../basic-programs/BasicProgramGL";

const fragmentShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;

out vec4 outColor;

void main() {
    vec4 color = texture(sampler, fragUV);
    outColor = vec4(color.x + 0.1, color.y + 0.1, color.z + 0.1, color.w);
}`;

export class BrightnessArgs {
    public brightnessDiff: number;


    constructor(brightnessDiff: number) {
        this.brightnessDiff = brightnessDiff;
    }
}

export class BrightnessGL extends BasicProgramGL<any>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSrc);
    }

    setAttributes(attributes: any): void {
    }

}