import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import HomeScene from "../scenes/Home.scene";
import { NoToneMapping } from "three";

const World = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas
        camera={{
          position: [0, 0, 0.1],
          zoom: 1,
          near: 0.1,
          far: 1000,
        }}
        linear={true}
        orthographic={true}
        gl={{ antialias: true, toneMapping: NoToneMapping }}
      >
        <HomeScene />
      </Canvas>
    </Suspense>
  );
};

export default World;
