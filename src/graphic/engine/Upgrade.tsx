import { Player } from "graphic/objects/Player";
import { UPGRADE_TIER } from "./Constants";

// 증강은 최대 5개까지
abstract class Upgrade {
  public id: string;
  protected level: number;
  protected name: string;
  public description: string;

  constructor(id: string, name: string, description: string) {
    this.level = 1;
    this.id = id;
    this.name = name;
    this.description = description;
  }

  public levelUp(): void {
    this.level++;
  }

  // TODO :: test
  public getCalculatedDescription(): string {
    const matches = this.description.match(/(%.+?%)/g);
    if (!matches) return this.description;
    let desc = this.description;
    for (const match of matches) {
      desc = this.description.replace(match, this.getValue(match));
    }
    return desc;
  }

  // 렌더링
  public draw(): void {
    // TODO :: implement
  }

  // 툴팁에 들어갈 값
  public abstract getValue(key: string): string;
  // 실제 스탯에 적용될 값
  public abstract getFactor(): number[];
}

export default Upgrade;
