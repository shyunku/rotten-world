import { uuidv4 } from "util/CommonUtil";
import GameEvent from "./GameEvent";
import { EVENT_TYPE } from "../system/Types";

class Event {
  public id: string;
  public type: string;
  public time: number;
  public subEventData: any;

  constructor(id: string, type: string, time: number, subEventData: any) {
    this.id = id;
    this.type = type;
    this.time = time;
    this.subEventData = subEventData;
  }

  public static createGameEvent(type: string, subEventData: any): Event {
    const id = uuidv4();
    const time = Date.now();
    return new Event(id, EVENT_TYPE.GAME, time, GameEvent.create(type, subEventData));
  }
}

export default Event;
