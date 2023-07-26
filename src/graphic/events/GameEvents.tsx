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
