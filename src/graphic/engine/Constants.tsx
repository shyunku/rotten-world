export enum OBJECT_DIRECTION {
  LEFT,
  RIGHT,
}

export const LAYER_TYPE = {
  ENEMY: "enemy",
  ITEM: "item",
  PLAYER: "player",
  TILE: "tile",
  BACKGROUND: "background",
};

export const EVENT_TYPE = {
  GAME: "game",
};

export const GAME_EVENT_TYPE = {
  PLAYER_MOVE: "player_move",
  PLAYER_ATTACK_MOVE: "player_attack_move",
};

export enum UPGRADE_TIER {
  DIAMOND = 1,
  PLATINUM = 2,
  GOLD = 3,
  SILVER = 4,
  BRONZE = 5,
}
