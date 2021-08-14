import { glsl } from "../../gl-programs/ProgramGL";

export const conversions = glsl`
vec3 convertToHSV(vec3 color) {
    if(color.r > color.b && color.r > color.g) {
        float delta = color.r - min(color.g, color.b);
        float h = 
            delta <= 0.0? 0.0:
            mod( ((color.g - color.b) / delta), 6.0) * 60.0;
        return vec3(
            h < 0.0? h + 360.0: h > 360.0? h - 360.0: h,
            delta / color.r,
            color.r
        );
    } else if(color.g > color.r && color.g > color.b) {
        float delta = color.g - min(color.r, color.b);
        float h = delta <= 0.0? 0.0:
                ((color.b - color.r) / delta + 2.0) * 60.0;
                return vec3(
            h < 0.0? h + 360.0: h > 360.0? h - 360.0: h,
            delta / color.g,
            color.g
        );
    } else {
        float delta = color.b - min(color.r, color.g);
        float h = delta <= 0.0? 0.0:
                    ((color.r - color.g) / delta + 4.0) * 60.0;

        return vec3(
            h < 0.0? h + 360.0: h > 360.0? h - 360.0: h,
            color.b <= 0.0? 0.0: delta / color.b,
            color.b
        );
    }
}

vec3 convertToRGB(vec3 color) {
    color[1] = color[1] < 0.0? 0.0: color[1] > 1.0? 1.0: color[1];
    color[2] = color[2] < 0.0? 0.0: color[2] > 1.0? 1.0: color[2];
    while (color[0] >= 360.0) {
        color[0] -= 360.0;
    }
    while (color[0] < 0.0) {
        color[0] -= 360.0;
    }


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