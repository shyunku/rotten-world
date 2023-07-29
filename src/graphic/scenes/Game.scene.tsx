import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Text2D from "../atom/Text2D";
import { RouteContext } from "../main/World";
import Game from "graphic/engine/Game";
import { EnemyLayer, EnemySpawner } from "graphic/objects/Enemy";
import { Player, PlayerLayer } from "graphic/objects/Player";
import { GAME_EVENT_TYPE, LAYER_TYPE } from "graphic/engine/Constants";
import Ground from "graphic/main/Ground";
import { GameStateLog, GameStateLogItem } from "graphic/hooks/GameStateLog";
import { useThree } from "@react-three/fiber";
import AttackRangeDisplayer from "graphic/main/AttackRangeDisplayer";
import ExpDisplayer from "graphic/main/ExpDisplayer";
import Stat from "graphic/engine/Stat";
import { calcFraction } from "util/GameUtil";
import { RangerUpgradeInfiniteAttackSpeedUp } from "graphic/engine/upgrades/RangerUpgrades";
import Upgrade from "graphic/engine/Upgrade";

const game = new Game();
const enemyLayer = new EnemyLayer(game);
const playerLayer = new PlayerLayer(game);
const enemySpawner = new EnemySpawner(game, 60000);

const playerMe = new Player("me");
playerMe.id = "me";
playerMe.hp.setMaxAndFill(1250);
playerMe.exp.setMax(100);
playerMe.moveSpeed = Stat.create(240);
playerMe.attackRange = Stat.create(300);
playerMe.attackDamage = Stat.create(50);
playerMe.attackSpeed = Stat.create(1.2);
playerMe.armor = Stat.create(25);
playerMe.hpRegen = 2;
playerMe.addUpgrade(new RangerUpgradeInfiniteAttackSpeedUp());
playerLayer.add(playerMe);

const GameScene = () => {
  const { gameMode } = useContext<any>(RouteContext);
  const lastUpdateTime = useRef(Date.now());
  const three = useThree();

  const [, setDummy] = useState<number>(0);

  useEffect(() => {
    // initialize
    game.setThree(three);
    enemySpawner.start(5000);

    game.setLayer(LAYER_TYPE.ENEMY, enemyLayer);
    game.setLayer(LAYER_TYPE.PLAYER, playerLayer);
    renderLoop();

    document.addEventListener("keydown", game.controller.onDocumentKeyDown);
    document.addEventListener("keyup", game.controller.onDocumentKeyUp);

    return () => {
      document.removeEventListener("keydown", game.controller.onDocumentKeyDown);
      document.removeEventListener("keyup", game.controller.onDocumentKeyUp);
    };
  }, []);

  const renderLoop = useCallback(() => {
    // update
    const now = Date.now();
    const timeElapsed = now - lastUpdateTime.current;
    lastUpdateTime.current = now;
    game.update(timeElapsed / 1000);

    setDummy((prev) => prev + 1);

    const animationId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight color="white" intensity={1} />
      {/* State Log */}
      <GameStateLog
        logs={[
          `Game Mode: ${gameMode}`,
          `Round: ${enemySpawner.round}`,
          `Next Round Remain Time: ${enemySpawner.nextRoundStartTime - Date.now()}ms`,
          `Spawn Interval: ${enemySpawner.spawnInterval}ms`,
          `Spawn Count: ${enemySpawner.spawnCount}`,
          `Paused: ${enemySpawner.paused}`,
          `Enemy Count: ${enemyLayer.gameObjects.size}`,
          `Player Count: ${playerLayer.gameObjects.size}`,
          `Player moving: ${playerMe.moving}`,
          `Player attack target: ${playerMe.attackingTarget?.id ?? "null"} | ${
            playerMe.attackingTarget?.name ?? "null"
          }`,
          `Player attack remain cooldown: ${Math.max(playerMe.nextAttackTime - Date.now(), 0)}ms`,
          ``,
          `Player HP: ${playerMe.hp.current}/${playerMe.hp.max}`,
          `Player EXP: ${playerMe.exp.current}/${playerMe.exp.max}`,
          `Player Level: ${playerMe.level}`,
          `Player Attack Damage: ${playerMe.finalAttackDamage}`,
          `Player Attack Speed: ${playerMe.finalAttackSpeed}`,
          `Player Attack Range: ${playerMe.finalAttackRange}`,
          `Player Move Speed: ${playerMe.finalMoveSpeed}`,
          `Player Armor: ${playerMe.finalArmor} (-${Math.round(calcFraction(playerMe.finalArmor) * 100)}%)`,
          `Player HP Regen: ${playerMe.finalHpRegen}`,
          `Player Upgrades: ${Array.from(playerMe.upgrades)
            .map(([, upgrade]) => upgrade.getCalculatedDescription())
            .join(", ")}`,
        ]}
      />
      {/* Ground Plane */}
      <Ground
        onGroundLeftClick={game.controller.onGroundLeftClick}
        onGroundRightClick={game.controller.onGroundRightClick}
      />
      {/* Attack Range Displayer */}
      {game.controller.attackMoveMode === true && <AttackRangeDisplayer playerMe={playerMe} />}
      {/* Exp Displayer */}
      <ExpDisplayer curExp={playerMe.exp.current} maxExp={playerMe.exp.max} height={12} bgColor="#555" fgColor="#a4f" />
      {/* Game Renderer */}
      {game?.draw()}
    </>
  );
};

export default GameScene;
