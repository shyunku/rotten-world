import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ConstraintProps } from "properties/CommonProps";
import { forwardRef } from "react";
import { FontWeight } from "system/Types";

export interface TextProps {
  x?: number;
  y?: number;
  z?: number;
  text: string | number;
  color?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  textAlignHorizontal?: "left" | "center" | "right";
  textAlignVertical?: "top" | "middle" | "bottom";
  opacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  onAfterRender?: (e: any) => void;
}

const fontUrls = {
  normal: "/assets/fonts/IBMPlexSansKR-Regular.ttf",
  bold: "/assets/fonts/IBMPlexSansKR-Medium.ttf",
  bolder: "/assets/fonts/IBMPlexSansKR-Bold.ttf",
  light: "/assets/fonts/IBMPlexSansKR-Light.ttf",
  lighter: "/assets/fonts/IBMPlexSansKR-Thin.ttf",
};

const Text2D = forwardRef((props: TextProps & ConstraintProps, ref) => {
  const { size } = useThree();
  const { width, height } = size;

  const x =
    props?.x ??
    (() => {
      if (props.left != null && props.right != null) {
        if (props.left === 0 && props.right === 0) return 0;
        return ((width / 2) * props.left + (-width / 2) * props.right) / (props.left + props.right);
      }
      if (props.left != null) return props.left - width / 2;
      if (props.right != null) return width / 2 - props.right;
      return 0;
    })();

  const y =
    props?.y ??
    (() => {
      if (props.top != null && props.bottom != null) {
        if (props.top === 0 && props.bottom === 0) return 0;
        return ((height / 2) * props.top + (-height / 2) * props.bottom) / (props.top + props.bottom);
      }
      if (props.top != null) return height / 2 - props.top;
      if (props.bottom != null) return props.bottom - height / 2;
      return 0;
    })();

  const position: [number, number, number] = [x, y, props.z ?? 0];
  const font = fontUrls[props.fontWeight ?? "normal"];
  return (
    <Text
      ref={ref}
      position={position}
      fontSize={props.fontSize ?? 15}
      color={props.color || "white"}
      anchorX={props.textAlignHorizontal || "center"}
      anchorY={props.textAlignVertical || "middle"}
      fillOpacity={props.opacity ?? 1}
      strokeColor={props.strokeColor || props.color || "black"}
      strokeWidth={props.strokeWidth ?? 0}
      strokeOpacity={props.opacity ?? 1}
      font={font}
      onPointerEnter={props.onMouseEnter}
      onPointerLeave={props.onMouseLeave}
      onAfterRender={props.onAfterRender}
    >
      {props.text}
    </Text>
  );
});

export default Text2D;
