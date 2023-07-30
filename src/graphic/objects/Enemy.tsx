import { RootState, useThree } from "@react-three/fiber";
import Image2D from "graphic/atom/Image2D";
import Text2D from "graphic/atom/Text2D";
import { LAYER_TYPE, OBJECT_DIRECTION } from "graphic/engine/Constants";
import Game from "graphic/engine/Game";
import Layer from "graphic/engine/Layer";
import Logger from "graphic/engine/Logger";
import Stat from "graphic/engine/Stat";
import { Entity } from "graphic/objects/Entity";
import { Fragment } from "react";
import { fastInterval } from "util/CommonUtil";
import TestZombieImg from "graphic/assets/test/test_zombie.png";

export class Enemy extends Entity {
  public playerChaseCalcPeriod: number;
  private nextPlayerChaseCalcTime: number;
  // 대형 몬스터
  public isLarge: boolean;

  constructor(name: string) {
    super(name);
    this.playerChaseCalcPeriod = 1000;
    this.nextPlayerChaseCalcTime = 0;
    this.isLarge = false;
  }

  public update(t: number): void {
    super.update(t);

    if (Date.now() >= this.nextPlayerChaseCalcTime) {
      this.nextPlayerChaseCalcTime += this.playerChaseCalcPeriod;
      this.chasePlayer();
    }
  }

  private chasePlayer() {
    // chase nearest player
    const nearestPlayerDistInfo = this.getNearestEntity(LAYER_TYPE.PLAYER);
    if (nearestPlayerDistInfo) {
      const playerPos = nearestPlayerDistInfo.entity.pos;
      this.attackMove(playerPos.x, playerPos.y);
      this.attackingTarget = nearestPlayerDistInfo.entity;
    } else {
      this.attackingTarget = null;
      this.stopMove();
    }
  }

  public draw(): JSX.Element {
    return (
      <Fragment key={this.id}>
        {!this.hp.isFull() && this.drawHealthBar("#ff2222")}
        {/* <Text2D text={this.name} x={this.pos.x} y={this.pos.y} fontSize={10} /> */}
        <Image2D
          src={TestZombieImg}
          x={this.pos.x}
          y={this.pos.y}
          scale={2}
          horizontalReverse={this.direction === OBJECT_DIRECTION.RIGHT}
        />
      </Fragment>
    );
  }
}

export class TestEnemy extends Enemy {
  constructor(name: string) {
    super(name);

    this.hp.setMaxAndFill(280);
    this.moveSpeed = Stat.create(80);
    this.playerChaseCalcPeriod = 800;
    this.attackRange = Stat.create(30);
    this.attackDamage = Stat.create(42);
    this.attackSpeed = Stat.create(0.6);
    this.expDrop = 25;
    this.scale = [10, 10];
  }
}

export class TestEnemyBoss extends Enemy {
  constructor(name: string) {
    super(name);

    this.hp.setMaxAndFill(25000);
    this.hpGrowth = 1600;
    this.hpRegen = 7;
    this.moveSpeed = Stat.create(65);
    this.moveSpeedGrowth = 3;
    this.playerChaseCalcPeriod = 800;
    this.attackRange = Stat.create(100);
    this.attackDamage = Stat.create(247);
    this.attackDamageGrowth = 36;
    this.attackSpeed = Stat.create(1.6);
    this.attackSpeedGrowth = 0.02;
    this.expDrop = 140;
    this.expDropGrowth = 20;
    this.armor = Stat.create(120);
    this.armorGrowth = 27;
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
        this.spawnCount = Math.floor(this.round * 15);
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
      const enemy = new TestEnemy(`enemy-${this.round}-${i}`);
      const x = (Math.random() - 1 / 2) * size.width;
      const y = (Math.random() - 1 / 2) * size.height;
      enemy.pos.set(x, y);
      enemy.setLevel(this.round);
      enemyLayer.add(enemy);
    }
  }
}

export class EnemyLayer extends Layer<Enemy> {
  constructor(game: Game) {
    super(game, LAYER_TYPE.ENEMY);
  }
}
