import { PlayerMoveEvent } from "graphic/events/GameEvents";
import { GAME_EVENT_TYPE } from "./Constants";
import Event from "./Event";
import Game from "./Game";
import GameEvent from "./GameEvent";
import Logger from "./Logger";
import { Player, PlayerLayer } from "graphic/objects/Player";
import Layer from "./Layer";
import Drawable from "./Drawable";

const GameEventHandler = (event: Event, g: Game) => {
  const gameEvent = event.subEventData as GameEvent;
  Logger.debugf(`GameEventHandler: ${gameEvent.type}`, event);
  switch (gameEvent.type) {
    case GAME_EVENT_TYPE.PLAYER_MOVE:
      handlePlayerMove(event, event.subEventData as GameEvent, g);
  }
};

function handlePlayerMove(event: Event, gameEvent: GameEvent, g: Game) {
  const data: PlayerMoveEvent = gameEvent.data;
  const playerLayer: Layer<Drawable> | undefined = g.getLayer("player");
  if (!playerLayer) {
    Logger.warn("handlePlayerMove: playerLayer is undefined");
    return;
  }
  const player: Drawable | undefined = playerLayer.get(data.playerId);
  if (!player) {
    Logger.warn("handlePlayerMove: player is undefined");
    return;
  }
  if (!(player instanceof Player)) {
    Logger.warn("handlePlayerMove: player is not Player");
    return;
  }
  player.move(data.x, data.y);
}

export default GameEventHandler;
