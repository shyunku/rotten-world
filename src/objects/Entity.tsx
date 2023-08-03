import { Box } from "@react-three/drei";
import { assert } from "console";
import Box2D from "atom/Box2D";
import Text2D from "atom/Text2D";
import { Fragment } from "react";
import { Vector2 } from "three";
import { calcFraction } from "util/GameUtil";
import Drawable from "render/Drawable";
import LimitedStat from "../modules/LimitedStat";
import Stat from "modules/Stat";
import Upgrade from "system/Upgrade";
import EntityStatManager from "./EntityStatManager";
import { OBJECT_DIRECTION } from "system/Types";
import Game from "controls/Game";
import { UPGRADES } from "system/upgrades/TooltipValues";
import { RangerUpgradeInfiniteAttackSpeedUp } from "system/upgrades/RangerUpgrades";
import { CONSTANTS } from "system/Constants";
import { DamageEffect } from "./DamageEffect";

const HEALTH_WIDTH = 60;
const HEALTH_HEIGHT = 8;

export class NearestEntityInfo {
  public entity: Entity;
  public distance: number;

  constructor(entity: Entity, distance: number) {
    this.entity = entity;
    this.distance = distance;
  }
}

export abstract class Entity extends Drawable {
  public name: string;

  public level: number; // 레벨
  public exp: LimitedStat; // 경험치
  public expGrowth: number; // 최대 경험치 한도 증가량 (레벨업 시)

  public expDrop: number; // 죽었을 때 주는 경험치
  public expDropGrowth: number; // 죽었을 때 주는 경험치 증가량 (레벨업 시)

  public hp: LimitedStat; // 체력
  public hpGrowth: number; // 최대 체력 증가량

  public hpRegen: number; // 체력 회복량
  public hpRegenGrowth: number; // 체력 회복량 증가량

  public attackDamage: Stat; // 기본 공격력
  public attackDamageGrowth: number; // 기본 공격력 증가량 (레벨업 시)

  public attackSpeed: Stat; // 기본 공격 속도
  public attackSpeedGrowth: number; // 기본 공격 속도 증가량 (레벨업 시)

  public attackRange: Stat; // 기본 공격 사거리
  public attackRangeGrowth: number; // 기본 공격 사거리 증가량 (레벨업 시)

  public criticalChance: number; // 치명타 확률
  public vampirism: number; // 흡혈
  public armorPenetration: number; // 방어구 관통
  public armorPenetrationRate: number; // 방어구 관통 비율

  public moveSpeed: Stat; // 이동 속도
  public moveSpeedGrowth: number; // 이동 속도 증가량 (레벨업 시)

  public armor: Stat; // 방어력
  public armorGrowth: number; // 방어력 증가량 (레벨업 시)

  public slowResist: number; // 둔화 저항력
  public stunResist: number; // 스턴 저항력
  public knockbackResist: number; // 넉백 저항력
  public fearResist: number; // 두려움 저항력

  public fear: LimitedStat; // 두려움 (DEAFULT_FEAR_ACTIVATE_LIMIT + N% 이상일 경우 공격 불가 & 이속 감소 -50%)
  public fearRegen: number; // 두려움 회복량

  // transform
  public pos: Vector2;
  public destPos: Vector2;
  public scale: [number, number];

  // state
  public moving: boolean;
  public nextAttackTime: number;
  public attackMoving = false;
  public attackIdle = true; // 공격 쿨다운이 돌았지만 공격하고 있지 않는 상태

  public upgrades: Map<string, Upgrade>;
  public statManager: EntityStatManager;

  public direction: OBJECT_DIRECTION;
  public hovered = false;

