import { Vector2 } from "three";
import Game from "./Game";
import { GAME_EVENT_TYPE } from "../system/Types";
import { PlayerAttackMoveEvent, PlayerMoveEvent } from "events/GameEvents";
import Keyboard from "./Keyboard";

class Controller {
  private game: Game;
  private keyboard: Keyboard = new Keyboard();

  public attackMoveMode = false;

  constructor(game: Game) {
    this.game = game;

    this.keyboard.on(["w", "s", "a", "d"], () => {
      const wPressed = this.keyboard.isPressed("w");
      const sPressed = this.keyboard.isPressed("s");
      const aPressed = this.keyboard.isPressed("a");
      const dPressed = this.keyboard.isPressed("d");

      const moveVector = new Vector2();
      if (wPressed) moveVector.add(new Vector2(0, 1));
      if (sPressed) moveVector.add(new Vector2(0, -1));
      if (aPressed) moveVector.add(new Vector2(-1, 0));
      if (dPressed) moveVector.add(new Vector2(1, 0));

      this.game.createAndEmitGameEvent(
        GAME_EVENT_TYPE.PLAYER_MOVE_KEY_UPDATE,
        new PlayerMoveEvent("me", moveVector.x, moveVector.y)
      );
    });
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
    // switch (e.key) {
    //   case "a":
    //     this.attackMoveMode = !this.attackMoveMode;
    //     break;
    // }
  };

  onDocumentKeyUp = (e: KeyboardEvent) => {
    // switch (e.key) {
    //   case "a":
    //     break;
    // }
  };
}

export default Controller;
