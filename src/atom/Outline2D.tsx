import { extend, useFrame, useThree } from "@react-three/fiber";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { Vector2 } from "three";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

extend({ RenderPass, OutlinePass, ShaderPass });

const context = createContext({});

export const Outline2D = ({ children }: any) => {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<any>();
  const [hovered, set] = useState([]);
  const aspect = useMemo(() => new Vector2(size.width, size.height), [size]);
  useEffect(() => composer.current?.setSize(size.width, size.height), [size]);
  useFrame(() => composer.current?.render(), 1);

  return null;
  // <context.Provider value={set}>
  //   {children}
  //   <effectComposer ref={composer} args={[gl]}>
  //     <renderPass attachArray="passes" args={[scene, camera]} />
  //     <outlinePass
  //       attachArray="passes"
  //       args={[aspect, scene, camera]}
  //       selectedObjects={hovered}
  //       visibleEdgeColor="white"
  //       edgeStrength={50}
  //       edgeThickness={1}
  //     />
  //     <shaderPass
  //       attachArray="passes"
  //       args={[FXAAShader]}
  //       uniforms-resolution-value={[1 / size.width, 1 / size.height]}
  //     />
  //   </effectComposer>
  // </context.Provider>
};
