import Text2D from "../atom/Text2D";
import Button2D from "../atom/Button2D";
import { useContext } from "react";
import { RouteContext } from "../main/World";
import Logger from "../engine/Logger";
import Box2D from "graphic/atom/Box2D";
import { useThree } from "@react-three/fiber";

const HomeScene = () => {
  const { setGameMode, setUrl } = useContext<any>(RouteContext);

  const { width, height } = useThree().size;

  const onSinglePlayStart = () => {
    setGameMode("singleplay");
    setUrl("game");
    Logger.info("singleplay start.");
  };

  const onMultiPlayStart = () => {
    setGameMode("multiplay");
    setUrl("game");
    Logger.info("multiplay start.");
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight color="white" intensity={1} />
      {/* Background */}
      <Box2D x={-width / 2} y={height / 2} z={0} width={width} height={height} color="#851" />
      {/* Title */}
      <Text2D text="Rotten World" top={170} fontSize={80} z={1} color={"#eca"} />
      {/* Single Game Start Button */}
      <Button2D
        text="Singleplayer"
        top={400}
        color={"#cba"}
        bgColor="#ccc"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={onSinglePlayStart}
        z={1}
      />
      {/* Multiplay Game Start Button */}
      <Button2D
        text="Multiplayer"
        top={500}
        color={"#cba"}
        bgColor="#ccc"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={onMultiPlayStart}
        z={1}
      />
      {/* Settings Button */}
      <Button2D
        text="Settings"
        top={600}
        color={"#cba"}
        bgColor="#ccc"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={() => {
          console.log("clicked!!!");
        }}
        z={1}
      />
      {/* Exit Button */}
      <Button2D
        text="Exit"
        top={700}
        color={"#cba"}
        bgColor="#ccc"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={() => {
          console.log("clicked!!!");
        }}
        z={1}
      />
    </>
  );
};

export default HomeScene;
