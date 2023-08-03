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

import Text2D from "atom/Text2D";
import { calcFraction } from "util/GameUtil";
import { useState } from "react";
import { Player } from "objects/Player";

const STAT_DISPLAYER_WIDTH = 255;
const STAT_DISPLAYER_HEIGHT = 210;
const STAT_DISPLAYER_PADDING_HORI = 20;
const STAT_DISPLAYER_PADDING_VERT = 25;
const STAT_DISPLAYER_ITEM_HEIGHT = 32;
const STAT_DISPLAYER_ITEM_WIDTH = 120;
const STAT_ROW_COUNT = 6;

interface StatDisplayerProps {
  playerMe: Player;
}

const StatDisplayer = (props: StatDisplayerProps) => {
  const { size } = useThree();
  const { width, height } = size;
  const { playerMe } = props;

  const x = -width / 2;
  const y = -height / 2 + STAT_DISPLAYER_HEIGHT + EXP_DISPLAYER_HEIGHT;

  const stats = [
    { img: ATTACK_DAMAGE_IMG, value: playerMe.finalAttackDamage, tooltip: "공격력" },
    { img: ATTACK_SPEED_IMG, value: playerMe.finalAttackSpeed.toFixed(3), tooltip: "공격속도" },
    { img: ATTACK_RANGE_IMG, value: playerMe.finalAttackRange, tooltip: "사정거리" },
    { img: CRITICAL_CHANCE_IMG, value: (playerMe.finalCriticalChance * 100).toFixed(0) + "%", tooltip: "치명타 확률" },
    { img: VAMPIRISM_IMG, value: (playerMe.finalVampirism * 100).toFixed(0) + "%", tooltip: "흡혈" },
    {
      img: ARMOR_PENETRATION_IMG,
      value: `${playerMe.finalArmorPenetration} | ${(playerMe.armorPenetrationRate * 100).toFixed(0)}%`,
      tooltip: "방어구 관통",
    },
    { img: HP_IMG, value: (playerMe.hp.rate * 100).toFixed(0) + "%", tooltip: "체력" },
    { img: HP_REGEN_IMG, value: playerMe.finalHpRegen.toFixed(3), tooltip: "체력 재생" },
    {
      img: ARMOR_IMG,
      value: `${playerMe.finalArmor} (-${(calcFraction(playerMe.finalArmor) * 100).toFixed(0)}%)`,
      tooltip: "방어력",
    },
    { img: FEAR_IMG, value: (playerMe.fear.current * 100).toFixed(1) + "%", tooltip: "두려움" },
    {
      img: FEAR_RESIST_IMG,
      value: `${playerMe.finalFearResist} (${(playerMe.fearLimit * 100).toFixed(0)}%)`,
      tooltip: "두려움 저항",
    },
    { img: MOVE_SPEED_IMG, value: playerMe.finalMoveSpeed, tooltip: "이동속도" },
  ];

  return (
    <>
      <Box2D x={x} y={y} width={STAT_DISPLAYER_WIDTH} height={STAT_DISPLAYER_HEIGHT} color={"black"} opacity={0.6} />
      {stats.map((stat, i) => {
        const col = Math.floor(i / STAT_ROW_COUNT);
        const row = i % STAT_ROW_COUNT;
        return (
          <StatItem
            key={i}
            x={x + STAT_DISPLAYER_PADDING_HORI + STAT_DISPLAYER_ITEM_WIDTH * col}
            y={y - STAT_DISPLAYER_ITEM_HEIGHT * row - STAT_DISPLAYER_PADDING_VERT}
            value={stat.value}
            img={stat.img}
            tooltip={stat.tooltip}
          />
        );
      })}
    </>
  );
};

interface StatItemProps {
  x: number;
  y: number;
  value: number | string;
  img: string;
  tooltip: string;
}

export const StatItem = (props: StatItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <Image2D
        src={props.img}
        x={props.x}
        y={props.y}
        z={3}
        scale={0.9}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      <Text2D
        x={props.x + 20}
        y={props.y}
        z={3}
        text={`${showTooltip ? props.tooltip : props.value}`}
        color={"white"}
        fontSize={15}
        textAlignHorizontal="left"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
    </>
  );
};

export default StatDisplayer;
