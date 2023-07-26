import { RootState, useThree } from "@react-three/fiber";
import Text2D from "graphic/atom/Text2D";
import { LAYER_TYPE } from "graphic/engine/Constants";
import Game from "graphic/engine/Game";
import Layer from "graphic/engine/Layer";
import Logger from "graphic/engine/Logger";
import { Entity } from "graphic/objects/Entity";
import { Fragment } from "react";
import { fastInterval } from "util/CommonUtil";

export class Enemy extends Entity {
  public playerChaseCalcPeriod: number;
  private nextPlayerChaseCalcTime: number;
  private nextAttackTime: number;

  constructor(name: string) {
    super(name);
    this.playerChaseCalcPeriod = 1000;
    this.nextPlayerChaseCalcTime = 0;
    this.nextAttackTime = 0;
  }

  public update(t: number): void {
    super.update(t);

    if (Date.now() >= this.nextPlayerChaseCalcTime) {
      this.nextPlayerChaseCalcTime += this.playerChaseCalcPeriod;
      this.chasePlayer();
    }

    this.applyHealthGen(t);
  }

  private chasePlayer() {
    // chase nearest player
    const game = this.game as Game;
    const playerLayer = game.getLayer(LAYER_TYPE.PLAYER) as Layer<Entity>;
    if (playerLayer) {
      const players = playerLayer.gameObjects as Map<string, Entity>;
      const playersWithDist = [];
      for (const [, player] of players) {
        const distance = this.pos.distanceTo(player.pos);
        playersWithDist.push({ player, distance });
      }
      playersWithDist.sort((a, b) => a.distance - b.distance);
      if (playersWithDist.length > 0) {
        const nearestPlayer = playersWithDist[0].player;
        const dVec = nearestPlayer.pos.clone().sub(this.pos);
        const distance = dVec.length();

        if (distance <= this.attackRange) {
          // attack player if in range
          if (Date.now() >= this.nextAttackTime) {
            this.nextAttackTime = Date.now() + 1000 / this.attackSpeed;
            nearestPlayer.applyDamage(this.attackDamage);
          }
        } else {
          // if player is not in range, move to player
          if (distance > this.attackRange * 1.1) {
            const vecToNewDest = dVec.normalize().multiplyScalar(this.attackRange * 0.9);
            const newDestPos = nearestPlayer.pos.clone().sub(vecToNewDest);
            this.destPos.set(newDestPos.x, newDestPos.y);
          }
        }
      }
    }
  }

  public draw(): JSX.Element {
    return (
      <Fragment key={this.id}>
        {this.drawHealthBar("#ff2222")}
        <Text2D text={this.name} x={this.pos.x} y={this.pos.y} fontSize={10} />
      </Fragment>
    );
  }
}

export class Enemy1 extends Enemy {
  constructor(name: string) {
    super(name);

    this.moveSpeed = 100;
    this.maxHp = 30;
    this.hp = this.maxHp;
    this.playerChaseCalcPeriod = 800;
    this.attackRange = 200;
    this.attackDamage = 12;
    this.attackSpeed = 16.0;
  }
}

export class Enemy2 extends Enemy {
  constructor(name: string) {
    super(name);

    this.moveSpeed = 100;
    this.maxHp = 30;
    this.hp = this.maxHp;
    this.playerChaseCalcPeriod = 500;
    this.attackRange = 80;
    this.attackDamage = 5;
  }
}

export class Enemy3 extends Enemy {
  constructor(name: string) {
    super(name);

    this.moveSpeed = 100;
    this.maxHp = 30;
    this.hp = this.maxHp;
    this.playerChaseCalcPeriod = 300;
    this.attackRange = 80;
    this.attackDamage = 8;
  }
}

export class EnemySpawner {
  public nextRoundStartTime: number;
  public round: number;
  public spawnInterval: number;
  public spawnCount: number;
  public game: Game;

  public roundLoopId: NodeJS.Timeout | null;
  private delayTimeoutId: NodeJS.Timeout | null;

  private remainTimeBeforeNextRound: number;
  public paused: boolean;

  constructor(game: Game, spawnInterval: number) {
    this.nextRoundStartTime = 0;
    this.round = 0;
    this.spawnCount = 0;
    this.spawnInterval = spawnInterval;
    this.game = game;
    this.roundLoopId = null;
    this.delayTimeoutId = null;
    this.remainTimeBeforeNextRound = 0;
    this.paused = true;
  }

  public start(startDelay: number) {
    this.round = 0;

    this.resume(startDelay);
  }

  public pause() {
    this.remainTimeBeforeNextRound = this.nextRoundStartTime - Date.now();
    this.nextRoundStartTime = 0;
    this.paused = true;
    clearInterval(this.roundLoopId as NodeJS.Timeout);
    clearTimeout(this.delayTimeoutId as NodeJS.Timeout);
  }

  public resume(startDelay: number) {
    this.remainTimeBeforeNextRound = 0;
    const delay = this.round === 0 ? startDelay : this.remainTimeBeforeNextRound + startDelay;

    this.nextRoundStartTime = Date.now() + delay;
    this.paused = false;

    this.delayTimeoutId = setTimeout(() => {
      this.roundLoopId = fastInterval(() => {
        this.nextRoundStartTime = Date.now() + this.spawnInterval;
        this.round += 1;
        this.spawnCount = this.round * 10;
        this.roundStartHandler();
      }, this.spawnInterval);
    }, delay);
  }

  private roundStartHandler() {
    const enemyLayer = this.game.getLayer(LAYER_TYPE.ENEMY) as Layer<Enemy>;
    if (!enemyLayer) {
      Logger.error("EnemySpawner.roundStartHandler: enemyLayer is null");
    }

    const { size } = this.game.three as RootState;

    for (let i = 0; i < this.spawnCount; i++) {
      const enemy = new Enemy1(`enemy-${this.round}-${i}`);
      const x = (Math.random() - 1 / 2) * size.width;
      const y = (Math.random() - 1 / 2) * size.height;
      enemy.pos.set(x, y);
      enemyLayer.add(enemy);
    }
  }
}

export class EnemyLayer extends Layer<Enemy> {
  constructor(game: Game) {
    super(game);
  }
}
