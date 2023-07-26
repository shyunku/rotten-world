import Drawable from "./Drawable";

abstract class Layer<T extends Drawable> {
  public gameObjects: Map<string, T>;

  constructor() {
    this.gameObjects = new Map<string, T>();
  }

  public get(id: string): T | undefined {
    return this.gameObjects.get(id);
  }

  public add(gameObject: T) {
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
