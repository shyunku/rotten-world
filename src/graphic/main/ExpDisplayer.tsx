import { useThree } from "@react-three/fiber";
import Box2D from "graphic/atom/Box2D";
import Text2D from "graphic/atom/Text2D";

interface ExpDisplayerProps {
  curExp: number;
  maxExp: number;
  height?: number;
  bgColor?: string;
  fgColor?: string;
}

const ExpDisplayer = (props: ExpDisplayerProps) => {
  const { size } = useThree();
  const { width, height } = size;
  const boxHeight = props.height ?? 10;
  const topY = boxHeight - height / 2;
  return (
    <>
      <Box2D x={-width / 2} y={topY} width={width} height={boxHeight} color={props.bgColor ?? "black"} />
      <Box2D
        x={-width / 2}
        y={topY}
        width={(width * props.curExp) / props.maxExp}
        height={boxHeight}
        color={props.fgColor ?? "green"}
      />
      <Text2D
        text={`${props.curExp}/${props.maxExp}`}
        bottom={boxHeight / 2 - 2}
        color={"#aaa"}
        z={0.2}
        fontSize={12}
      />
    </>
  );
};

export default ExpDisplayer;
