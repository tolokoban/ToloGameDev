import { IWebGL, ITextureOptions } from '../types';
import Texture from './texture';
import TextureVideo from './texture-video';
declare const _default: {
    createTexture2D: typeof createTexture2D;
    fromCamera: typeof fromCamera;
    fromURL: typeof fromURL;
    fromData: typeof fromData;
    fromDataLuminance: typeof fromDataLuminance;
};
export default _default;
declare function createTexture2D(gl: IWebGL): Texture;
declare function fromCamera(gl: IWebGL, minWidth?: number, minHeight?: number): Promise<TextureVideo | null>;
declare function fromData(gl: IWebGL, width: number, height: number, data?: Uint8Array | null, options?: Partial<ITextureOptions>): WebGLTexture;
declare function fromDataLuminance(gl: IWebGL, width: number, height: number, data?: Uint8Array | null, options?: Partial<ITextureOptions>): WebGLTexture;
declare function fromURL(gl: IWebGL, url: string, options?: Partial<ITextureOptions>): WebGLTexture;
//# sourceMappingURL=texture-manager.d.ts.map