  constructor(name: string) {
    super();

    this.name = name;

    this.level = 1;
    this.exp = new LimitedStat(0, 1);
    this.expGrowth = 0;

    this.expDrop = 0;
    this.expDropGrowth = 0;

    this.hp = new LimitedStat(1, 1);
    this.hpGrowth = 0;

    this.hpRegen = 0;
    this.hpRegenGrowth = 0;

    this.attackDamage = Stat.create(0);
    this.attackDamageGrowth = 0;

    this.attackSpeed = Stat.create(0);
    this.attackSpeedGrowth = 0;

    this.attackRange = Stat.create(0);
    this.attackRangeGrowth = 0;

    this.criticalChance = 0;
    this.vampirism = 0;
    this.armorPenetration = 0;
    this.armorPenetrationRate = 0;

    this.moveSpeed = Stat.create(0);
    this.moveSpeedGrowth = 0;

    this.armor = Stat.create(0);
    this.armorGrowth = 0;

    this.slowResist = 0;
    this.stunResist = 0;
    this.knockbackResist = 0;
    this.fearResist = 0;

    this.fear = new LimitedStat(0, 1);
    this.fearRegen = 0.002;

    this.pos = new Vector2(0, 0);
    this.destPos = new Vector2(0, 0);
    this.scale = [1, 1];
    this.direction = OBJECT_DIRECTION.LEFT;

    this.moving = false;
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

  public get finalCriticalChance(): number {
    return this.criticalChance;
  }

  public get finalVampirism(): number {
    return this.vampirism;
  }

  public get finalArmorPenetration(): number {
    return this.armorPenetration;
  }

  public get finalArmorPenetrationRate(): number {
    return this.armorPenetrationRate;
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

  public get finalFearRegen(): number {
    return this.fearRegen;
  }

  public get finalFearResist(): number {
    return this.fearResist;
  }

  /* ------------- State Getter ------------- */
  public get isSelected(): boolean {
    const game = this.game as Game;
    const selectedEntity = game.selectedEntity;
    if (selectedEntity == null) return false;
    return selectedEntity.id === this.id;
  }

  public get isHovered(): boolean {
    return this.hovered;
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

  // 데미지를 받을 때 호출
  public applyDamage(damage: number, isCritical: boolean, by: Entity): number {
    // apply armor
    const calculatedArmor = (this.armor.get() - by.armorPenetration) * (1 - this.armorPenetrationRate);
    const damageReduction = calcFraction(calculatedArmor);
    const finalDamage = damage * (1 - damageReduction);
    const originalHp = this.hp.current;
    this.hp.subtract(finalDamage);

    // 데미지 효과 적용
    const damageEffect = new DamageEffect(finalDamage, isCritical, this);
    this.game?.addDamageEffect(damageEffect);

    if (this.hp.current === 0) {
      this.destroy();
      by.applyExp(this.expDrop);
      return originalHp;
    }
    // 두려움 증가 (깎인 체력%의 N%)
    const fearAmount = ((originalHp - this.hp.current) / this.hp.max) * CONSTANTS.FEAR_INCREASE_RATE_BY_HP_LOSS;
    this.fear.add(fearAmount);
    return finalDamage;
  }

  public applyHeal(heal: number): void {
    this.hp.add(heal);
  }

  protected applyHealthGen(t: number): void {
    if (this.disabled) return;
    this.hp.add(this.hpRegen * t);
  }

  protected applyFearRegen(t: number): void {
    if (this.disabled) return;
    this.fear.subtract(this.fearRegen * t);
  }

  public get isFeared(): boolean {
    return this.fear.current >= this.fearLimit;
  }

  public get fearLimit(): number {
    return (
      CONSTANTS.DEFAULT_FEAR_ACTIVATE_LIMIT +
      calcFraction(this.fearResist) * (1 - CONSTANTS.DEFAULT_FEAR_ACTIVATE_LIMIT)
    );
  }

  public applyExp(exp: number): void {
    let applyingExp = exp;
    while (true) {
      applyingExp = this.exp.add(applyingExp);
      if (!this.exp.isFull()) break;
      this.levelUp();
    }
  }

  public setLevel(level: number): void {
    if (this.level >= level) return;
    for (let i = this.level; i < level; i++) {
      this.levelUp();
    }
  }

  protected levelUp(): void {
    this.level++;
    this.exp.setCurrent(0);
    this.exp.setMax(this.exp.max + this.expGrowth);
    this.expDrop += this.expDropGrowth;
    this.hp.setMax(this.hp.max + this.hpGrowth);
    this.hp.add(this.hpGrowth);
    this.hpRegen += this.hpRegenGrowth;
    this.attackDamage.addExtra(this.attackDamageGrowth);
    this.attackSpeed.addExtra(this.attackSpeedGrowth);
    this.attackRange.addExtra(this.attackRangeGrowth);
    this.moveSpeed.addExtra(this.moveSpeedGrowth);
    this.armor.addExtra(this.armorGrowth);
  }

  public move(x: number, y: number) {
    this.destPos.set(x, y);
    this.attackMoving = false;
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

  protected getEntitiesByLayerName(layerName: string): Map<string, Entity> | null {
    const game = this.game as Game;
    const layer = game.getLayer(layerName);
    if (layer) {
      const entities = layer.gameObjects as Map<string, Entity>;
      return entities;
    }
    return null;
  }

  private get isAttackCoolDown(): boolean {
    if (this.nextAttackTime === 0) return true;
    return Date.now() >= this.nextAttackTime;
  }

  // 실제 공격 (무조건 공격)
  private attack(targets: Entity[]): void {
    const attackCoolDown = 1000 / this.finalAttackSpeed;
    const overflowedTime = Date.now() - this.nextAttackTime;
    this.nextAttackTime = Date.now() + attackCoolDown;
    let damageAdjustFactorByDelay = 1;

    if (attackCoolDown < 50 && this.attackIdle === false) {
      damageAdjustFactorByDelay = (overflowedTime + attackCoolDown) / attackCoolDown;
    }

    // 대상에게 데미지 적용
    const damage = this.finalAttackDamage * damageAdjustFactorByDelay;

    let damageSum = 0;
    for (const target of targets) {
      let finalDamage = damage;
      let isCritical = false;
      if (Math.random() < this.finalCriticalChance) {
        // 치명타 적용 (데미지 1.5배)
        finalDamage *= 1.5;
        isCritical = true;
      }
      const calculatedDamage = target.applyDamage(finalDamage, isCritical, this);
      damageSum += calculatedDamage;
    }

    // 흡혈 적용: 범위 공격의 경우 30%만 적용
    const vampirismAmount = targets.length <= 1 ? damageSum : damageSum * 0.3;
    this.applyHeal(vampirismAmount * this.finalVampirism);

    this.attackIdle = false;
    if (this.upgrades.has(UPGRADES.RANGER_UPGRADE_INFINITE_ATTACK_SPEED_UP)) {
      const upgrade = this.upgrades.get(
        UPGRADES.RANGER_UPGRADE_INFINITE_ATTACK_SPEED_UP
      ) as RangerUpgradeInfiniteAttackSpeedUp;
      upgrade.applyStack();
    }
  }

  public update(t: number): void {
    this.moving = false;

    if (this.attackIdle === false && Date.now() >= this.nextAttackTime) {
      this.attackIdle = true;
    }

    if (!this.pos.equals(this.destPos)) {
      // move
      const vec = this.destPos.clone().sub(this.pos);
      const distance = vec.length();
      const moveDistance = this.finalMoveSpeed * t;

      this.direction = vec.x > 0 ? OBJECT_DIRECTION.RIGHT : OBJECT_DIRECTION.LEFT;

      if (distance < moveDistance) {
        this.pos.set(this.destPos.x, this.destPos.y);

        // attack move
        if (this.attackMoving) {
          this.attackMoving = false;
        }
      } else if (!(this.attackMoving && this.collectAttackableEntities().length > 0)) {
        vec.normalize();
        vec.multiplyScalar(this.finalMoveSpeed);
        this.pos.addScaledVector(vec, t);
        this.moving = true;
      }
    } else {
      // 엔티티가 멈춰있는 경우
      // 자동 공격 시도
      // this.tryAttack();
    }

    // health regen
    this.applyHealthGen(t);

    // fear regen
    this.applyFearRegen(t);
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
          fontSize={12}
          x={this.pos.x}
          y={this.pos.y + 40}
        />
      </Fragment>
    );
  }

  public draw(): JSX.Element {
    throw new Error("Method not implemented.");
  }

  // 현재 공격 범위 내 대상들을 반환
  public abstract collectAttackableEntities(): Entity[];

  // 기본 공격 시도 (플레이어 강제 공격 시도 및 자동 공격 시도)
  public tryAttack() {
    const attackableEntities = this.collectAttackableEntities();
    if (attackableEntities.length === 0) return;
    if (this.nextAttackTime === 0) this.nextAttackTime = Date.now();
    if (this.isAttackCoolDown === false) return;
    if (this.isFeared) return;
    this.attack(attackableEntities);
  }

  // 기본 공격 시도 (엔티티 주어짐)
  public tryAttackToEntities(entities: Entity[]) {
    if (entities.length === 0) return;
    if (this.nextAttackTime === 0) this.nextAttackTime = Date.now();
    if (this.isAttackCoolDown === false) return;
    if (this.isFeared) return;
    this.attack(entities);
  }

  public onHover(): void {
    this.hovered = true;
  }

  public onUnhover(): void {
    this.hovered = false;
  }

  public onClick(): void {
    const game = this.game as Game;
    game.selectedEntity = this;
  }
}
