import {basicVertexShaderSrc, ProgramGL} from "../ProgramGL";
import {
    BufferInfo,
    createBufferInfoFromArrays,
    createProgramInfo,
    drawBufferInfo,
    setBuffersAndAttributes, setUniforms
} from "twgl.js";
import {indexes, uv, vertices} from "../default-buffers/Scenne2D";
import {BasicProgramGL} from "../basic-programs/BasicProgramGL";

const fragmentShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float contrast;

out vec4 outColor;

void main() {
    float f = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    vec4 tex = texture(sampler, fragUV);
    float alfa = tex.w;
    tex = tex * f;
    outColor = vec4(tex.x > 1.0? 1.0: tex.x, tex.y > 1.0? 1.0: tex.y, tex.z > 1.0? 1.0: tex.z, alfa);
}`;

export class ContrastArgsGL {
    contrast: number;

    constructor(contrast: number) {
        this.contrast = contrast;
    }
}

export class ContrastGL extends  BasicProgramGL<ContrastArgsGL>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSrc);
    }

    compile(): void {
        this.programInfo = createProgramInfo(this.gl, [basicVertexShaderSrc, fragmentShaderSrc]);
    }


    setAttributes(attributes: ContrastArgsGL): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }

}