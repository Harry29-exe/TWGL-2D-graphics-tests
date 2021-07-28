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

out vec4 outColor;

void main() {
    outColor = vec4(0.2, 0.2, 0.3, 1.0);
}`;

const trisPos = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0,  1.0,
    1.0,  1.0
];

const trisUV = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
];

const trisIndexes = [
    0, 1, 2,
    3, 2, 1
];

export async function init() {
    document.body.innerHTML = `
        <canvas id="canvas"></canvas>
        <img id="img" src="/tex1.jpg" alt="" style="width: 50px; height: 50px"/>`;
    document.getElementById('img').onload = () => onLoad()
}

function onLoad() {
    let gl = (document.getElementById('canvas') as HTMLCanvasElement).getContext('webgl2');

    if(!gl) {
        throw new Error('No webgl2');
    }

    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderSrc);
    gl.compileShader(vertShader);
    if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        throw new Error(`The Shader below did not compiled properly:\n ${vertShader}
        \n ${gl.getShaderInfoLog(vertShader)}
        `);
    }

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderSrc);
    gl.compileShader(fragShader);
    if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        throw new Error(`The Shader below did not compiled properly:\n ${fragShader}
        \n ${gl.getShaderInfoLog(fragShader)}
        `);
    }
    let program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Linking problem:\n", gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    let vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trisPos), gl.STATIC_DRAW);

    let vertPosLocation = gl.getAttribLocation(program, 'vertPos');
    gl.vertexAttribPointer(
        vertPosLocation,
        2,
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(vertPosLocation);


    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trisUV), gl.STATIC_DRAW);

    let uvLocation = gl.getAttribLocation(program, 'texCoords');
    gl.vertexAttribPointer(
        uvLocation,
        2,
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(uvLocation);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trisIndexes), gl.STATIC_DRAW);

    gl.clearColor(0.2, 0.8, 0.2, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl. COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}