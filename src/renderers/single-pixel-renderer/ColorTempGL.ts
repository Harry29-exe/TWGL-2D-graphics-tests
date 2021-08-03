import { setUniforms } from "twgl.js";
import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { glsl } from "../../gl-programs/ProgramGL";



const fragmentShaderSrc = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float colorTempDiff;

out vec4 outColor;

void main() {
    outColor = texture(sampler, fragUV);
    outColor.r += colorTempDiff;
    outColor.b -= colorTempDiff;
}
`;

export class ColorTempAttribsGL {
    colorTempDiff: number;

    constructor(colorTempDiff: number) {
        this.colorTempDiff = colorTempDiff;
    }
}

export class ColorTempGL extends BasicProgramGL<ColorTempAttribsGL> {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSrc);
    }

    setAttributes(attributes: ColorTempAttribsGL): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }


    
}