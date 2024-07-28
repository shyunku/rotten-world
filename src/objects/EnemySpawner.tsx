import Game from "controls/Game";
import { fastInterval } from "util/CommonUtil";

export default abstract class EnemySpawner {
  public spawnCount: number;
  public game: Game;
  public paused: boolean;

  private spawnLoopId?: NodeJS.Timeout;
  private maxSpawnCount = 0;
  private startDelay = 0;

  constructor(game: Game, startDelay: number, maxSpawnCount: number) {
    this.spawnCount = 0;
    this.game = game;
    this.paused = true;
    this.startDelay = startDelay;
    this.maxSpawnCount = maxSpawnCount;
  }

  public start() {
    this.paused = false;
    setTimeout(() => {
      this.spawnLoop();
    }, this.startDelay);
  }

  public pause() {
    this.paused = true;
  }

  private spawnLoop() {
    this.spawnLoopId = fastInterval(() => {
      if (this.paused) {
        clearInterval(this.spawnLoopId);
        return;
      }

      if (this.spawnCount < this.maxSpawnCount) {
        this.spawn();
      }
    }, 300);
  }

  public abstract spawn(): void;
}
