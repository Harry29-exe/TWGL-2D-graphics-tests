import { createAttribsFromArrays, setUniforms, setUniformsAndBindTextures } from "twgl.js";
import {BasicProgramGL} from "../basic-programs/BasicProgramGL";
import { glsl } from "../ProgramGL";


const fragmentShaderSrc = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;
uniform mat3 kernel;
uniform float divider;

out vec4 outColor;

void main() {
    vec4 temp;
    for (int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            temp += texture(sampler, vec2(fragUV.x + (-1.0 + float(i)), fragUV.y + (-1.0 + float(j)))) * kernel[i][j];
        }
    }
    outColor = temp / divider;
}
`

export class Matrix3x3AttribsGL {
    kernel: [number, number, number, number, number, number, number, number, number] | ArrayBuffer;
}

export class Matrix3x3GL extends BasicProgramGL<Matrix3x3AttribsGL> {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSrc);
    }

    setAttributes(attributes: Matrix3x3AttribsGL): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }

}