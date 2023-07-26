import Layer from "graphic/engine/Layer";
import { Entity } from "graphic/objects/Entity";

export class Enemy extends Entity {
  constructor(id: string, name: string) {
    super(id, name);
  }
}

export class EnemyLayer extends Layer<Enemy> {
  constructor() {
    super();
  }
}
