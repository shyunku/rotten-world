import * as uuid from "uuid";

export function uuidv4() {
  return uuid.v4();
}

export function fastInterval(func: () => void, period: number) {
  func();
  return setInterval(func, period);
}

export default {};
