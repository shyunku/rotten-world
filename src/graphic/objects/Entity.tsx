import Drawable from "graphic/engine/Drawable";
import { Vector2 } from "three";

export class Entity extends Drawable {
  public name: string;

  public level: number;
  public hp: number;
  public maxHp: number;
  public attackDamage: number;
  public attackSpeed: number;
  public attackRange: number;
  public moveSpeed: number;

  public armor: number;
  public slowResist: number;
  public stunResist: number;
  public knockbackResist: number;

  public hpRegen: number;
  public hpRegenRate: number;

  // transform
  public pos: [number, number];
  public destPos: [number, number];
  public scale: [number, number];
  public direction: number;

  constructor(id: string, name: string) {
    super(id);

    this.id = id;
    this.name = name;

    this.level = 1;
    this.hp = 1;
    this.maxHp = 1;
    this.attackDamage = 1;
    this.attackSpeed = 0;
    this.attackRange = 0;
    this.moveSpeed = 0;

    this.armor = 0;
    this.slowResist = 0;
    this.stunResist = 0;
    this.knockbackResist = 0;

    this.hpRegen = 0;
    this.hpRegenRate = 0;

    this.pos = [0, 0];
    this.destPos = [0, 0];
    this.scale = [1, 1];
    this.direction = 0;
  }

  public update(t: number): void {
    if (!(this.pos[0] == this.destPos[0] && this.pos[1] == this.destPos[1])) {
      // move
      const dx = this.destPos[0] - this.pos[0];
      const dy = this.destPos[1] - this.pos[1];
      const vec = new Vector2(dx, dy);
      vec.normalize();
      vec.multiplyScalar(this.moveSpeed);
      this.pos[0] += (vec.x * t) / 1000;
      this.pos[1] += (vec.y * t) / 1000;
    }
  }

  public draw(): JSX.Element {
    throw new Error("Method not implemented.");
  }
}
