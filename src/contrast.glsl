#version 300 es
precision mediump float;

in vec2 vertPos;
in vec2 texCoords;

out vec2 fragTex;

void main() {
    gl_Position = vec4(vertPos.xy, 0.0, 0.0);
    fragTex = texCoords;
}


#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float contrast;

out vec4 outColor;

void main() {
    float f = (259 * (contrast + 255)) / (255 * (259 - contrast));
    vec4 tex = texture(sampler, fragUV);
    float alfa = tex.w;
    tex = tex * f;
    outColor = vec4(tex.x > 1? 1: tex.x, tex.y > 1? 1: tex.y, tex.z > 1? 1: tex.z, alfa);
}