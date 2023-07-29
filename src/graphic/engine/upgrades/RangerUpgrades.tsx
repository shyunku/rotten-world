import Upgrade from "../Upgrade";
import { UPGRADES, UPGRADE_TOOLTIP_KEY, UPGRADE_TOOLTIP_VALUE } from "./TooltipValues";

export class RangerUpgradeRangeUp extends Upgrade {
  constructor() {
    super(
      UPGRADES.RANGER_UPGRADE_RANGE_UP,
      "사거리 증가",
      `공격 사거리가 ${UPGRADE_TOOLTIP_KEY.RANGER_RANGE_UP} 증가합니다.`
    );
  }

  public getValue(key: string): string {
    switch (key) {
      case UPGRADE_TOOLTIP_KEY.RANGER_RANGE_UP:
        return `${UPGRADE_TOOLTIP_VALUE.RANGER_RANGE_UP * this.level}`;
    }
    return key;
  }

  public getFactor(): number[] {
    return [UPGRADE_TOOLTIP_VALUE.RANGER_RANGE_UP * this.level];
  }
}

export class RangerUpgradeDamageUp extends Upgrade {
  constructor() {
    super(
      UPGRADES.RANGER_UPGRADE_DAMAGE_UP,
      "공격력 증가",
      `공격력이 ${UPGRADE_TOOLTIP_KEY.RANGER_DAMAGE_UP} 증가합니다.`
    );
  }

  public getValue(key: string): string {
    switch (key) {
      case UPGRADE_TOOLTIP_KEY.RANGER_DAMAGE_UP:
        return `${UPGRADE_TOOLTIP_VALUE.RANGER_DAMAGE_UP * this.level}`;
    }
    return key;
  }

  public getFactor(): number[] {
    return [UPGRADE_TOOLTIP_VALUE.RANGER_DAMAGE_UP * this.level];
  }
}

export class RangerUpgradeAttackSpeedUp extends Upgrade {
  constructor() {
    super(
      UPGRADES.RANGER_UPGRADE_ATTACK_SPEED_UP,
      "공격속도 증가",
      `공격속도가 ${UPGRADE_TOOLTIP_KEY.RANGER_ATTACK_SPEED_UP} 증가합니다.`
    );
  }

  public getValue(key: string): string {
    switch (key) {
      case UPGRADE_TOOLTIP_KEY.RANGER_ATTACK_SPEED_UP:
        return `${UPGRADE_TOOLTIP_VALUE.RANGER_ATTACK_SPEED_UP * this.level}%`;
    }
    return key;
  }

  public getFactor(): number[] {
    return [1 + UPGRADE_TOOLTIP_VALUE.RANGER_ATTACK_SPEED_UP * this.level];
  }
}

export class RangerUpgradeInfiniteAttackSpeedUp extends Upgrade {
  // 이펙트 중첩 수
  public effectStack: number;
  public effectExpiresAt: number;
  public expireThread: NodeJS.Timeout | null;

  constructor() {
    super(
      UPGRADES.RANGER_UPGRADE_INFINITE_ATTACK_SPEED_UP,
      "공격속도 증가",
      `기본 공격을 할 때마다 5초간 공격속도가 ${UPGRADE_TOOLTIP_KEY.RANGER_INFINITE_ATTACK_SPEED_UP} 증가합니다.`
    );

    this.effectStack = 0;
    this.effectExpiresAt = 0;
    this.expireThread = null;
  }

  public applyStack(): void {
    this.effectStack++;
    this.effectExpiresAt = Date.now() + 5000;
    clearTimeout(this.expireThread as NodeJS.Timeout);
    this.expireThread = setTimeout(() => {
      this.effectStack = 0;
    }, 5000);
  }

  public getValue(key: string): string {
    switch (key) {
      case UPGRADE_TOOLTIP_KEY.RANGER_INFINITE_ATTACK_SPEED_UP:
        return `${UPGRADE_TOOLTIP_VALUE.RANGER_INFINITE_ATTACK_SPEED_UP * this.level * 100}%`;
    }
    return key;
  }

  public getFactor(): number[] {
    return [1 + this.effectStack * UPGRADE_TOOLTIP_VALUE.RANGER_INFINITE_ATTACK_SPEED_UP * this.level];
  }
}
