import { IWebGL } from '../types';
export default class TextureCommon {
    readonly gl: IWebGL;
    readonly texture: WebGLTexture;
    protected _alive: boolean;
    protected _width: number;
    protected _height: number;
    constructor(gl: IWebGL);
    get isAlive(): boolean;
    get width(): number;
    get height(): number;
    /**
     * Quick helper to set the wrapping behaviour.
     * Use `set(Horizontal|Vertical)Wrap*` functions for finer tuning.
     *
     * @param horizontal Should we repeat when X overflows?
     * @param vertical Should we repeat when Y overflows?
     */
    wrap(horizontal: boolean, vertical: boolean): void;
    private setWrapping;
    setHorizontalWrapClampToEdge: () => void;
    setHorizontalWrapRepeat: () => void;
    setHorizontalWrapRepeatMirror: () => void;
    setVerticalWrapClampToEdge: () => void;
    setVerticalWrapRepeat: () => void;
    setVerticalWrapRepeatMirror: () => void;
    /**
     * Activate the texture in a slot.
     */
    activate(slot?: number): void;
    /**
      * Remove texture from GPU memory.
      * Once this function is called, this object is of no use.
      */
    destroy(): void;
}
//# sourceMappingURL=texture-common.d.ts.map