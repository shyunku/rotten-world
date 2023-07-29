import { Entity } from "graphic/objects/Entity";
import Upgrade from "./Upgrade";
import { UPGRADES } from "./upgrades/TooltipValues";

class EntityStatManager {
  private entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  private getUpgradeValues(upgradeId: string, defaultValue: number): number[] {
    const upgrade = this.entity.upgrades.get(upgradeId) as Upgrade;
    if (!upgrade) {
      return [defaultValue];
    }
    return upgrade.getFactor();
  }

  public get attackDamage(): number {
    return this.entity.attackDamage.get() + this.getUpgradeValues(UPGRADES.RANGER_UPGRADE_DAMAGE_UP, 0)[0];
  }

  public get attackSpeed(): number {
    return (
      (this.entity.attackSpeed.get() + this.getUpgradeValues(UPGRADES.RANGER_UPGRADE_ATTACK_SPEED_UP, 0)[0]) *
      this.getUpgradeValues(UPGRADES.RANGER_UPGRADE_INFINITE_ATTACK_SPEED_UP, 1)[0]
    );
  }

  public get attackRange(): number {
    return this.entity.attackRange.get() + this.getUpgradeValues(UPGRADES.RANGER_UPGRADE_RANGE_UP, 0)[0];
  }

  public get moveSpeed(): number {
    return this.entity.moveSpeed.get();
  }

  public get armor(): number {
    return this.entity.armor.get();
  }

  public get hpRegen(): number {
    return this.entity.hpRegen;
  }
}

export default EntityStatManager;
