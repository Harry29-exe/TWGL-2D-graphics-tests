export class TextureInfoGL {
    public textureGL: WebGLTexture;
    public width: number;
    public height: number;


    constructor(textureGL: WebGLTexture, width: number, height: number) {
        this.textureGL = textureGL;
        this.width = width;
        this.height = height;
    }
}