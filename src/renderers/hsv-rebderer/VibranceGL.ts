import { setUniforms } from "twgl.js";
import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { glsl } from "../../gl-programs/ProgramGL";
import { AbstractRendererGL } from "../utils/AbstractRendererGL";
import { conversions } from "../utils/HSV_RGB_Conversions";

const fragmentShaderSource = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;


// #define  Pr  .299
// #define  Pg  .587
// #define  Pb  .114
#define  Pr  .2125
#define  Pg  .7154
#define  Pb  .0721
uniform sampler2D sampler;
uniform float vibrance;

out vec4 outColor;
` + conversions + glsl`

void main() {
    vec4 tex = texture(sampler, fragUV);
    vec3 color = convertToHSV(vec3(tex.r, tex.g, tex.b));

    float p = sqrt(
        tex.r*tex.r*Pr + 
        tex.g*tex.g*Pg + 
        tex.b*tex.b*Pb
        );
    float weightedVibrance = 
        vibrance > 1.0?
        pow(2.711, -0.5 * pow(color[1] * 3.214, 2.0))*(vibrance-1.0) + 1.0:
        vibrance > 0.0? 
        pow(1.0/vibrance, -0.5 * pow(color[1] * 3.214, 2.0)):
        0.0;
    
    outColor = vec4(
        p + (tex.r-p)*weightedVibrance,
        p + (tex.g-p)*weightedVibrance,
        p + (tex.b-p)*weightedVibrance,
        tex.a
        );
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
        if(attributes.vibrance < 1.0) {
            attributes.vibrance = 
                attributes.vibrance > 0.5?
                Math.sqrt(attributes.vibrance):
                Math.pow(attributes.vibrance, 1 - attributes.vibrance);
        }
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }
    
}