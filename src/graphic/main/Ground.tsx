import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Raycaster, Vector2 } from "three";

interface GroundProps {
  onGroundLeftClick?: (point: Vector2) => void;
  onGroundRightClick?: (point: Vector2) => void;
}

const Ground = (props: GroundProps) => {
  const meshRef: any = useRef();
  const { camera, size } = useThree();
  const { width, height } = size;

  const onMouseLeftClick = (e: any) => {
    const mousePos = calculateMousePosition(e);
    if (mousePos) {
      props.onGroundLeftClick?.(mousePos);
    }
  };

  const onMouseRightClick = (e: any) => {
    const mousePos = calculateMousePosition(e);
    if (mousePos) {
      props.onGroundRightClick?.(mousePos);
    }
  };

  const calculateMousePosition = (e: any): Vector2 | null => {
    if (!meshRef.current) return null;

    const mouseVec = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);

    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouseVec, camera);
    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const point = intersect.point;
      return new Vector2(point.x, point.y);
    }
    return null;
  };

  return (
    <>
      <mesh ref={meshRef} onClick={onMouseLeftClick} onContextMenu={onMouseRightClick}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ddd" />
      </mesh>
    </>
  );
};

export default Ground;
