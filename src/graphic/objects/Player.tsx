import Text2D from "graphic/atom/Text2D";
import { LAYER_TYPE } from "graphic/engine/Constants";
import Game from "graphic/engine/Game";
import Layer from "graphic/engine/Layer";
import Logger from "graphic/engine/Logger";
import Stat from "graphic/engine/Stat";
import Upgrade from "graphic/engine/Upgrade";
import { Entity } from "graphic/objects/Entity";
import React, { Fragment } from "react";

export class Player extends Entity {
  constructor(name: string) {
    super(name);

    // temporary
    this.hp.setMaxAndFill(1520);
    this.hpGrowth = 125;
    this.hpRegen = 2;
    this.hpRegenGrowth = 0.5;
    this.exp.setMax(100);
    this.expGrowth = 25;
    this.moveSpeed = Stat.create(240);
    this.moveSpeedGrowth = 0;
    this.attackRange = Stat.create(300);
    this.attackRangeGrowth = 0;
    this.attackDamage = Stat.create(52);
    this.attackDamageGrowth = 6;
    this.attackSpeed = Stat.create(1.3);
    this.attackSpeedGrowth = 0.022;
    this.armor = Stat.create(25);
    this.armorGrowth = 2;
    this.scale = [15, 15];
  }

  public update(t: number): void {
    super.update(t);

    // auto attack & attack move
    if (this.attackMoving || !this.moving) {
      const nearestEnemyDistInfo = this.getNearestEntity(LAYER_TYPE.ENEMY);
      if (nearestEnemyDistInfo && nearestEnemyDistInfo.distance <= this.attackRange.get()) {
        this.attackingTarget = nearestEnemyDistInfo.entity;
      }
    }
  }

  public draw(): JSX.Element {
    return (
      <Fragment key={this.id}>
        {this.drawHealthBar("#22ff22")}
        {/* circle */}
        <mesh position={[this.pos.x, this.pos.y, 0]}>
          <circleGeometry args={[this.scale[0], 32]} />
          <meshBasicMaterial color="#77a" />
        </mesh>
        <Text2D text={`${this.name} (Lv.${this.level})`} x={this.pos.x} y={this.pos.y + 50} fontSize={10} />
      </Fragment>
    );
  }
}

export class PlayerLayer extends Layer<Player> {
  constructor(game: Game) {
    super(game, LAYER_TYPE.PLAYER);
  }
}
