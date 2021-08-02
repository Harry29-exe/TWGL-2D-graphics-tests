import {BasicProgramGL} from "../basic-programs/BasicProgramGL";
import {setUniforms} from "twgl.js";
import { glsl } from "../ProgramGL";

const fragmentShaderSrc = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;
uniform float brightness;

out vec4 outColor;

void main() {
    vec4 color = texture(sampler, fragUV);
    outColor = vec4(color.x + brightness, color.y + brightness, color.z + brightness, color.w);
}`;



export class BrightnessArgs {
    public brightnessDiff: number;


    constructor(brightnessDiff: number) {
        this.brightnessDiff = brightnessDiff;
    }
}

export class BrightnessGL extends BasicProgramGL<BrightnessArgs>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSrc);
    }

    setAttributes(attributes: BrightnessArgs): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }

}