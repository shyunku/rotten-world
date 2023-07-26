import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Raycaster, Vector2 } from "three";

interface GroundProps {
  onGroundClick?: (point: Vector2) => void;
}

const Ground = ({ onGroundClick }: GroundProps) => {
  const meshRef: any = useRef();
  const { camera, size } = useThree();
  const { width, height } = size;

  const onMouseRightClick = (e: any) => {
    if (!meshRef.current) return;

    const mouseVec = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouseVec, camera);
    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const point = intersect.point;
      onGroundClick?.(new Vector2(point.x, point.y));
    }
  };

  return (
    <>
      <mesh ref={meshRef} onContextMenu={onMouseRightClick}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
    </>
  );
};

export default Ground;
