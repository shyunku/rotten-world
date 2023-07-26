import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Text2D from "../atom/Text2D";
import { RouteContext } from "../main/World";
import Game from "graphic/engine/Game";
import { EnemyLayer } from "graphic/objects/Enemy";
import { Player, PlayerLayer } from "graphic/objects/Player";
import { GAME_EVENT_TYPE, LAYER_TYPE } from "graphic/engine/Constants";
import Ground from "graphic/main/Ground";
import Logger from "graphic/engine/Logger";
import { Vector2 } from "three";
import Event from "graphic/engine/Event";
import { PlayerMoveEvent } from "graphic/events/GameEvents";

const game = new Game();
const enemyLayer = new EnemyLayer();
const playerLayer = new PlayerLayer();

const GameScene = () => {
  const { gameMode } = useContext<any>(RouteContext);
  const [dummy, setDummy] = useState<number>(0);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    // initialize
    const player = new Player("me", "me");
    playerLayer.add(player);
    game.setLayer(LAYER_TYPE.ENEMY, enemyLayer);
    game.setLayer(LAYER_TYPE.PLAYER, playerLayer);
    renderLoop();
  }, []);

  const renderLoop = useCallback(() => {
    // update
    const now = Date.now();
    const timeElapsed = now - lastUpdateTime.current;
    lastUpdateTime.current = now;
    const animationId = requestAnimationFrame(renderLoop);
    game.update(timeElapsed);
    setDummy((prev) => prev + 1);

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
      {/* Ground Plane */}
      <Ground onGroundClick={onMouseRightClick} />
      {/* Game Renderer */}
      {game?.draw()}
      <Text2D text={`${gameMode} mode`} top={30} left={30} fontSize={20} textAlignHorizontal="left" />
    </>
  );
};

export default GameScene;
