import Stat from "modules/Stat";
import { Entity } from "objects/Entity";
import { Player } from "objects/Player";
import { LAYER_TYPE, PLAYER_IDENTITY } from "system/Types";

export class Tester extends Player {
  constructor(name: string) {
    super(name, PLAYER_IDENTITY.TESTER);

    this.hp.setMaxAndFill(10000);
    this.hpGrowth = 125;
    this.hpRegen = 2;
    this.hpRegenGrowth = 0.5;
    this.exp.setMax(100);
    this.expGrowth = 25;
    this.moveSpeed = Stat.create(300);
    this.moveSpeedGrowth = 0;
    this.attackRange = Stat.create(300);
    this.attackRangeGrowth = 0;
    this.attackDamage = Stat.create(100);
    this.attackDamageGrowth = 6;
    this.attackSpeed = Stat.create(1.5);
    this.attackSpeedGrowth = 0.022;
    this.criticalChance = 0.05;
    this.vampirism = 0.01;
    this.armorPenetration = 15;
    this.armorPenetrationRate = 0.32;
    this.armor = Stat.create(10);
    this.armorGrowth = 2;
    this.fearResist = 6;
    this.fearRegen = 0.005;
    this.scale = [15, 15];
  }

  public collectAttackableEntities(): Entity[] {
    const enemyEntities = this.getEntitiesByLayerName(LAYER_TYPE.ENEMY);
    if (!enemyEntities) return [];
    return Array.from(enemyEntities)
      .map(([, e]) => e)
      .filter((e) => {
        const distance = this.pos.distanceTo(e.pos);
        return distance <= this.finalAttackRange;
      });
  }
}
