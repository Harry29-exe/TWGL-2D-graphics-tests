import {
    createBufferInfoFromArrays,
    createProgramInfo,
    createTexture,
    drawBufferInfo,
    setBuffersAndAttributes, setUniforms
} from "twgl.js";

const vertShaderSrc = `#version 300 es
precision mediump float;

in vec2 vertPos;
in vec2 texCoords;

out vec2 fragTex;

void main() {
    fragTex = texCoords;
    gl_Position = vec4(vertPos, 0.0, 1.0);
}
`;


const fragShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragTex;
uniform sampler2D sampler;

out vec4 outColor;

void main() {
    vec4 color = texture(sampler, fragTex);
    outColor = vec4(color.x + 0.1, color.y + 0.1,color.z + 0.1, color.w);
}`;

const trisPos = [
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
     1.0,  1.0
];

const trisUV = [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0
];
// const trisUV = [
//     0.0, 0.0,
//     1.0, 0.0,
//     0.0, 1.0,
//     1.0, 1.0
// ];

const trisIndexes = [
    0, 1, 2,
    3, 2, 1
];

const arrays = {
    vertPos: {numComponents: 2, data: trisPos},
    texCoords: {numComponents: 2, data: trisUV},
    indices: {numComponents: 3, data: trisIndexes}
};

export async function init() {
    document.body.innerHTML = `
        <canvas id="canvas" height="4446px" width="6241px" style="width: 621px; height: 444px"></canvas>`;

    let gl = (document.getElementById('canvas') as HTMLCanvasElement).getContext('webgl2');

    if(!gl) {
        throw new Error('No webgl2');
    }

    let programInfo = createProgramInfo(gl, [vertShaderSrc, fragShaderSrc]);
    let bufferInfo = createBufferInfoFromArrays(
        gl, arrays);

    gl.useProgram(programInfo.program);
    setBuffersAndAttributes(gl, programInfo, bufferInfo);


    function render() {

        gl.clearColor(0.2, 0.8, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawBufferInfo(gl, bufferInfo);
    }

    let texture = createTexture(gl, {target: gl.TEXTURE_2D, src: 'tex1.jpg'}, () => render());
}

