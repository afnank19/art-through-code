import { Canvas } from "@react-three/fiber";
import Shader from "./Shader";
import { shaderMap } from "../shader-strings/shader-map";

const ShaderCanvas = ({ shaderName }) => {

    return (
        <div className="relative aspect-video -z-50 opacity-100">
            <Canvas >
                <Shader fragSrc={shaderMap.get(shaderName)}/>
            </Canvas>
        </div>
    )
}

export default ShaderCanvas;