import Text2D from "graphic/atom/Text2D";
import { useState } from "react";

export const GameStateLogItem = ({ text, top, left }: any) => {
  return (
    <Text2D
      text={text}
      top={top}
      left={left}
      textAlignHorizontal="left"
      textAlignVertical="top"
      fontSize={12}
      color="#ddd"
    />
  );
};

export const GameStateLog = ({ logs }: any) => {
  return (
    <>
      {logs.map((log: any, index: number) => {
        return <GameStateLogItem key={index} text={log} top={(index + 1) * 15} left={20} />;
      })}
    </>
  );
};
