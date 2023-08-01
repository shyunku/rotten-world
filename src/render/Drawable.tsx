import { uuidv4 } from "util/CommonUtil";
import Game from "../controls/Game";

abstract class Drawable {
  public id: string;
  public disabled = false;
  public game: Game | null = null;
  public layer: string | null = null;

  constructor() {
    this.id = uuidv4();
    this.layer = null;
  }

  public setGame(game: Game) {
    this.game = game;
  }

  public destroy() {
    this.disabled = true;
    if (this.game) {
      this.game.remove(this);
    }
  }

  public abstract update(t: number): void;
  public abstract draw(): JSX.Element;
}

export default Drawable;
