import { Box } from "@react-three/drei";

interface Box2DProps {
  width: number;
  height: number;
  x: number;
  y: number;
  z?: number;
  color: string;
}

const Box2D = (props: Box2DProps) => {
  return (
    <Box
      args={[props.width, props.height, 0.1]}
      position={[props.x + props.width / 2, props.y - props.height / 2, props?.z ?? 0]}
    >
      <meshBasicMaterial color={props.color} />
    </Box>
  );
};

export default Box2D;
