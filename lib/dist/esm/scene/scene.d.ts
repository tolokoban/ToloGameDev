import { IWebGL, IShaders, ITextureOptions } from '../types';
interface IWebGLSettings {
    alpha: boolean;
    desynchronized: boolean;
    antialias: boolean;
    depth: boolean;
    failIfMajorPerformanceCaveat: boolean;
    powerPreference: "default" | "high-performance" | "low-power";
    premultipliedAlpha: boolean;
    preserveDrawingBuffer: boolean;
    stencil: boolean;
}
export default class Scene {
    readonly canvas: HTMLCanvasElement;
    readonly gl: IWebGL;
    readonly settings: IWebGLSettings;
    readonly webglVersion: number;
    private lastWidth;
    private lastHeight;
    constructor(canvas: HTMLCanvasElement, settings?: Partial<IWebGLSettings>);
    readonly program: {
        create: (shaders: IShaders) => WebGLProgram;
    };
    readonly texture: {
        fromURL: (url: string, options?: Partial<ITextureOptions> | undefined) => WebGLTexture;
        fromData: (width: number, height: number, data?: Uint8Array | undefined, options?: Partial<ITextureOptions> | undefined) => WebGLTexture;
        fromDataLuminance: (width: number, height: number, data?: Uint8Array | undefined, options?: Partial<ITextureOptions> | undefined) => WebGLTexture;
    };
    createArrayBufferStatic(data: ArrayBuffer): WebGLBuffer;
    /**
     * Call this function at every frame render to ensure that the canvas size is reported to the WebGL scene viewport.
     */
    resize(): void;
    get width(): number;
    get height(): number;
    /**
     * Return the current aspect ratio: width / height.
     */
    get aspectRatio(): number;
}
export {};
//# sourceMappingURL=scene.d.ts.map