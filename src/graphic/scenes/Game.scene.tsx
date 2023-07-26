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

const game = new Game();
const enemyLayer = new EnemyLayer(game);
const playerLayer = new PlayerLayer(game);
const enemySpawner = new EnemySpawner(game, 30000);

const GameScene = () => {
  const { gameMode } = useContext<any>(RouteContext);
  const [dummy, setDummy] = useState<number>(0);
  const lastUpdateTime = useRef(Date.now());
  const three = useThree();

  useEffect(() => {
    // initialize
    const player = new Player("me");
    player.id = "me";
    player.hp = 30000;
    player.maxHp = 30000;
    player.hpRegen = 5;
    player.armor = 700;
    playerLayer.add(player);

    game.setThree(three);

    enemySpawner.start(5000);

    game.setLayer(LAYER_TYPE.ENEMY, enemyLayer);
    game.setLayer(LAYER_TYPE.PLAYER, playerLayer);
    renderLoop();
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

  const emitGameEvent = useCallback((e: Event) => {
    // emit game event
    game.applyEvent(e);

    // TODO :: send event to server
    // TODO :: receive event from server and route to game
  }, []);

  const createAndEmitGameEvent = useCallback(
    (type: string, subEventData: any) => {
      const newEvent = Event.createGameEvent(type, subEventData);
      emitGameEvent(newEvent);
    },
    [emitGameEvent]
  );

  // controller
  const onMouseRightClick = useCallback((v: Vector2) => {
    createAndEmitGameEvent(GAME_EVENT_TYPE.PLAYER_MOVE, new PlayerMoveEvent("me", v.x, v.y));
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
      <Ground onGroundClick={onMouseRightClick} />
      {/* Game Renderer */}
      {game?.draw()}
    </>
  );
};

export default GameScene;
