import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

interface Image2DProps {
  src: string;
  x: number;
  y: number;
  z?: number;
  scale?: number;
  horizontalReverse?: boolean;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
}

const Image2D = (props: Image2DProps) => {
  const texture = useLoader(TextureLoader, props.src);
  const scale = props.scale ?? 1;
  const horizontalReverse = props.horizontalReverse ?? false;
  return (
    <mesh
      position={[props.x, props.y, props.z ?? 0]}
      scale={[horizontalReverse ? -1 : 1, 1, 1]}
      onPointerEnter={props.onMouseEnter}
      onPointerLeave={props.onMouseLeave}
    >
      <planeGeometry args={[texture.image.width * scale, texture.image.height * scale]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
};

export default Image2D;
