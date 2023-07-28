import { Box } from "@react-three/drei";
import Text2D from "graphic/atom/Text2D";
import Drawable from "graphic/engine/Drawable";
import Game from "graphic/engine/Game";
import { Fragment } from "react";
import { Vector2 } from "three";
import { calcFraction } from "util/GameUtil";

const HEALTH_WIDTH = 50;
const HEALTH_HEIGHT = 8;

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
  public pos: Vector2;
  public destPos: Vector2;
  public scale: [number, number];
  public direction: number;

  private moving = false;

  constructor(name: string) {
    super();

    this.name = name;

    this.level = 1;
    this.hp = 1;
    this.maxHp = 1;
    this.attackDamage = 1;
    this.attackSpeed = 1;
    this.attackRange = 0;
    this.moveSpeed = 0;

    this.armor = 0;
    this.slowResist = 0; // TODO: implement
    this.stunResist = 0; // TODO: implement
    this.knockbackResist = 0; // TODO: implement

    this.hpRegen = 0;
    this.hpRegenRate = 0; // TODO: implement

    this.pos = new Vector2(0, 0);
    this.destPos = new Vector2(0, 0);
    this.scale = [1, 1];
    this.direction = 0;
  }

  public applyDamage(damage: number): void {
    // apply armor
    const damageReduction = calcFraction(this.armor);
    this.hp -= damage * (1 - damageReduction);
    if (this.hp < 0) {
      this.hp = 0;
    }
  }

  protected applyHealthGen(t: number): void {
    this.hp += this.hpRegen * t;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }

  public update(t: number): void {
    if (!this.pos.equals(this.destPos)) {
      // move
      const vec = this.destPos.clone().sub(this.pos);
      const distance = vec.length();
      const moveDistance = this.moveSpeed * t;

      if (distance < moveDistance) {
        this.pos.set(this.destPos.x, this.destPos.y);
        this.moving = false;
      } else {
        vec.normalize();
        vec.multiplyScalar(this.moveSpeed);
        this.pos.addScaledVector(vec, t);
        this.moving = true;
      }
    } else {
      this.moving = false;
    }

    // health regen
    if (this.hp < this.maxHp) {
      this.hp += this.hpRegen * t;
      if (this.hp > this.maxHp) {
        this.hp = this.maxHp;
      }
    }
  }

  protected drawHealthBar(color: string): JSX.Element {
    return (
      <Fragment key={this.id}>
        <Box args={[HEALTH_WIDTH, HEALTH_HEIGHT, 0.1]} position={[this.pos.x, this.pos.y + 20, 0]}>
          <meshBasicMaterial color="black" />
        </Box>
        <Box
          args={[HEALTH_WIDTH * (this.hp / this.maxHp), HEALTH_HEIGHT, 0.1]}
          position={[this.pos.x - HEALTH_WIDTH / 2 + (HEALTH_WIDTH * (this.hp / this.maxHp)) / 2, this.pos.y + 20, 0]}
        >
          <meshBasicMaterial color={color} />
        </Box>
        <Text2D
          text={`${Math.ceil(this.hp)} / ${Math.ceil(this.maxHp)}`}
          fontSize={10}
          x={this.pos.x}
          y={this.pos.y + 35}
        />
      </Fragment>
    );
  }

  public draw(): JSX.Element {
    throw new Error("Method not implemented.");
  }
}
