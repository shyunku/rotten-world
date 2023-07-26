import Drawable from "./Drawable";
import Game from "./Game";

abstract class Layer<T extends Drawable> {
  public gameObjects: Map<string, T>;
  private game: Game;

  constructor(game: Game) {
    this.gameObjects = new Map<string, T>();
    this.game = game;
  }

  public get(id: string): T | undefined {
    return this.gameObjects.get(id);
  }

  public add(gameObject: T) {
    gameObject.setGame(this.game);
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
      jsxList.push(gameObject.draw());
    }
    return <>{jsxList}</>;
  }
}

export default Layer;
