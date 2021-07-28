import {BufferInfo, ProgramInfo} from "twgl.js";

export abstract class ProgramGL<IN, OUT> {
    protected gl: WebGL2RenderingContext;
    protected programInfo?: ProgramInfo;
    protected bufferInfo?: BufferInfo;

    protected constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    abstract compile(): void;

    abstract delete(): void;

    abstract createBasicBuffers(): void;
    abstract useBasicBuffers(bufferInfo: BufferInfo): void;

    abstract removeBuffers(): void;

    abstract render(args: IN): OUT;

    protected removeBasicBuffers(): void {
        this.gl.deleteBuffer(this.bufferInfo.indices);
        Object.values(this.bufferInfo.attribs)
            .forEach(b => this.gl.deleteBuffer(b.buffer));
    }
}