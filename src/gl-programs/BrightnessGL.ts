import {ProgramGL} from "./ProgramGL";
import {
    BufferInfo,
    createBufferInfoFromArrays,
    createProgramInfo,
    drawBufferInfo,
    setBuffersAndAttributes
} from "twgl.js";
import {indexes, uv, vertices} from "./default-buffers/Scenne2D";

const vertexShaderSrc = `#version 300 es
precision mediump float;

in vec2 vertPos;
in vec2 texCoords;

out vec2 fragUV;

void main() {
    fragUV = texCoords;
    gl_Position = vec4(vertPos, 0.0, 1.0);
}`;

const fragmentShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragUV;
uniform sampler2D sampler;

out vec4 outColor;

void main() {
    vec4 color = texture(sampler, fragUV);
    outColor = vec4(color.x + 0.1, color.y + 0.1, color.z + 0.1, color.w);
}`;

export class BrightnessArgs {
    public input: WebGLTexture;
    public output: WebGLFramebuffer;
    public brightnessDiff: number;


    constructor(input: WebGLTexture, output: WebGLFramebuffer, brightnessDiff: number) {
        this.input = input;
        this.output = output;
        this.brightnessDiff = brightnessDiff;
    }
}

export class BrightnessGL extends ProgramGL<any>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.compile();
    }

    compile(): void {
        this.programInfo = createProgramInfo(this.gl, [vertexShaderSrc, fragmentShaderSrc]);
    }

    createBasicBuffers(): void {
        if(this.programInfo === null) {
            throw new Error("")
        }

        this.bufferInfo = createBufferInfoFromArrays(this.gl,
            {
            vertPos: {numComponents: 2, data: vertices},
            texCoords: {numComponents: 2, data: uv},
            indices: {numComponents: 3, data: indexes}}
        );

        this.gl.useProgram(this.programInfo.program);
        setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    }

    delete(): void {
        if(this.programInfo === null) {
            return;
        }
        this.gl.deleteProgram(this.programInfo.program);
        this.programInfo = null;
    }

    removeBuffers(): void {
        this.removeBasicBuffers();
        this.bufferInfo = null;
    }

    setAttributes(attributes: any): void {
    }

    useBasicBuffers(bufferInfo: BufferInfo): void {
        if(this.bufferInfo) {
            this.removeBuffers();
        }
        if(this.programInfo === null) {
            throw new Error();
        }
        this.bufferInfo = bufferInfo;
        this.gl.useProgram(this.programInfo.program);
        setBuffersAndAttributes(this.gl, this.programInfo, bufferInfo);
    }

}