import Drawable from "./Drawable";
import Game from "../controls/Game";

abstract class Layer<T extends Drawable> {
  public gameObjects: Map<string, T>;
  private game: Game;
  private name: string;

  constructor(game: Game, name: string) {
    this.gameObjects = new Map<string, T>();
    this.game = game;
    this.name = name;
  }

  public get(id: string): T | undefined {
    return this.gameObjects.get(id);
  }

  public add(gameObject: T) {
    gameObject.setGame(this.game);
    gameObject.layer = this.name;
    this.gameObjects.set(gameObject.id, gameObject);
  }

  public addObjects(gameObjects: T[]) {
    for (const gameObject of gameObjects) {
      this.add(gameObject);
    }
  }

  public update(t: number): void {
    for (const [, gameObject] of this.gameObjects) {
      gameObject.update(t);
    }
  }

  public draw(): JSX.Element {
    const jsxList: JSX.Element[] = [];
    for (const [, gameObject] of this.gameObjects) {
      if (gameObject.disabled) continue;
      jsxList.push(gameObject.draw());
    }
    return <>{jsxList}</>;
  }
}

export default Layer;
