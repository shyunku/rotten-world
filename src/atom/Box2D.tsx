import { Box } from "@react-three/drei";

interface Box2DProps {
  width: number;
  height: number;
  x: number;
  y: number;
  z?: number;
  color: string;
  opacity?: number;
}

const Box2D = (props: Box2DProps) => {
  return (
    <Box
      args={[props.width, props.height, 0.1]}
      position={[props.x + props.width / 2, props.y - props.height / 2, props?.z ?? 0]}
    >
      <meshBasicMaterial color={props.color} transparent opacity={props.opacity ?? 1} />
    </Box>
  );
};

export default Box2D;
