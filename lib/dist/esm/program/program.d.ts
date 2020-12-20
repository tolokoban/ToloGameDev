import { IWebGL, IShaders, IAttribute } from '../types';
declare const _default: {
    create: typeof create;
    getAttribs: typeof getAttribs;
};
export default _default;
declare function create(gl: IWebGL, shaders: IShaders): WebGLProgram;
/**
 * Return an object will all the active attributes of a given Program.
 * If an attribute is defined in a shader but not used, it will be removed
 * at compilation time. In that case, it will not be returned in this function.
 */
declare function getAttribs(gl: IWebGL, prg: WebGLProgram): {
    [key: string]: IAttribute;
};
//# sourceMappingURL=program.d.ts.map