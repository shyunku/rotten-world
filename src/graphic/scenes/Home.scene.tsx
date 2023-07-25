import Text2D from "../atom/Text2D";
import Button2D from "../atom/Button2D";
import { useContext } from "react";
import { RouteContext } from "../main/World";

const HomeScene = () => {
  const { setGameMode, setUrl } = useContext<any>(RouteContext.Consumer);

  const onSinglePlayStart = () => {
    console.log("singleplay start.");
    setGameMode("singleplay");
  };

  const onMultiPlayStart = () => {
    console.log("multiplay start.");
    setGameMode("multiplay");
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight color="white" intensity={1} />
      {/* Title */}
      <Text2D text="NPM SURVIVAL" top={170} fontSize={80} />
      {/* Single Game Start Button */}
      <Button2D
        text="Singleplayer"
        top={400}
        bgColor="#222222"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={onSinglePlayStart}
      />
      {/* Multiplay Game Start Button */}
      <Button2D
        text="Multiplayer"
        top={500}
        bgColor="#222222"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={onMultiPlayStart}
      />
      {/* Settings Button */}
      <Button2D
        text="Settings"
        top={600}
        bgColor="#222222"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={() => {
          console.log("clicked!!!");
        }}
      />
      {/* Exit Button */}
      <Button2D
        text="Exit"
        top={700}
        bgColor="#222222"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={() => {
          console.log("clicked!!!");
        }}
      />
    </>
  );
};

export default HomeScene;
