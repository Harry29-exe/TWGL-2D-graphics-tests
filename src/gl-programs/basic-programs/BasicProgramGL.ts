import {basicVertexShaderSrc, ProgramGL} from "../ProgramGL";
import {BufferInfo, createBufferInfoFromArrays, createProgramInfo, setBuffersAndAttributes} from "twgl.js";
import {indexes, uv, vertices} from "../default-buffers/Scenne2D";

export abstract class BasicProgramGL<ATTRIB> extends ProgramGL<ATTRIB> {
    protected fragmentShaderSrc: string;

    constructor(gl: WebGL2RenderingContext, fragmentShaderSrc: string) {
        super(gl);
        this.fragmentShaderSrc = fragmentShaderSrc;
        this.compile();
    }

    compile(): void {
        this.programInfo = createProgramInfo(this.gl, [basicVertexShaderSrc, this.fragmentShaderSrc]);
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