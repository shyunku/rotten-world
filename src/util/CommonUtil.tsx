import * as uuid from "uuid";

export function uuidv4() {
  return uuid.v4();
}

export function fastInterval(func: () => void, period: number) {
  func();
  return setInterval(func, period);
}

export function formatTime(time: number) {
  const total = Math.floor(time / 1000);
  const sec = total % 60;
  const min = Math.floor(total / 60) % 60;
  const hour = Math.floor(total / 3600) % 24;
  const day = Math.floor(total / 86400);

  const dayStr = day > 0 ? `${day}:`.padStart(2, "0") : "";
  const hourStr = hour > 0 ? `${hour}:`.padStart(2, "0") : "";
  const minStr = `${min}:`.padStart(2, "0");
  const secStr = `${sec}`.padStart(2, "0");
  return `${dayStr}${hourStr}${minStr}${secStr}`;
}

export default {};
