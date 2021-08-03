import { createAttribsFromArrays, setUniforms, setUniformsAndBindTextures } from "twgl.js";
import {BasicProgramGL} from "../../gl-programs/BasicProgramGL";
import { glsl } from "../../gl-programs/ProgramGL";
import { mat3 } from "../utils/Types";


const fragmentShaderSrc = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;
uniform mat3 kernel;
uniform float divider;
uniform float width;
uniform float height;

out vec4 outColor;

void main() {
    float alfa = texture(sampler, fragUV).w;
    vec4 temp;
    for (int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            temp += texture(sampler, vec2(fragUV.x + (-1.0 + float(i) / width ), fragUV.y + (-1.0 + float(j)) / height)) * kernel[i][j];
        }
    }
    outColor = temp / divider;
    outColor.w = alfa;
}
`

export class Matrix3x3AttribsGL {
    kernel: mat3 | ArrayBuffer;
    divider: number;
    width: number;
    height: number;

    constructor(kernel: mat3 | ArrayBuffer,
                divider: number,
                textureWidth: number, textureHeight: number) {
        this.kernel = kernel;
        this.width = textureWidth;
        this.height = textureHeight;
        this.divider = divider;
    }
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