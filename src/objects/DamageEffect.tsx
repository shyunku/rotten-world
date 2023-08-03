import Text2D from "atom/Text2D";
import { Vector2 } from "three";
import { uuidv4 } from "util/CommonUtil";
import { Entity } from "./Entity";
import { FontWeight, LAYER_TYPE } from "system/Types";

export class DamageEffect {
  public id: string;
  public invokeTime: number;
  public duration: number;
  public damage: number;
  public isCritical: boolean;
  public damagedEntity: Entity;
  public initialPos: Vector2 = new Vector2();
  public layer: string | null;

  constructor(damage: number, isCritical: boolean, damagedEntity: Entity, duration = 1000) {
    this.id = uuidv4();
    this.invokeTime = Date.now();
    this.duration = duration;
    this.damage = damage;
    this.isCritical = isCritical;
    this.damagedEntity = damagedEntity;
    this.initialPos.copy(damagedEntity.pos);
    this.layer = damagedEntity.layer;
  }

  public get isExpired(): boolean {
    return Date.now() >= this.invokeTime + this.duration;
  }

  public get durationRate(): number {
    return (Date.now() - this.invokeTime) / this.duration;
  }

  public get color(): string {
    switch (this.layer) {
      case LAYER_TYPE.ENEMY:
        return this.isCritical ? "#ff77dd" : "#ffcc22";
      case LAYER_TYPE.PLAYER:
        return "#ff0000";
      default:
        return "#777777";
    }
  }

  public draw(): JSX.Element {
    return (
      <Text2D
        key={this.id}
        text={Math.ceil(this.damage)}
        x={this.initialPos.x}
        y={this.initialPos.y + 50 + this.durationRate * 30}
        color={this.color}
        opacity={1 - this.durationRate}
        fontWeight={FontWeight.BOLDER}
        fontSize={this.isCritical ? 28 : 20}
        strokeColor="black"
        strokeWidth={0.1}
      />
    );
  }
}
