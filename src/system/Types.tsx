export enum OBJECT_DIRECTION {
  LEFT,
  RIGHT,
}

export enum PLAYER_IDENTITY {
  TESTER = "tester",
  RANGER = "ranger",
  WARRIOR = "warrior",
  SUPPORTER = "supporter",
  TANKER = "tanker",
}

export enum LAYER_TYPE {
  ENEMY = "enemy",
  ITEM = "item",
  PLAYER = "player",
  TILE = "tile",
  BACKGROUND = "background",
}

export const EVENT_TYPE = {
  GAME: "game",
};

export const GAME_EVENT_TYPE = {
  PLAYER_MOVE: "player_move",
  PLAYER_ATTACK_MOVE: "player_attack_move",
  PLAYER_MOVE_KEY_DOWN: "player_move_key_down",
  PLAYER_MOVE_KEY_UP: "player_move_key_up",
  PLAYER_MOVE_KEY_UPDATE: "player_move_key_update",
};

export enum UPGRADE_TIER {
  DIAMOND = 1,
  PLATINUM = 2,
  GOLD = 3,
  SILVER = 4,
  BRONZE = 5,
}

export enum FontWeight {
  LIGHTER = "lighter",
  LIGHT = "light",
  NORMAL = "normal",
  BOLD = "bold",
  BOLDER = "bolder",
}
