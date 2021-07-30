import {BasicProgramGL} from "../basic-programs/BasicProgramGL";

const fragmentShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;

out vec4 outColor;

void main() {
    outColor = texture(sampler, fragUV);
}`;

export class RenderToCanvasGL {
    public input: WebGLTexture;
    public output: WebGLFramebuffer;
    public brightnessDiff: number;


    constructor(input: WebGLTexture, output: WebGLFramebuffer, brightnessDiff: number) {
        this.input = input;
        this.output = output;
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