import Layer from "./Layer";
import Drawable from "./Drawable";
import { EVENT_TYPE, LAYER_TYPE } from "./Constants";
import Event from "./Event";
import GameEventHandler from "graphic/engine/GameEventHandler";
import Logger from "./Logger";

class Game {
  private layers: Map<string, Layer<Drawable>>;

  constructor() {
    this.layers = new Map<string, Layer<Drawable>>();
  }

  public applyEvent(e: Event) {
    Logger.debugf(`Game.applyEvent: ${e.type}`, e);
    if (e.type === EVENT_TYPE.GAME) {
      GameEventHandler(e, this);
    }
  }

  public getLayer(name: string): Layer<Drawable> | undefined {
    return this.layers.get(name);
  }

  public setLayer(name: string, layer: Layer<Drawable>) {
    this.layers.set(name, layer);
  }

  private drawLayer(name: string): JSX.Element {
    const layer = this.layers.get(name);
    if (layer) {
      return layer.draw();
    }
    return <></>;
  }

  public update(t: number): void {
    for (const [, layer] of this.layers) {
      layer.update(t);
    }
  }

  public draw(): JSX.Element {
    return (
      <>
        {/* background layer */}
        {this.drawLayer(LAYER_TYPE.BACKGROUND)}
        {/* tile layer */}
        {this.drawLayer(LAYER_TYPE.TILE)}
        {/* item layer */}
        {this.drawLayer(LAYER_TYPE.ITEM)}
        {/* enemy layer */}
        {this.drawLayer(LAYER_TYPE.ENEMY)}
        {/* player layer */}
        {this.drawLayer(LAYER_TYPE.PLAYER)}
      </>
    );
  }
}

export default Game;
