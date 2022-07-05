import { IWebGL } from '../types';
import TextureCommon from './texture-common';
export default class Texture extends TextureCommon {
    readonly gl: IWebGL;
    constructor(gl: IWebGL);
    /**
     * Load image, video or canvas data into the texture.
     */
    loadFrame(img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): void;
    /**
     * Immediatly create a transparent texture of 1x1.
     * Update it as soon as the image is loaded.
     *
     * @param url Source of the image to load.
     */
    loadImageURL(url: string): void;
}
//# sourceMappingURL=texture.d.ts.map