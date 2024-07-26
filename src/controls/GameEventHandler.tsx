import { PlayerMoveEvent } from "events/GameEvents";
import { GAME_EVENT_TYPE } from "../system/Types";
import Event from "../events/Event";
import Game from "./Game";
import GameEvent from "../events/GameEvent";
import Logger from "../modules/Logger";
import { Player } from "objects/Player";
import Layer from "../render/Layer";
import Drawable from "../render/Drawable";

const GameEventHandler = (event: Event, g: Game) => {
  const gameEvent = event.subEventData as GameEvent;
  // Logger.debugf(`GameEventHandler: ${gameEvent.type}`, event);
  switch (gameEvent.type) {
    // case GAME_EVENT_TYPE.PLAYER_MOVE:
    //   handlePlayerMove(event, event.subEventData as GameEvent, g);
    //   break;
    // case GAME_EVENT_TYPE.PLAYER_ATTACK_MOVE:
    //   handlePlayerAttackMove(event, event.subEventData as GameEvent, g);
    //   break;
    case GAME_EVENT_TYPE.PLAYER_MOVE_KEY_UPDATE:
      handlePlayerKeyMove(event, event.subEventData as GameEvent, g);
      break;
  }
};

function handlePlayerKeyMove(event: Event, gameEvent: GameEvent, g: Game) {
  const data: PlayerMoveEvent = gameEvent.data;
  const player = getPlayer(g, data.playerId);
  if (!player) return;
  console.log(data);
  if (data.x === 0 && data.y === 0) {
    player.stopMove();
    return;
  }
  player.move(data.x * g.worldSize.width, data.y * g.worldSize.height);
}

function handlePlayerMove(event: Event, gameEvent: GameEvent, g: Game) {
  const data: PlayerMoveEvent = gameEvent.data;
  const player = getPlayer(g, data.playerId);
  if (!player) return;
  player.move(data.x, data.y);
}

function handlePlayerAttackMove(event: Event, gameEvent: GameEvent, g: Game) {
  const data: PlayerMoveEvent = gameEvent.data;
  const player = getPlayer(g, data.playerId);
  if (!player) return;
  player.attackMove(data.x, data.y);
}

function getPlayer(g: Game, playerId: string): Player | undefined {
  const playerLayer: Layer<Drawable> | undefined = g.getLayer("player");
  if (!playerLayer) {
    Logger.warn("handlePlayerMove: playerLayer is undefined");
    return;
  }
  const player: Drawable | undefined = playerLayer.get(playerId);
  if (!player) {
    Logger.warn("handlePlayerMove: player is undefined");
    return;
  }
  if (!(player instanceof Player)) {
    Logger.warn("handlePlayerMove: player is not Player");
    console.log(player);
    return;
  }
  return player;
}

export default GameEventHandler;
