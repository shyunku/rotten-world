import { Canvas } from "@react-three/fiber";
import { Suspense, createContext, useEffect, useMemo, useState } from "react";
import HomeScene from "../scenes/Home.scene";
import { NoToneMapping } from "three";
import GameScene from "../scenes/Game.scene";
import Logger from "../engine/Logger";

export const RouteContext = createContext({
  url: "",
  setUrl: (url: string) => {},
  gameMode: "",
  setGameMode: (gameMode: string) => {},
});

const World = () => {
  const [url, setUrl] = useState<string>("home");
  const [gameMode, setGameMode] = useState<string | null>(null);

  const routeCtx: any = useMemo(
    () => ({
      url,
      setUrl,
      gameMode,
      setGameMode,
    }),
    [url, gameMode]
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Canvas
        camera={{
          position: [0, 0, 1000],
          zoom: 1,
          near: 0.1,
          far: 1000,
        }}
        linear={true}
        orthographic={true}
        gl={{ antialias: true, toneMapping: NoToneMapping }}
      >
        <Logger.Logger maxSize={60} />
        <RouteContext.Provider value={routeCtx}>
          {
            {
              home: <HomeScene />,
              game: <GameScene />,
            }[url || "home"]
          }
        </RouteContext.Provider>
      </Canvas>
    </Suspense>
  );
};

export default World;
