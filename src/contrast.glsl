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

in vec2 fragTex;
uniform sampler2D sampler;

out vec4 outColor;

void main() {
    outColor = texture(sampler, fragTex);
}