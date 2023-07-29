import Text2D from "graphic/atom/Text2D";
import { LAYER_TYPE } from "graphic/engine/Constants";
import Game from "graphic/engine/Game";
import Layer from "graphic/engine/Layer";
import Logger from "graphic/engine/Logger";
import { Entity } from "graphic/objects/Entity";
import React, { Fragment } from "react";

export class Player extends Entity {
  constructor(name: string) {
    super(name);

    this.moveSpeed = 240;
    this.maxHp = 100;
    this.hp = this.maxHp;
  }

  public levelUp() {
    super.levelUp();
    this.maxHp += 75;
    this.healAll();
    this.attackDamage += 4;
    this.attackSpeed += 0.05;
    this.hpRegen += 0.02;
    this.armor += 3;
  }

  public update(t: number): void {
    super.update(t);
    this.applyHealthGen(t);

    // auto attack & attack move
    if (this.attackMoving || !this.moving) {
      const nearestEnemyDistInfo = this.getNearestEntity(LAYER_TYPE.ENEMY);
      if (nearestEnemyDistInfo && nearestEnemyDistInfo.distance <= this.attackRange) {
        this.attackingTarget = nearestEnemyDistInfo.entity;
      }
    }
  }

  public draw(): JSX.Element {
    return (
      <Fragment key={this.id}>
        {this.drawHealthBar("#22ff22")}
        <Text2D text={`${this.name} (Lv.${this.level})`} x={this.pos.x} y={this.pos.y} fontSize={10} />
      </Fragment>
    );
  }
}

export class PlayerLayer extends Layer<Player> {
  constructor(game: Game) {
    super(game, LAYER_TYPE.PLAYER);
  }
}
