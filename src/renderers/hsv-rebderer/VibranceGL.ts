import { setUniforms } from "twgl.js";
import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { glsl } from "../../gl-programs/ProgramGL";
import { AbstractRendererGL } from "../utils/AbstractRendererGL";
import { conversions } from "../utils/HSV_RGB_Conversions";

const fragmentShaderSource = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float vibrance;

out vec4 outColor;
` + conversions + glsl`

void main() {
    vec4 tex = texture(sampler, fragUV);
    vec3 color = convertToHSV(vec3(tex.r, tex.g, tex.b));
 
    // if(vibrance <= 1.0) {
    //     color[1] *= pow(vibrance, color[1] * color[1]); 
    // } else {
    //     color[1] *= pow(vibrance, (1.0 - color[1]) * (1.0 - color[1]) * 0.5 );
    // }
    if(color[1] < 0.05) {

    } else if(vibrance <= 1.0) {
        color[1] = (
            pow(2.711, -0.5 * pow(color[1] * 3.214, 2.0)) * (vibrance) * color[1]
            + color[1]
            ) / 2.0;
    } else {
        // normal distribution
        // 0.55 * (0.22 * (2*pi)^(1/2)) * e ^ we
        float weight = pow(2.711, -0.5 * pow(color[1] * 3.214, 2.0));

        color[1] *= (1.0 + (vibrance - 1.0) * weight);
    }
    
    outColor = vec4(convertToRGB(color), tex.a);
}

`;

export class VibranceAttribsGL {
    public vibrance: number;

    constructor(vibrance: number) {
        this.vibrance = vibrance;
    }
}

export class VibranceGL extends BasicProgramGL<VibranceAttribsGL> {

    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShaderSource);
    }

    setAttributes(attributes: VibranceAttribsGL): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }
    
}