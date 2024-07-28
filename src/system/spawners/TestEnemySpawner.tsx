import { RootState } from "@react-three/fiber";
import Game from "controls/Game";
import Logger from "modules/Logger";
import { Enemy, TestEnemy } from "objects/Enemy";
import EnemySpawner from "objects/EnemySpawner";
import Layer from "render/Layer";
import { LAYER_TYPE } from "system/Types";
import { uuidv4 } from "util/CommonUtil";

export default class TestEnemySpawner extends EnemySpawner {
  constructor(game: Game) {
    super(game, 5000, 50);
  }

  public spawn(): void {
    const enemyLayer = this.game.getLayer(LAYER_TYPE.ENEMY) as Layer<Enemy>;
    if (!enemyLayer) {
      Logger.error("EnemySpawner.roundStartHandler: enemyLayer is null");
    }

    const { size } = this.game.three as RootState;
    const x = (Math.random() - 1 / 2) * size.width;
    const y = (Math.random() - 1 / 2) * size.height;

    const enemy = new TestEnemy(`enemy-${uuidv4()}`);

    enemy.pos.set(x, y);
    enemy.setLevel(1);
    enemyLayer.add(enemy);
  }
}
