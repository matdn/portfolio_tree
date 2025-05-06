import { Uniform } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ZDepthShader } from "../shaders/ZDepthShader";

export class ZDepthPass extends ShaderPass {

    constructor() {
        super({
            defines: { LABEL: "value" },
            uniforms: {
                tDiffuse: new Uniform(null),
                tDepth: new Uniform(null),
                cameraNear: new Uniform(0.1),
                cameraFar: new Uniform(50),
            },
            vertexShader: ZDepthShader.vertexShader,
            fragmentShader: ZDepthShader.fragmentShader,

        });
 
    }

}