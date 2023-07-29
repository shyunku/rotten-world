import { Box } from "@react-three/drei";
import { assert } from "console";
import Text2D from "graphic/atom/Text2D";
import { LAYER_TYPE } from "graphic/engine/Constants";
import Drawable from "graphic/engine/Drawable";
import Game from "graphic/engine/Game";
import { Fragment } from "react";
import { Vector2 } from "three";
import { calcFraction } from "util/GameUtil";

const HEALTH_WIDTH = 50;
const HEALTH_HEIGHT = 8;

export class NearestEntityInfo {
  public entity: Entity;
  public distance: number;

  constructor(entity: Entity, distance: number) {
    this.entity = entity;
    this.distance = distance;
  }
}

export class Entity extends Drawable {
  public name: string;

  public level: number;
  public exp: number;
  public maxExp: number;
  public expDrop: number;

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

  // state
  public moving: boolean;
  public nextAttackTime: number;
  public attackingTarget: Entity | null;
  public attackMoving = false;

  constructor(name: string) {
    super();

    this.name = name;

    this.level = 1;
    this.exp = 0;
    this.maxExp = 1;
    this.expDrop = 0;

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

    this.moving = false;
    this.attackingTarget = null;
    this.nextAttackTime = 0;
  }

  public applyDamage(damage: number, by: Entity): void {
    // apply armor
    const damageReduction = calcFraction(this.armor);
    this.hp -= damage * (1 - damageReduction);
    if (this.hp <= 0) {
      this.hp = 0;
      this.destroy();
      by.applyExp(this.expDrop);
    }
  }

  protected applyHealthGen(t: number): void {
    if (this.disabled) return;
    this.hp += this.hpRegen * t;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }

  public applyExp(exp: number): void {
    this.exp += exp;
    while (this.exp >= this.maxExp) {
      this.exp -= this.maxExp;
      this.levelUp();
    }
  }

  protected levelUp(): void {
    this.level++;
  }

  protected healAll(): void {
    this.hp = this.maxHp;
  }

  public move(x: number, y: number) {
    this.destPos.set(x, y);
    this.attackMoving = false;
    this.attackingTarget = null;
  }

  public attackMove(x: number, y: number) {
    this.destPos.set(x, y);
    this.attackMoving = true;
  }

  protected getNearestEntity(layerName: string): NearestEntityInfo | null {
    const game = this.game as Game;
    const layer = game.getLayer(layerName);
    if (layer) {
      const entities = layer.gameObjects as Map<string, Entity>;
      const entitiesWithDist = [];
      for (const [, entity] of entities) {
        if (entity.disabled) continue;
        const distance = this.pos.distanceTo(entity.pos);
        entitiesWithDist.push({ entity, distance });
      }
      entitiesWithDist.sort((a, b) => a.distance - b.distance);
      if (entitiesWithDist.length > 0) {
        const nearestEntity = entitiesWithDist[0].entity;
        const distance = nearestEntity.pos.distanceTo(this.pos);
        return new NearestEntityInfo(nearestEntity, distance);
      }
    }
    return null;
  }

  public update(t: number): void {
    if (this.attackingTarget != null) {
      if (this.attackingTarget.disabled || this.attackingTarget.pos.distanceTo(this.pos) > this.attackRange) {
        this.attackingTarget = null;
      }
    }

    this.moving = false;
    if (!this.pos.equals(this.destPos)) {
      // move
      const vec = this.destPos.clone().sub(this.pos);
      const distance = vec.length();
      const moveDistance = this.moveSpeed * t;

      if (distance < moveDistance) {
        this.pos.set(this.destPos.x, this.destPos.y);

        // attack move
        if (this.attackMoving) {
          this.attackMoving = false;
        }
      } else {
        // if target exists
        if (this.attackingTarget != null) {
          const dVec = this.attackingTarget.pos.clone().sub(this.pos);
          const distance = dVec.length();
          if (distance <= this.attackRange) {
            // attacking entity if in range
            if (Date.now() >= this.nextAttackTime) {
              this.nextAttackTime = Date.now() + 1000 / this.attackSpeed;
              this.attackingTarget.applyDamage(this.attackDamage, this);
            }
          }
        } else {
          vec.normalize();
          vec.multiplyScalar(this.moveSpeed);
          this.pos.addScaledVector(vec, t);
          this.moving = true;
        }
      }
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
