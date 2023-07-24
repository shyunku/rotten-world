import { Text, RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ConstraintProps } from "../properties/ConstraintProps";
import { useEffect, useRef, useState } from "react";

interface ButtonProps {
  z?: number;
  text: string;
  color?: string;
  fontSize?: number;
  bgColor?: string;
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  onPress?: () => void;
}

const Button2D = (props: ButtonProps & ConstraintProps) => {
  const { size } = useThree();
  const [textRenderEnded, setTextRenderEnded] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const { width, height } = size;
  const meshRef = useRef<any>();

  const onAfterTextRender = () => {
    if (meshRef.current) {
      const ref = meshRef.current;
      const box = ref.geometry.boundingBox;
      const w = box.max.x - box.min.x;
      const h = box.max.y - box.min.y;
      setTextWidth(w);
      setTextHeight(h);
      setTextRenderEnded(true);
    }
  };

  const x = (() => {
    if (props.left != null && props.right != null) return (width * props.left) / (props.left + props.right) - width / 2;
    if (props.left != null) return props.left - width / 2;
    if (props.right != null) return width / 2 - props.right;
    return 0;
  })();

  const y = (() => {
    if (props.top != null && props.bottom != null)
      return (height * props.top) / (props.top + props.bottom) - height / 2;
    if (props.top != null) return height / 2 - props.top;
    if (props.bottom != null) return props.bottom - height / 2;
    return 0;
  })();

  const position: [number, number, number] = [x, y, props.z || 0];
  return (
    <>
      <mesh position={position} scale={1.1} onClick={props.onPress}>
        <planeGeometry
          args={[
            props.width ?? textWidth + (props.paddingHorizontal ?? 20),
            props.height ?? textHeight + (props.paddingVertical ?? 20),
          ]}
        />
        <meshStandardMaterial
          attach={"material"}
          color={props.bgColor || "white"}
          opacity={props.opacity ?? 1}
          transparent
        />
      </mesh>
      <Text
        ref={meshRef}
        position={position}
        fontSize={props.fontSize || 15}
        color={props.color || "black"}
        onAfterRender={textRenderEnded ? () => {} : onAfterTextRender}
      >
        {props.text}
      </Text>
    </>
  );
};

export default Button2D;
