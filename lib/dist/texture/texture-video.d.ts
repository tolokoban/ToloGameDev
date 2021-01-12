import { IWebGL } from '../types';
import TextureCommon from './texture-common';
export default class Texture extends TextureCommon {
    readonly gl: IWebGL;
    readonly video: HTMLVideoElement;
    protected _isPlaying: boolean;
    /**
     * `minWidth` and `minHeight` can have a different aspect ratio than
     * the actual video. We must keep the aspect ratio of the video,
     * so we will use a "cover" algorithm.
     * For instance, if the actual video is `1000x500` but we requested
     * `minWidth=400` and `minHeight=400`, we will resize the video to
     * `800x400`.
     *
     * @param gl WebGL or WebGL2 context
     * @param video Video element
     * @param minWidth Minimal width (video will be resized according to aspect ratio)
     * @param minHeight Same for height.
     */
    constructor(gl: IWebGL, video: HTMLVideoElement, minWidth?: number, minHeight?: number);
    update(): void;
}
//# sourceMappingURL=texture-video.d.ts.map