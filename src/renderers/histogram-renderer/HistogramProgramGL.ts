import { setUniforms } from "twgl.js";
import { BasicProgramGL } from "../../gl-programs/BasicProgramGL";
import { glsl, ProgramGL } from "../../gl-programs/ProgramGL";

const conversons = glsl`
vec3 convertToHSV(vec3 color) {
    vec3 result;
    if(color.r > color.b && color.r > color.g) {
        float delta = color.r - min(color.g, color.b);
        float h = 
            delta <= 0.0? 0.0:
            mod( ((color.g - color.b) / delta), 6.0) * 60.0;
        result = vec3(
            h < 0.0? h + 360.0: h > 360.0? h - 360.0: h,
            delta / color.r,
            color.r
        );
    } else if(color.g > color.r && color.g > color.b) {
        float delta = color.g - min(color.r, color.b);
        float h = delta <= 0.0? 0.0:
                ((color.b - color.r) / delta + 2.0) * 60.0;
        result = vec3(
            h < 0.0? h + 360.0: h > 360.0? h - 360.0: h,
            delta / color.g,
            color.g
        );
    } else {
        float delta = color.b - min(color.r, color.g);
        float h = delta <= 0.0? 0.0:
                    ((color.r - color.g) / delta + 4.0) * 60.0;
        result = vec3(
            h < 0.0? h + 360.0: h > 360.0? h - 360.0: h,
            color.b <= 0.0? 0.0: delta / color.b,
            color.b
        );
    }

    return result;
}

vec3 convertToRGB(vec3 color) {
    float c = color[2] * color[1];
    float x = c * (1.0 - abs( mod((color[0] / 60.0), 2.0) - 1.0));
    float m = color[2] - c;
    float h = color[0];
    if(h < 60.0) {
        return vec3(c+m, x+m, m);

    } else if (h < 120.0) {
        return vec3(x+m, c+m, m);

    } else if (h < 180.0) {
        return vec3(m, c+m, x+m);
        
    } else if (h < 240.0) {
        return vec3(m, x+m, c+m);

    } else if (h < 300.0) {
        return vec3(x+m, m, c+m);

    } else {
        return vec3(c+m, m, x+m);
        
    }
}
`;

const fragmentShader = glsl`#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float minimum;
uniform float maximum;
uniform float middle;

out vec4 outColor;

`+ conversons + glsl`

void main() {
    vec4 tex = texture(sampler, fragUV);
    float brightness = max(tex.r, max(tex.g, tex.b));
    float midPoint = (maximum * middle) + (minimum * (1.0 - middle));

    if (brightness <= minimum) {
        outColor = vec4(0.0, 0.0, 0.0, tex.a);
    } else if (brightness >= maximum) {
        outColor = vec4(1.0, 1.0, 1.0, tex.a);
    // } else if (brightness < midPoint) {
    //     vec3 color = convertToHSV(tex.rgb);
    //     color[2] = ((color[2] - minimum) / (midPoint - minimum)) * 0.5;
    //     color = convertToRGB(color);
    //     outColor = vec4(color.r, color.g, color.b, tex.a);
    // } else {
    //     vec3 color = convertToHSV(tex.rgb);
    //     color[2] = ((color[2] - midPoint) / (maximum - midPoint)) * 0.5 + 0.5;
    //     color = convertToRGB(color);
    //     outColor = vec4(color.r, color.g, color.b, tex.a);
    // }
    } else if (brightness < midPoint) {
        // float red   = ((tex.r - minimum) / (midPoint - minimum)) * 0.5;
        // float green = ((tex.g - minimum) / (midPoint - minimum)) * 0.5;
        // float blue  = ((tex.b - minimum) / (midPoint - minimum)) * 0.5;
        float red   = tex.r * 0.5;
        float green = tex.g * 0.5;
        float blue  = tex.b * 0.5;
        outColor = vec4(red, green, blue, tex.a);
    } else {
        // float red   = ((tex.r - midPoint) / (maximum - midPoint)) * 0.5 + 0.5;
        // float green = ((tex.g - midPoint) / (maximum - midPoint)) * 0.5 + 0.5;
        // float blue  = ((tex.b - midPoint) / (maximum - midPoint)) * 0.5 + 0.5;
        float red   = tex.r * 0.5 + 0.5;
        float green = tex.g * 0.5 + 0.5;
        float blue  = tex.b * 0.5 + 0.5;
        outColor = vec4(red, green, blue, tex.a);
    }
}
`


export class HistogramArttribsGL {
    minimum: number;
    middle: number;
    maximum: number;

    constructor(minimum: number, middle: number, maximum: number) {
        this.minimum = minimum;
        this.middle = middle;
        this.maximum = maximum;
    }
}

export class HistogramProgramGL extends BasicProgramGL<HistogramArttribsGL> {


    constructor(gl: WebGL2RenderingContext) {
        super(gl, fragmentShader);
    }

    setAttributes(attributes: HistogramArttribsGL): void {
        this.gl.useProgram(this.programInfo.program);
        setUniforms(this.programInfo, attributes);
    }




}