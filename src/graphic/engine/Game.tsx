import Layer from "./Layer";
import Drawable from "./Drawable";
import { EVENT_TYPE, LAYER_TYPE } from "./Constants";
import Event from "./Event";
import GameEventHandler from "graphic/engine/GameEventHandler";
import Logger from "./Logger";
import { RootState, useThree } from "@react-three/fiber";
import Controller from "./Controller";
import Pair from "./Pair";

class Game {
  private layers: Map<string, Layer<Drawable>>;
  public three: RootState | null = null;
  public controller: Controller;

  constructor() {
    this.layers = new Map<string, Layer<Drawable>>();
    this.controller = new Controller(this);
  }

  public setThree(three: RootState) {
    this.three = three;
  }

  public createAndEmitGameEvent(type: string, subEventData: any) {
    const newEvent = Event.createGameEvent(type, subEventData);
    this.applyEvent(newEvent);
  }

  public applyEvent(e: Event) {
    // TODO :: send event to server
    // TODO :: receive event from server and route to game
    Logger.debugf(`Game.applyEvent: ${e.type} ${e.subEventData.type}`);
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

  public remove(object: Drawable) {
    if (!object.layer) return;
    const layer = this.layers.get(object.layer);
    if (layer) {
      layer.gameObjects.delete(object.id);
      Logger.debugf(`Game.remove: ${object.id} ${object.layer}`);
    }
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
