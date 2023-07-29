import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ConstraintProps } from "../properties/ConstraintProps";

export interface TextProps {
  x?: number;
  y?: number;
  z?: number;
  text: string;
  color?: string;
  fontSize?: number;
  textAlignHorizontal?: "left" | "center" | "right";
  textAlignVertical?: "top" | "middle" | "bottom";
  opacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

const Text2D = (props: TextProps & ConstraintProps) => {
  const { size } = useThree();
  const { width, height } = size;

  const x =
    props?.x ??
    (() => {
      if (props.left != null && props.right != null)
        return (width * props.left) / (props.left + props.right) - width / 2;
      if (props.left != null) return props.left - width / 2;
      if (props.right != null) return width / 2 - props.right;
      return 0;
    })();

  const y =
    props?.y ??
    (() => {
      if (props.top != null && props.bottom != null)
        return (height * props.top) / (props.top + props.bottom) - height / 2;
      if (props.top != null) return height / 2 - props.top;
      if (props.bottom != null) return props.bottom - height / 2;
      return 0;
    })();

  const position: [number, number, number] = [x, y, props.z || 0];
  return (
    <Text
      position={position}
      fontSize={props.fontSize || 15}
      color={props.color || "black"}
      anchorX={props.textAlignHorizontal || "center"}
      anchorY={props.textAlignVertical || "middle"}
      fillOpacity={props.opacity ?? 1}
      strokeColor={props.strokeColor || props.color || "black"}
      strokeWidth={props.strokeWidth ?? 0}
      // font={}
    >
      {props.text}
    </Text>
  );
};

export default Text2D;
