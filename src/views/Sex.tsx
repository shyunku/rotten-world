import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

const Sex = () => {
  //   useFrame((state, delta) => {
  //     console.log(state);
  //     console.log(delta);
  //   });

  return (
    <Canvas>
      <OrbitControls autoRotate={true} />
      <mesh>
        <ambientLight intensity={1} />
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial attach="material" color={0xffffff} />
        <shaderMaterial />
      </mesh>
    </Canvas>
  );
};

export default Sex;
