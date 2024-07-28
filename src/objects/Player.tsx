import Image2D from "atom/Image2D";
import Text2D from "atom/Text2D";
import Game from "controls/Game";
import React, { Fragment } from "react";
import TestRanger from "assets/img/player/test_ranger.png";
import { LAYER_TYPE, OBJECT_DIRECTION, PLAYER_IDENTITY } from "system/Types";
import { Entity } from "./Entity";
import Layer from "render/Layer";

export class Player extends Entity {
  public identity: PLAYER_IDENTITY = PLAYER_IDENTITY.TESTER;

  constructor(name: string, identity: PLAYER_IDENTITY) {
    super(name);
    this.identity = identity;

    this.canGetExp = true;
    this.expMagnetic = 150;
  }

  public update(game: Game, t: number): void {
    super.update(game, t);

    // auto attack & attack move
    this.tryAttack();
    // const nearestEnemyDistInfo = this.getNearestEntity(LAYER_TYPE.ENEMY);
    // if (nearestEnemyDistInfo && nearestEnemyDistInfo.distance <= this.attackRange.get()) {

    // }
  }

  public draw(): JSX.Element {
    return (
      <Fragment key={this.id}>
        {this.drawHealthBar("#22ff22")}
        <Image2D
          src={TestRanger}
          x={this.pos.x}
          y={this.pos.y}
          horizontalReverse={this.direction === OBJECT_DIRECTION.RIGHT}
          scale={2}
        />
        <Text2D text={`${this.name} (Lv.${this.level})`} x={this.pos.x} y={this.pos.y + 55} fontSize={11} />
      </Fragment>
    );
  }

  public collectAttackableEntities(): Entity[] {
    throw new Error("Method not implemented.");
  }
}

export class PlayerLayer extends Layer<Player> {
  constructor(game: Game) {
    super(game, LAYER_TYPE.PLAYER);
  }
}
