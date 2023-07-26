import Text2D from "graphic/atom/Text2D";
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

  public move(x: number, y: number) {
    this.destPos.set(x, y);
  }

  public update(t: number): void {
    super.update(t);
    this.applyHealthGen(t);
  }

  public draw(): JSX.Element {
    return (
      <Fragment key={this.id}>
        {this.drawHealthBar("#22ff22")}
        <Text2D text={this.name} x={this.pos.x} y={this.pos.y} fontSize={10} />
      </Fragment>
    );
  }
}

export class PlayerLayer extends Layer<Player> {
  constructor(game: Game) {
    super(game);
  }
}
