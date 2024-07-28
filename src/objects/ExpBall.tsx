import { Vector2 } from "three";
import { Entity } from "./Entity";
import { uuidv4 } from "util/CommonUtil";
import Circle2D from "atom/Circle2D";
import Layer from "render/Layer";
import Drawable from "render/Drawable";
import Game from "controls/Game";
import { LAYER_TYPE } from "system/Types";

export class ExpBall extends Drawable {
  public id: string;
  public exp: number;
  public attractedBy: Entity | null = null;
  public initialPos: Vector2;
  public pos: Vector2;

  constructor(exp: number, x: number, y: number) {
    super();

    this.id = uuidv4();
    this.exp = exp;
    this.initialPos = this.pos = new Vector2(x, y);
  }

  public attractBy(entity: Entity) {
    if (this.attractedBy) return;
    this.attractedBy = entity;
  }

  public unAttackedBy(entity: Entity) {
    if (this.attractedBy === entity) {
      this.attractedBy = null;
    }
  }

  private calcSpeed(): number {
    if (!this.attractedBy) return 0;
    const distance = this.pos.distanceTo(this.attractedBy.pos);
    return 12000 / (distance + 1);
  }

  public update(game: Game, t: number): void {
    if (this.attractedBy) {
      const dir = this.attractedBy.pos.clone().sub(this.pos).normalize();
      this.pos.add(dir.multiplyScalar(this.calcSpeed() * t));
      if (this.pos.distanceTo(this.attractedBy.pos) < 10) {
        this.attractedBy.applyExp(this.exp);
        this.destroy();
      }
    }
  }

  public draw(): JSX.Element {
    return <Circle2D key={this.id} pos={this.pos} radius={5} color="#52D2FF" />;
  }
}

export class ExpBallLayer extends Layer<ExpBall> {
  constructor(game: Game) {
    super(game, LAYER_TYPE.EXP_BALL);
  }
}
