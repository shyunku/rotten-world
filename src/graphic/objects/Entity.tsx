import { Box } from "@react-three/drei";
import { assert } from "console";
import Box2D from "graphic/atom/Box2D";
import Text2D from "graphic/atom/Text2D";
import { LAYER_TYPE } from "graphic/engine/Constants";
import Drawable from "graphic/engine/Drawable";
import EntityStatManager from "graphic/engine/EntityStatManager";
import Game from "graphic/engine/Game";
import LimitedStat from "graphic/engine/LimitedStat";
import Logger from "graphic/engine/Logger";
import Stat from "graphic/engine/Stat";
import Upgrade from "graphic/engine/Upgrade";
import { RangerUpgradeInfiniteAttackSpeedUp } from "graphic/engine/upgrades/RangerUpgrades";
import { UPGRADES } from "graphic/engine/upgrades/TooltipValues";
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

  public level: number; // 레벨
  public exp: LimitedStat; // 경험치
  public expDrop: number; // 죽었을 때 주는 경험치

  public hp: LimitedStat; // 체력
  public hpRegen: number;

  public attackDamage: Stat; // 기본 공격력
  public attackSpeed: Stat; // 기본 공격 속도
  public attackRange: Stat; // 기본 공격 사거리
  public moveSpeed: Stat; // 이동 속도
  public armor: Stat;

  public slowResist: number;
  public stunResist: number;
  public knockbackResist: number;

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

  public upgrades: Map<string, Upgrade>;
  public statManager: EntityStatManager;

  constructor(name: string) {
    super();

    this.name = name;

    this.level = 1;
    this.exp = new LimitedStat(0, 1);
    this.expDrop = 0;

    this.hp = new LimitedStat(1, 1);
    this.hpRegen = 0;

    this.attackDamage = Stat.create(0);
    this.attackSpeed = Stat.create(0);
    this.attackRange = Stat.create(0);

    this.moveSpeed = Stat.create(0);

    this.armor = Stat.create(0);
    this.slowResist = 0; // TODO: implement
    this.stunResist = 0; // TODO: implement
    this.knockbackResist = 0; // TODO: implement

    this.pos = new Vector2(0, 0);
    this.destPos = new Vector2(0, 0);
    this.scale = [1, 1];
    this.direction = 0;

    this.moving = false;
    this.attackingTarget = null;
    this.nextAttackTime = 0;

    this.upgrades = new Map<string, Upgrade>();
    this.statManager = new EntityStatManager(this);
  }

  /* ------------- Final Stat Getter ------------- */
  public get finalAttackDamage(): number {
    return this.statManager.attackDamage;
  }

  public get finalAttackSpeed(): number {
    return this.statManager.attackSpeed;
  }

  public get finalAttackRange(): number {
    return this.statManager.attackRange;
  }

  public get finalMoveSpeed(): number {
    return this.statManager.moveSpeed;
  }

  public get finalArmor(): number {
    return this.statManager.armor;
  }

  public get finalHpRegen(): number {
    return this.statManager.hpRegen;
  }

  /* ------------- Effect Applier ------------- */
  public addUpgrade(upgrade: Upgrade): void {
    if (!this.upgrades.has(upgrade.id)) {
      this.upgrades.set(upgrade.id, upgrade);
    } else {
      const possessedUpgrade = this.upgrades.get(upgrade.id) as Upgrade;
      possessedUpgrade.levelUp();
    }
  }

  public applyDamage(damage: number, by: Entity): void {
    // apply armor
    const damageReduction = calcFraction(this.armor.get());
    this.hp.subtract(damage * (1 - damageReduction));
    if (this.hp.current === 0) {
      this.destroy();
      by.applyExp(this.expDrop);
    }
  }

  protected applyHealthGen(t: number): void {
    if (this.disabled) return;
    this.hp.add(this.hpRegen * t);
  }

  public applyExp(exp: number): void {
    let applyingExp = exp;
    while (true) {
      applyingExp = this.exp.add(applyingExp);
      if (!this.exp.isFull()) break;
      this.levelUp();
    }
  }

  protected levelUp(): void {
    this.level++;
    this.exp.setCurrent(0);
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

  public stopMove() {
    this.destPos.set(this.pos.x, this.pos.y);
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

  private isTargetAttackable(): boolean {
    if (this.attackingTarget == null) return false;
    if (this.attackingTarget.disabled) return false;
    if (this.attackingTarget.pos.distanceTo(this.pos) > this.finalAttackRange) return false;
    return true;
  }

  private tryAttack(): void {
    if (this.attackingTarget == null) return;
    if (Date.now() >= this.nextAttackTime) {
      this.nextAttackTime = Date.now() + 1000 / this.finalAttackSpeed;
      this.attackingTarget.applyDamage(this.finalAttackDamage, this);
      if (this.upgrades.has(UPGRADES.RANGER_UPGRADE_INFINITE_ATTACK_SPEED_UP)) {
        const upgrade = this.upgrades.get(
          UPGRADES.RANGER_UPGRADE_INFINITE_ATTACK_SPEED_UP
        ) as RangerUpgradeInfiniteAttackSpeedUp;
        upgrade.applyStack();
      }
    }
  }

  public update(t: number): void {
    if (this.attackingTarget != null) {
      if (this.attackingTarget.disabled || this.attackingTarget.pos.distanceTo(this.pos) > this.attackRange.get()) {
        this.attackingTarget = null;
      }
    }

    this.moving = false;

    if (this.isTargetAttackable()) {
      this.tryAttack();
    } else {
      if (!this.pos.equals(this.destPos)) {
        // move
        const vec = this.destPos.clone().sub(this.pos);
        const distance = vec.length();
        const moveDistance = this.moveSpeed.get() * t;

        if (distance < moveDistance) {
          this.pos.set(this.destPos.x, this.destPos.y);

          // attack move
          if (this.attackMoving) {
            this.attackMoving = false;
          }
        } else {
          vec.normalize();
          vec.multiplyScalar(this.moveSpeed.get());
          this.pos.addScaledVector(vec, t);
          this.moving = true;
        }
      }
    }

    // health regen
    this.applyHealthGen(t);
  }

  protected drawHealthBar(color: string): JSX.Element {
    return (
      <Fragment key={this.id}>
        <Box2D
          x={this.pos.x - HEALTH_WIDTH / 2}
          y={this.pos.y + HEALTH_HEIGHT / 2 + 25}
          width={HEALTH_WIDTH}
          height={HEALTH_HEIGHT}
          color={"black"}
        />
        <Box2D
          x={this.pos.x - HEALTH_WIDTH / 2}
          y={this.pos.y + HEALTH_HEIGHT / 2 + 25}
          width={HEALTH_WIDTH * (this.hp.current / this.hp.max)}
          height={HEALTH_HEIGHT}
          color={color}
        />
        <Text2D
          text={`${Math.ceil(this.hp.current)} / ${Math.ceil(this.hp.max)}`}
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
