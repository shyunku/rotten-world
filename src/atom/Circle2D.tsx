import { CircleGeometry, MeshBasicMaterial, Vector2 } from "three";

export interface Circle2DProps {
  pos: Vector2;
  radius: number;
  color?: string;
}

const Circle2D = (props: Circle2DProps) => {
  const geometry = new CircleGeometry(props.radius, 32);
  const material = new MeshBasicMaterial({ color: props.color ?? "white" });

  return <mesh geometry={geometry} material={material} position={[props.pos.x, props.pos.y, 0]} />;
};

export default Circle2D;
