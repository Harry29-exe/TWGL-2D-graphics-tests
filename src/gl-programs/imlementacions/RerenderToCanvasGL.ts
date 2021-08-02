import {BasicProgramGL} from "../basic-programs/BasicProgramGL";

const fragmentShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;

out vec4 outColor;

void main() {
    vec2 convertUV = vec2(fragUV.x, (fragUV.y * -1.0) + 1.0);
    outColor = texture(sampler, convertUV);
}`;

export class RenderToCanvasGL extends BasicProgramGL<void | null | undefined>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSrc);
    }

    setAttributes(attributes: void | null | undefined): void {
    }

}