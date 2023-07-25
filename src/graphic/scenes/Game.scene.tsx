import Text2D from "../atom/Text2D";

const GameScene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight color="white" intensity={1} />
      {}
      <Text2D text="single play mode" top={30} left={30} fontSize={20} textAlignHorizontal="left" />
    </>
  );
};

export default GameScene;
