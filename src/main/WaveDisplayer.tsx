import Text2D from "atom/Text2D";
import { FontWeight } from "system/Types";
import { formatTime } from "util/CommonUtil";

const WaveDisplayer = ({ remainTime }: any) => {
  return (
    <Text2D text={`${formatTime(remainTime)}`} top={70} left={0} right={0} fontSize={38} fontWeight={FontWeight.BOLD} />
  );
};

export default WaveDisplayer;
