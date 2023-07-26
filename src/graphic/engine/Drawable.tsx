import { uuidv4 } from "util/CommonUtil";
import Game from "./Game";

abstract class Drawable {
  public id: string;
  public game: Game | null = null;

  constructor() {
    this.id = uuidv4();
  }

  public setGame(game: Game) {
    this.game = game;
  }

  public abstract update(t: number): void;
  public abstract draw(): JSX.Element;
}

export default Drawable;
