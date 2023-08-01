import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import moment from "moment";
import Text2D from "atom/Text2D";

const LOG_TYPE = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  SUCCESS: "success",
};

const POSITION = {
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_LEFT: "bottom-left",
};

const LOG_TYPE_COLOR = {
  [LOG_TYPE.DEBUG]: "#ccc",
  [LOG_TYPE.INFO]: "#bbf",
  [LOG_TYPE.WARN]: "#ffa",
  [LOG_TYPE.ERROR]: "red",
  [LOG_TYPE.SUCCESS]: "#4f7",
};

export const Logger = ({ position = POSITION.TOP_RIGHT, expiresIn = 600000000, maxSize = 30 }) => {
  const [activeLogs, setActiveLogs] = useState<any>([]);
  const verticalDirection = useMemo(() => (position.split("-")[0] == "top" ? 1 : -1), [position]);

  useEffect(() => {
    const listener = (data: any) => {
      const logData = data.data;
      const logId = `log-${v4()}`;
      const maintainDuration = logData?.options?.duration ?? expiresIn;

      setActiveLogs((prev: any) => {
        const log = {
          ...logData,
          id: logId,
          createdAt: Date.now(),
          fadeInAfter: Date.now() + maintainDuration,
          duration: expiresIn,
        };
        let newLogs = [...prev, log];
        if (newLogs.length > maxSize) {
          newLogs = newLogs.slice(-maxSize);
        }
        return newLogs;
      });
    };
    document.addEventListener("custom_log", listener);
    return () => {
      document.removeEventListener("custom_log", listener);
    };
  }, [activeLogs]);

  return (
    <>
      {activeLogs
        ?.sort((a: any, b: any) => a.createdAt - b.createdAt)
        .map((log: any, index: number) => {
          return (
            <LogItem
              id={log.id}
              type={log.type}
              createdAt={log.createdAt}
              message={log.message}
              key={log.id}
              duration={log.duration}
              fadeInAfter={log.fadeInAfter}
              index={index * verticalDirection}
            />
          );
        })}
    </>
  );
};

const LogItem = ({ type, message = "", index = 0, createdAt, duration, fadeInAfter }: any) => {
  const now = Date.now();
  const remainTime = fadeInAfter + duration - now;
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  let opacity = now > fadeInAfter ? Math.min(remainTime / duration, 1) : 1;
  if (opacity < 0) opacity = 0;

  useEffect(() => {
    const c = setInterval(() => {
      forceUpdate();
    }, 100);
    return () => {
      clearInterval(c);
    };
  }, []);

  return (
    <Text2D
      text={`${message} (${moment(createdAt).format("hh:mm:ss.SSS")}) [${type}]`}
      right={18}
      top={(index + 1) * 18}
      textAlignHorizontal="right"
      textAlignVertical="top"
      fontSize={13}
      color={LOG_TYPE_COLOR[type] ?? "black"}
      opacity={opacity * 0.5}
      strokeColor="#aaa"
      strokeWidth={0.1}
      z={1.1}
    />
  );
};

const DEFAULT_OPTIONS = { duration: null };

const debug = (message: string, options = DEFAULT_OPTIONS) => {
  addLogItem(LOG_TYPE.DEBUG, message, null, options);
};

const info = (message: string, options = DEFAULT_OPTIONS) => {
  addLogItem(LOG_TYPE.INFO, message, null, options);
};

const warn = (message: string, options = DEFAULT_OPTIONS) => {
  addLogItem(LOG_TYPE.WARN, message, null, options);
};

const error = (message: string, options = DEFAULT_OPTIONS) => {
  addLogItem(LOG_TYPE.ERROR, message, null, options);
};

const debugf = (...message: any[]) => {
  const msg = message.map((m) => (typeof m == "string" ? m : JSON.stringify(m))).join(" ");
  addLogItem(LOG_TYPE.DEBUG, msg, null, DEFAULT_OPTIONS);
};

const infof = (...message: any[]) => {
  const msg = message.map((m) => (typeof m == "string" ? m : JSON.stringify(m))).join(" ");
  addLogItem(LOG_TYPE.INFO, msg, null, DEFAULT_OPTIONS);
};

const warnf = (...message: any[]) => {
  const msg = message.map((m) => (typeof m == "string" ? m : JSON.stringify(m))).join(" ");
  addLogItem(LOG_TYPE.WARN, msg, null, DEFAULT_OPTIONS);
};

const errorf = (...message: any[]) => {
  const msg = message.map((m) => (typeof m == "string" ? m : JSON.stringify(m))).join(" ");
  addLogItem(LOG_TYPE.ERROR, msg, null, DEFAULT_OPTIONS);
};

const addLogItem = (type: any, message: string, extra = null, options: any) => {
  const logEvent: any = new Event("custom_log", { bubbles: true });
  logEvent.data = {
    type,
    message,
    extra,
    options,
  };
  document.dispatchEvent(logEvent);
};

export default {
  Logger,
  debug,
  info,
  warn,
  error,
  debugf,
  infof,
  warnf,
  errorf,
};
