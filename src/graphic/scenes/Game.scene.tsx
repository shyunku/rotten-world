import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Text2D from "../atom/Text2D";
import { RouteContext } from "../main/World";
import Game from "graphic/engine/Game";
import { EnemyLayer, EnemySpawner } from "graphic/objects/Enemy";
import { Player, PlayerLayer } from "graphic/objects/Player";
import { GAME_EVENT_TYPE, LAYER_TYPE } from "graphic/engine/Constants";
import Ground from "graphic/main/Ground";
import Logger from "graphic/engine/Logger";
import { Vector2 } from "three";
import Event from "graphic/engine/Event";
import { PlayerMoveEvent } from "graphic/events/GameEvents";
import { GameStateLog, GameStateLogItem } from "graphic/hooks/GameStateLog";
import { useThree } from "@react-three/fiber";
import AttackRangeDisplayer from "graphic/main/AttackRangeDisplayer";

const game = new Game();
const enemyLayer = new EnemyLayer(game);
const playerLayer = new PlayerLayer(game);
const enemySpawner = new EnemySpawner(game, 60000);

const playerMe = new Player("me");
playerMe.id = "me";
playerMe.hp = 30000;
playerMe.maxHp = 30000;
playerMe.attackRange = 300;
playerMe.hpRegen = 5;
playerMe.armor = 700;
playerLayer.add(playerMe);

const GameScene = () => {
  const { gameMode } = useContext<any>(RouteContext);
  const lastUpdateTime = useRef(Date.now());
  const three = useThree();

  const [, setDummy] = useState<number>(0);

  useEffect(() => {
    // initialize
    game.setThree(three);
    enemySpawner.start(300000);

    game.setLayer(LAYER_TYPE.ENEMY, enemyLayer);
    game.setLayer(LAYER_TYPE.PLAYER, playerLayer);
    renderLoop();

    document.addEventListener("keydown", game.controller.onDocumentKeyDown);
    document.addEventListener("keyup", game.controller.onDocumentKeyUp);

    return () => {
      document.removeEventListener("keydown", game.controller.onDocumentKeyDown);
      document.removeEventListener("keyup", game.controller.onDocumentKeyUp);
    };
  }, []);

  const renderLoop = useCallback(() => {
    // update
    const now = Date.now();
    const timeElapsed = now - lastUpdateTime.current;
    lastUpdateTime.current = now;
    game.update(timeElapsed / 1000);

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
          `Round: ${enemySpawner.round}`,
          `Next Round Remain Time: ${enemySpawner.nextRoundStartTime - Date.now()}ms`,
          `Spawn Interval: ${enemySpawner.spawnInterval}ms`,
          `Spawn Count: ${enemySpawner.spawnCount}`,
          `Paused: ${enemySpawner.paused}`,
        ]}
      />
      {/* Ground Plane */}
      <Ground
        onGroundLeftClick={game.controller.onGroundLeftClick}
        onGroundRightClick={game.controller.onGroundRightClick}
      />
      {/* Attack Range Displayer */}
      {game.controller.attackMoveMode === true && <AttackRangeDisplayer playerMe={playerMe} />}
      {/* Game Renderer */}
      {game?.draw()}
    </>
  );
};

export default GameScene;
