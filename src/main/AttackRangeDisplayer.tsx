import { Player } from "objects/Player";
import { CircleGeometry } from "three";

interface AttackRangeDisplayerProps {
  playerMe: Player;
}

const AttackRangeDisplayer = (props: AttackRangeDisplayerProps) => {
  const me: Player = props.playerMe;
  const pos = me.pos;
  return (
    <mesh
      position={[pos.x, pos.y, 100]}
      scale={[1, 1, 1]}
      visible={true}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      <circleGeometry args={[me.attackRange.get(), 64]} />
      <meshBasicMaterial color="#33ff33" transparent opacity={0.2} />
      {/* border with linewidth */}
      <lineSegments>
        <edgesGeometry args={[new CircleGeometry(me.attackRange.get(), 64)]} />
        {/* TODO :: find out how to acieve linewidth properly on Windows (ANGLE issue!) */}
        <lineBasicMaterial color="#33ff33" linewidth={12} />
      </lineSegments>
    </mesh>
  );
};

export default AttackRangeDisplayer;
