import { useThree } from "@react-three/fiber";
import Box2D from "atom/Box2D";
import Text2D from "atom/Text2D";
import useAnimatedNumber from "hooks/useAnimatedNumber";
import useAnimatedNumberDisplay from "hooks/useAnimatedNumberDisplay";

interface ExpDisplayerProps {
  curExp: number;
  maxExp: number;
  bgColor?: string;
  fgColor?: string;
  t: number;
}

export const EXP_DISPLAYER_HEIGHT = 18;

const ExpDisplayer = (props: ExpDisplayerProps) => {
  const { size } = useThree();
  const { width, height } = size;
  const topY = EXP_DISPLAYER_HEIGHT - height / 2;

  const { value, fixed } = useAnimatedNumberDisplay({ value: props.curExp, asr: 0.99, t: props.t });

  return (
    <>
      <Box2D x={-width / 2} y={topY} width={width} height={EXP_DISPLAYER_HEIGHT} color={props.bgColor ?? "black"} />
      <Box2D
        x={-width / 2}
        y={topY}
        width={(width * value) / props.maxExp}
        height={EXP_DISPLAYER_HEIGHT}
        color={props.fgColor ?? "green"}
      />
      <Text2D
        text={`${props.curExp}/${props.maxExp}`}
        bottom={EXP_DISPLAYER_HEIGHT / 2}
        color={"#ccc"}
        z={0.2}
        fontSize={13}
      />
    </>
  );
};

export default ExpDisplayer;
