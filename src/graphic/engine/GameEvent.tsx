class GameEvent {
  public type: string;
  public data: any;

  constructor(type: string, data: any) {
    this.type = type;
    this.data = data;
  }

  public static create(type: string, data: any): GameEvent {
    return new GameEvent(type, data);
  }
}

export default GameEvent;
