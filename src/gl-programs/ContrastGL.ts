import {basicVertexShaderSrc, ProgramGL} from "./ProgramGL";
import {
    BufferInfo,
    createBufferInfoFromArrays,
    createProgramInfo,
    drawBufferInfo,
    setBuffersAndAttributes, setUniforms
} from "twgl.js";
import {indexes, uv, vertices} from "./default-buffers/Scenne2D";

const fragmentShaderSrc = `#version 300 es
precision mediump float;

in vec2 fragUV;

uniform sampler2D sampler;
uniform float contrast;

out vec4 outColor;

void main() {
    float f = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    vec4 tex = texture(sampler, fragUV);
    float alfa = tex.w;
    tex = tex * f;
    outColor = vec4(tex.x > 1.0? 1.0: tex.x, tex.y > 1.0? 1.0: tex.y, tex.z > 1.0? 1.0: tex.z, alfa);
}`;

export class ContrastArgsGL {
    contrast: number;

    constructor(contrast: number) {
        this.contrast = contrast;
    }
}

export class ContrastGL extends  ProgramGL<ContrastArgsGL>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.compile();
    }

    compile(): void {
        this.programInfo = createProgramInfo(this.gl, [basicVertexShaderSrc, fragmentShaderSrc]);
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

    setAttributes(attributes: ContrastArgsGL): void {
        setUniforms(this.programInfo, attributes);
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