import Layer from "../render/Layer";
import Drawable from "../render/Drawable";
import { EVENT_TYPE, GAME_EVENT_TYPE, LAYER_TYPE } from "../system/Types";
import Event from "../events/Event";
import Logger from "../modules/Logger";
import { RootState } from "@react-three/fiber";
import Controller from "./Controller";
import GameEventHandler from "./GameEventHandler";
import { DamageEffect } from "objects/DamageEffect";
import { Entity } from "objects/Entity";
import { ExpDropEvent } from "events/GameEvents";
import { ExpBall } from "objects/ExpBall";
import EnemySpawner from "objects/EnemySpawner";

class Game {
  private layers: Map<string, Layer<Drawable>>;
  public three: RootState | null = null;
  public controller: Controller;

  // damage effects
  public damageEffects: Map<string, DamageEffect> = new Map();
  public selectedEntity: Entity | null = null;

  public worldSize = { width: 2000, height: 2000 };

  private accElapsedTime = 0;
  private lastResumeTime = 0;
  public enemySpawner: EnemySpawner | null = null;
  public paused = true;

  constructor() {
    this.layers = new Map<string, Layer<Drawable>>();
    this.controller = new Controller(this);
  }

  public get timer(): number {
    if (this.paused) return this.accElapsedTime;
    return this.accElapsedTime + (Date.now() - this.lastResumeTime);
  }

  public setThree(three: RootState) {
    this.three = three;
  }

  public createAndEmitGameEvent(type: string, subEventData: any) {
    const newEvent = Event.createGameEvent(type, subEventData);
    this.applyEvent(newEvent);
  }

  public applyEvent(e: Event) {
    // TODO :: send event to server
    // TODO :: receive event from server and route to game
    Logger.debugf(`Game.applyEvent: ${e.type} ${e.subEventData.type}`);
    if (e.type === EVENT_TYPE.GAME) {
      GameEventHandler(e, this);
    }
  }

  public setEnemySpawner(spawner: EnemySpawner) {
    this.enemySpawner = spawner;
  }

  public start() {
    this.resume();
  }

  public resume() {
    this.paused = false;
    this.enemySpawner?.start();
    this.lastResumeTime = Date.now();
  }

  public pause() {
    this.paused = true;
    this.enemySpawner?.pause();
    this.accElapsedTime += Date.now() - this.lastResumeTime;
    this.lastResumeTime = 0;
  }

  public getLayer(name: string): Layer<Drawable> | undefined {
    return this.layers.get(name);
  }

  public setLayer(name: string, layer: Layer<Drawable>) {
    this.layers.set(name, layer);
  }

  public addDamageEffect(damageEffect: DamageEffect) {
    this.damageEffects.set(damageEffect.id, damageEffect);
    setTimeout(() => {
      this.damageEffects.delete(damageEffect.id);
    }, damageEffect.duration);
  }

  public dropExp(x: number, y: number, exp: number) {
    // this.createAndEmitGameEvent(GAME_EVENT_TYPE.EXP_DROP, new ExpDropEvent(x, y, exp));
    const expBall = new ExpBall(exp, x, y);
    this.getLayer(LAYER_TYPE.EXP_BALL)?.add(expBall);
  }

  public remove(object: Drawable) {
    if (!object.layer) return;
    const layer = this.layers.get(object.layer);
    if (layer) {
      layer.gameObjects.delete(object.id);
      Logger.debugf(`Game.remove: ${object.id} ${object.layer}`);
    }
  }

  private drawLayer(name: string): JSX.Element {
    const layer = this.layers.get(name);
    if (layer) {
      return layer.draw();
    }
    return <></>;
  }

  public update(t: number): void {
    if (this.paused) return;
    for (const [, layer] of this.layers) {
      layer.update(t);
    }
  }

  public draw(): JSX.Element {
    return (
      <>
        {/* background layer */}
        {this.drawLayer(LAYER_TYPE.BACKGROUND)}
        {/* tile layer */}
        {this.drawLayer(LAYER_TYPE.TILE)}
        {/* exp layer */}
        {this.drawLayer(LAYER_TYPE.EXP_BALL)}
        {/* item layer */}
        {this.drawLayer(LAYER_TYPE.ITEM)}
        {/* enemy layer */}
        {this.drawLayer(LAYER_TYPE.ENEMY)}
        {/* player layer */}
        {this.drawLayer(LAYER_TYPE.PLAYER)}
        {/* draw damage effects */}
        {Array.from(this.damageEffects.values()).map((damageEffect) => damageEffect.draw())}
      </>
    );
  }
}

export default Game;
