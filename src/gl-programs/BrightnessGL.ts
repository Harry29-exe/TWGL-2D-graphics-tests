import {ProgramGL} from "./ProgramGL";
import {BufferInfo, createBufferInfoFromArrays, createProgramInfo, setBuffersAndAttributes} from "twgl.js";
import {indexes, uv, vertices} from "./default-buffers/Scenne2D";

const vertexShaderSrc = ``;
const fragmentShaderSrc = ``;

export class BrightnessGL extends ProgramGL<any, any>{

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.compile();
    }

    compile(): void {
        createProgramInfo(this.gl, [vertexShaderSrc, fragmentShaderSrc]);
    }

    createBasicBuffers(): void {
        this.bufferInfo = createBufferInfoFromArrays(this.gl, {
            vertPos: {numComponents: 2, data: vertices},
            vertUV: {numComponents: 2, data: uv},
            indices: {numComponents: 3, data: indexes}
        });

        setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    }

    delete(): void {
        this.gl.deleteProgram(this.programInfo.program);
        this.programInfo = null;
    }

    removeBuffers(): void {
        this.removeBasicBuffers();
        this.bufferInfo = null;
    }

    render(args: any): any {
        return undefined;
    }

    useBasicBuffers(bufferInfo: BufferInfo): void {
        if(this.bufferInfo) {
            this.removeBuffers();
        }
        this.bufferInfo = bufferInfo;
        setBuffersAndAttributes(this.gl, this.programInfo, bufferInfo);
    }

}