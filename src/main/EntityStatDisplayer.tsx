import { useThree } from "@react-three/fiber";
import Box2D from "atom/Box2D";
import { EXP_DISPLAYER_HEIGHT } from "./ExpDisplayer";
import Image2D from "atom/Image2D";
import ATTACK_DAMAGE_IMG from "assets/img/statIcons/attack_damage.png";
import ATTACK_SPEED_IMG from "assets/img/statIcons/attack_speed.png";
import ATTACK_RANGE_IMG from "assets/img/statIcons/attack_range.png";
import MOVE_SPEED_IMG from "assets/img/statIcons/move_speed.png";
import ARMOR_IMG from "assets/img/statIcons/armor.png";
import HP_REGEN_IMG from "assets/img/statIcons/hp_regen.png";
import HP_IMG from "assets/img/statIcons/hp.png";
import CRITICAL_CHANCE_IMG from "assets/img/statIcons/critical_chance.png";
import VAMPIRISM_IMG from "assets/img/statIcons/vampirism.png";
import ARMOR_PENETRATION_IMG from "assets/img/statIcons/armor_penetration.png";
import FEAR_IMG from "assets/img/statIcons/fear.png";
import FEAR_RESIST_IMG from "assets/img/statIcons/fear_resist.png";

import { calcFraction } from "util/GameUtil";
import { Entity } from "objects/Entity";
import { StatItem } from "./StatDisplayer";
import Text2D from "atom/Text2D";
import { FontWeight, LAYER_TYPE } from "system/Types";
import { Fragment } from "react";

const STAT_DISPLAYER_WIDTH = 325;
const STAT_DISPLAYER_HEIGHT = 185;
const STAT_DISPLAYER_PADDING_HORI = 20;
const STAT_DISPLAYER_PADDING_VERT = 25;
const STAT_DISPLAYER_ITEM_HEIGHT = 32;
const STAT_DISPLAYER_ITEM_WIDTH = 110;
const STAT_DISPLAYER_TOP_MARGIN = 65;
const STAT_ROW_COUNT = 3;

const HEALTH_TOP_MARGIN = 50;
const HEALTH_WIDTH = STAT_DISPLAYER_WIDTH - STAT_DISPLAYER_PADDING_HORI * 2;
const HEALTH_HEIGHT = 16;

interface StatDisplayerProps {
  entity: Entity;
}

const EntityStatDisplayer = (props: StatDisplayerProps) => {
  const { size } = useThree();
  const { width, height } = size;
  const { entity } = props;

  const isPlayer = entity.layer === LAYER_TYPE.PLAYER;

  const x = -width / 2;
  const y = height / 2;

  const stats = [
    { img: ATTACK_DAMAGE_IMG, value: entity.finalAttackDamage, tooltip: "공격력" },
    { img: ATTACK_SPEED_IMG, value: entity.finalAttackSpeed.toFixed(3), tooltip: "공격속도" },
    { img: ATTACK_RANGE_IMG, value: entity.finalAttackRange, tooltip: "사정거리" },
    { img: CRITICAL_CHANCE_IMG, value: (entity.finalCriticalChance * 100).toFixed(0) + "%", tooltip: "치명타 확률" },
    {
      img: ARMOR_IMG,
      value: `${entity.finalArmor} (-${(calcFraction(entity.finalArmor) * 100).toFixed(0)}%)`,
      tooltip: "방어력",
    },
    {
      img: ARMOR_PENETRATION_IMG,
      value: `${entity.finalArmorPenetration} | ${(entity.armorPenetrationRate * 100).toFixed(0)}%`,
      tooltip: "방어구 관통",
    },
    { img: HP_IMG, value: (entity.hp.rate * 100).toFixed(0) + "%", tooltip: "체력" },
    { img: HP_REGEN_IMG, value: entity.finalHpRegen.toFixed(3), tooltip: "체력 재생" },

    { img: MOVE_SPEED_IMG, value: entity.finalMoveSpeed, tooltip: "이동속도" },
  ];

  return (
    <>
      <Box2D x={x} y={y} width={STAT_DISPLAYER_WIDTH} height={STAT_DISPLAYER_HEIGHT} color={"black"} opacity={0.6} />
      <Text2D
        x={x + STAT_DISPLAYER_PADDING_HORI}
        y={y - 20}
        z={3}
        text={entity.name}
        color="white"
        fontWeight={FontWeight.BOLD}
        textAlignHorizontal="left"
      />
      {/* health bar */}
      <Fragment>
        <Box2D
          x={x + STAT_DISPLAYER_PADDING_HORI}
          y={y + HEALTH_HEIGHT / 2 - HEALTH_TOP_MARGIN}
          z={3}
          width={HEALTH_WIDTH}
          height={HEALTH_HEIGHT}
          color={"#777"}
        />
        <Box2D
          x={x + STAT_DISPLAYER_PADDING_HORI}
          y={y + HEALTH_HEIGHT / 2 - HEALTH_TOP_MARGIN}
          z={3}
          width={HEALTH_WIDTH * (entity.hp.current / entity.hp.max)}
          height={HEALTH_HEIGHT}
          color={isPlayer ? "#22ff22" : "#ff2222"}
        />
        <Text2D
          text={`${Math.ceil(entity.hp.current)} / ${Math.ceil(entity.hp.max)}`}
          fontSize={13}
          x={x + STAT_DISPLAYER_PADDING_HORI + HEALTH_WIDTH / 2}
          y={y - HEALTH_TOP_MARGIN + 1}
          z={4}
          color="white"
        />
      </Fragment>
      {stats.map((stat, i) => {
        const col = Math.floor(i / STAT_ROW_COUNT);
        const row = i % STAT_ROW_COUNT;
        return (
          <StatItem
            key={i}
            x={x + STAT_DISPLAYER_PADDING_HORI + STAT_DISPLAYER_ITEM_WIDTH * col}
            y={y - STAT_DISPLAYER_ITEM_HEIGHT * row - STAT_DISPLAYER_PADDING_VERT - STAT_DISPLAYER_TOP_MARGIN}
            value={stat.value}
            img={stat.img}
            tooltip={stat.tooltip}
          />
        );
      })}
    </>
  );
};

export default EntityStatDisplayer;
