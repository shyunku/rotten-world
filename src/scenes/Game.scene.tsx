import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RouteContext } from "../main/World";
import { useThree } from "@react-three/fiber";
import Game from "controls/Game";
import { EnemyLayer } from "objects/Enemy";
import { Player, PlayerLayer } from "objects/Player";
import { RangerUpgradeDamageUp, RangerUpgradeInfiniteAttackSpeedUp } from "system/upgrades/RangerUpgrades";
import { LAYER_TYPE } from "system/Types";
import { GameStateLog } from "main/GameStateLog";
import ExpDisplayer from "main/ExpDisplayer";
import Ground from "main/Ground";
import AttackRangeDisplayer from "main/AttackRangeDisplayer";
import StatDisplayer from "main/StatDisplayer";
import { Tester } from "system/identities/Tester";
import { Selection, Select, EffectComposer, Outline } from "@react-three/postprocessing";
import { Color } from "three";
import EntityStatDisplayer from "main/EntityStatDisplayer";
import WaveDisplayer from "main/WaveDisplayer";
import { ExpBallLayer } from "objects/ExpBall";
import TestEnemySpawner from "system/spawners/TestEnemySpawner";

const WHITE_COLOR_CODE = new Color("#ffffff").getHex();

const game = new Game();
const enemyLayer = new EnemyLayer(game);
const playerLayer = new PlayerLayer(game);
const expBallLayer = new ExpBallLayer(game);
const enemySpawner = new TestEnemySpawner(game);

const me = new Tester("me");
me.id = "me";
// me.addUpgrade(new RangerUpgradeDamageUp());
me.addUpgrade(new RangerUpgradeInfiniteAttackSpeedUp());
playerLayer.add(me);

const GameScene = () => {
  const { gameMode } = useContext<any>(RouteContext);
  const lastUpdateTime = useRef(Date.now());
  const dt = useRef(0);
  const frameCount = useRef(0);
  const three = useThree();

  const [, setDummy] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    // initialize
    game.setThree(three);
    game.setEnemySpawner(enemySpawner);
    game.setLayer(LAYER_TYPE.ENEMY, enemyLayer);
    game.setLayer(LAYER_TYPE.PLAYER, playerLayer);
    game.setLayer(LAYER_TYPE.EXP_BALL, expBallLayer);
    game.start();
    renderLoop();

    const fpsThread = setInterval(() => {
      // finalize (after 1 second)
      setFps(frameCount.current);
      frameCount.current = 0;
    }, 1000);

    document.addEventListener("keydown", game.controller.onDocumentKeyDown);
    document.addEventListener("keyup", game.controller.onDocumentKeyUp);

    return () => {
      document.removeEventListener("keydown", game.controller.onDocumentKeyDown);
      document.removeEventListener("keyup", game.controller.onDocumentKeyUp);
      clearInterval(fpsThread);
    };
  }, []);

  const renderLoop = useCallback(() => {
    // update
    const now = Date.now();
    const timeElapsed = now - lastUpdateTime.current;
    lastUpdateTime.current = now;
    game.update(timeElapsed / 1000);
    dt.current = timeElapsed / 1000;

    frameCount.current++;
    setDummy((prev) => prev + 1);

    const animationId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight color="white" intensity={1} />
      {/* State Log */}
      <GameStateLog
        logs={[
          `Game Mode: ${gameMode}`,
          `FPS: ${fps}`,
          ``,
          `Spawn Count: ${enemySpawner.spawnCount}`,
          `Paused: ${enemySpawner.paused}`,
          `Enemy Count: ${enemyLayer.gameObjects.size}`,
          `Player Count: ${playerLayer.gameObjects.size}`,
          `Player moving: ${me.moving}`,
          `Player attack targets: ${me
            .collectAttackableEntities()
            .map((e) => e.name)
            .join(", ")}`,
          `Player attack remain cooldown: ${Math.max(me.nextAttackTime - Date.now(), 0)}ms`,
          `Player attack idle: ${me.attackIdle}`,
          ``,
          `Player Upgrades:`,
          ...Array.from(me.upgrades).map(([, upgrade]) => upgrade.getCalculatedDescription()),
        ]}
      />
      {/* Ground Plane */}
      <Ground
        onGroundLeftClick={game.controller.onGroundLeftClick}
        onGroundRightClick={game.controller.onGroundRightClick}
      />
      {/* Attack Range Displayer */}
      {game.controller.attackMoveMode === true && <AttackRangeDisplayer playerMe={me} />}
      {/* Exp Displayer */}
      <ExpDisplayer curExp={me.exp.current} maxExp={me.exp.max} bgColor="#555" fgColor="#47d" t={dt.current} />
      {/* Stat Displayer */}
      <StatDisplayer playerMe={me} />
      {/* Round time displayer */}
      <WaveDisplayer remainTime={game.timer} />
      {/* Entity Stat Displayer */}
      {game.selectedEntity && !game.selectedEntity.disabled && <EntityStatDisplayer entity={game.selectedEntity} />}
      {/* Game Renderer */}
      <Selection>
        <EffectComposer multisampling={3} autoClear={false}>
          <Outline blur visibleEdgeColor={WHITE_COLOR_CODE} edgeStrength={100} width={1000} />
        </EffectComposer>
        {game?.draw()}
      </Selection>
    </>
  );
};

export default GameScene;
