import Text2D from "graphic/atom/Text2D";
import Layer from "graphic/engine/Layer";
import Logger from "graphic/engine/Logger";
import { Entity } from "graphic/objects/Entity";
import React from "react";

export class Player extends Entity {
  constructor(id: string, name: string) {
    super(id, name);

    this.moveSpeed = 240;
  }

  public move(x: number, y: number) {
    this.destPos[0] = x;
    this.destPos[1] = y;
  }

  public draw(): JSX.Element {
    return (
      <React.Fragment key={this.id}>
        <Text2D text="Player" x={this.pos[0]} y={this.pos[1]} fontSize={10} />
      </React.Fragment>
    );
  }
}

export class PlayerLayer extends Layer<Player> {
  constructor() {
    super();
  }
}
