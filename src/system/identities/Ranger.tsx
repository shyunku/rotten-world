import { Player } from "objects/Player";
import { PLAYER_IDENTITY } from "system/Types";

export class Ranger extends Player {
  constructor(name: string) {
    super(name, PLAYER_IDENTITY.RANGER);
  }
}
