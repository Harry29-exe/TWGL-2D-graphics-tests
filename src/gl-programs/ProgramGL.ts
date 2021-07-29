import {BufferInfo, drawBufferInfo, ProgramInfo} from "twgl.js";

export const basicVertexShaderSrc = `#version 300 es
precision mediump float;

in vec2 vertPos;
in vec2 texCoords;

out vec2 fragUV;

void main() {
    fragUV = texCoords;
    gl_Position = vec4(vertPos, 0.0, 1.0);
}`;

export abstract class ProgramGL<ATTRIBS> {
    protected gl: WebGL2RenderingContext;
    protected programInfo: ProgramInfo | null;
    protected bufferInfo: BufferInfo | null;

    protected constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    abstract compile(): void;

    abstract delete(): void;

    abstract createBasicBuffers(): void;
    abstract useBasicBuffers(bufferInfo: BufferInfo): void;

    abstract removeBuffers(): void;


    abstract setAttributes(attributes: ATTRIBS): void;

    render(): void {
        if(this.programInfo === null) {
            throw new Error("Program is not initialized. It probably was deleted with delete() function. " +
                "In this case you can reinitialize it with compile()");
        } else if(this.bufferInfo === null) {
            throw new Error("Program buffers ");
        }

        drawBufferInfo(this.gl, this.bufferInfo);
    }

    protected removeBasicBuffers(): void {
        if(this.bufferInfo === null) {
            return;
        }
        // @ts-ignore
        this.gl.deleteBuffer(this.bufferInfo.indices);
        // @ts-ignore
        Object.values(this.bufferInfo.attribs)
            .forEach(b => this.gl.deleteBuffer(b.buffer));
    }
}