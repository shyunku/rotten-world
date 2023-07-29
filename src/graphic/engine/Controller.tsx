import { Vector2 } from "three";
import Game from "./Game";
import { GAME_EVENT_TYPE } from "./Constants";
import { PlayerAttackMoveEvent, PlayerMoveEvent } from "graphic/events/GameEvents";

class Controller {
  private game: Game;
  public attackMoveMode = false;

  constructor(game: Game) {
    this.game = game;
  }

  onGroundLeftClick = (v: Vector2) => {
    if (this.attackMoveMode) {
      this.game.createAndEmitGameEvent(GAME_EVENT_TYPE.PLAYER_ATTACK_MOVE, new PlayerAttackMoveEvent("me", v.x, v.y));
    }
    this.attackMoveMode = false;
  };

  onGroundRightClick = (v: Vector2) => {
    this.game.createAndEmitGameEvent(GAME_EVENT_TYPE.PLAYER_MOVE, new PlayerMoveEvent("me", v.x, v.y));
    this.attackMoveMode = false;
  };

  onDocumentKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "a":
        this.attackMoveMode = !this.attackMoveMode;
        break;
    }
  };

  onDocumentKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "a":
        break;
    }
  };
}

export default Controller;
