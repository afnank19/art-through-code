import  { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Shader = ({ fragSrc}) => {
  const meshRef = useRef();
  const startTime = useRef(Date.now());

  // const { size } = useThree();

  useFrame((state) => {
    const { width, height } = state.size;   
    const elapsedTime = (Date.now() - startTime.current) / 1000; // Time in seconds
    if (meshRef.current) {
      meshRef.current.material.uniforms.u_time.value = elapsedTime;
    }

    const material = meshRef.current.material;
    material.uniforms.u_resolution.value = [width, height];
  });

  const fragmentShader = fragSrc;

  const vertexShader = `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={{
          u_resolution: { value: [window.innerWidth, window.innerHeight] },
          u_time: { value: 0 }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default Shader;