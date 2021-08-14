import { setUniforms } from "twgl.js";
import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { glsl, ProgramGL } from "../../gl-programs/ProgramGL";

const fragmentShader = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float gamma;

out vec4 outColor;

void main() {
    vec4 tex = texture(sampler, fragUV);

    outColor = vec4(
        pow(tex.r, 1.0/gamma),
        pow(tex.g, 1.0/gamma),
        pow(tex.b, 1.0/gamma),
        tex.a
    );
}
`


export class GammaAttribsGL {
    gamma: number;

    constructor(gamma: number) {
        this.gamma = gamma;
    }
}

export class GammaGL extends BasicProgramGL<GammaAttribsGL> {


    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShader);
    }

    setAttributes(attributes: GammaAttribsGL): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }




}