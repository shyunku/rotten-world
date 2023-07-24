import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Text2D from "../atom/Text2D";
import Button2D from "../atom/Button2D";

const HomeScene = () => {
  const three = useThree();
  return (
    <>
      {/* Lighting */}
      <ambientLight color="white" intensity={1} />
      {/* Title */}
      <Text2D text="NPM SURVIVAL" top={170} fontSize={80} />
      {/* Single Game Start Button */}
      <Button2D
        text="Single Player"
        top={400}
        bgColor="#222222"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={() => {
          console.log("clicked!!!");
        }}
      />
      {/* Multiplay Game Start Button */}
      <Button2D
        text="Multi Player"
        top={500}
        bgColor="#222222"
        fontSize={30}
        width={300}
        height={50}
        opacity={0.2}
        onPress={() => {
          console.log("clicked!!!");
        }}
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
