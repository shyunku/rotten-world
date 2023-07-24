import GameObject from "./GameObject";

interface LayerProps {
  gameObjects: (typeof GameObject)[];
}

const Layer = (props: LayerProps) => {
  return <>{props.gameObjects}</>;
};

export default Layer;
