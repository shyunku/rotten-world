export class PlayerMoveEvent {
  public playerId: string;
  public x: number;
  public y: number;

  constructor(playerId: string, x: number, y: number) {
    this.playerId = playerId;
    this.x = x;
    this.y = y;
  }
}

export class PlayerAttackMoveEvent {
  public playerId: string;
  public x: number;
  public y: number;

  constructor(playerId: string, x: number, y: number) {
    this.playerId = playerId;
    this.x = x;
    this.y = y;
  }
}

export class ExpDropEvent {
  public x: number;
  public y: number;
  public exp: number;

  constructor(x: number, y: number, exp: number) {
    this.x = x;
    this.y = y;
    this.exp = exp;
  }
}
