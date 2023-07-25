import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";
import Text2D from "../atom/Text2D";
import moment from "moment";

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
  [LOG_TYPE.DEBUG]: "gray",
  [LOG_TYPE.INFO]: "blue",
  [LOG_TYPE.WARN]: "orange",
  [LOG_TYPE.ERROR]: "red",
  [LOG_TYPE.SUCCESS]: "green",
};

export const Logger = ({ position = POSITION.TOP_RIGHT, expiresIn = 3000, maxSize = 30 }) => {
  const [activeLogs, setActiveLogs] = useState<any>([]);
  const fadeOutDuration = useMemo(() => 300, []);
  const verticalDirection = useMemo(() => (position.split("-")[0] == "top" ? 1 : -1), [position]);

  useEffect(() => {
    const listener = (data: any) => {
      const logData = data.data;
      const logId = `log-${v4()}`;
      const maintainDuration = logData?.options?.duration ?? expiresIn;

      setActiveLogs((prev: any) => {
        const log = { ...logData, id: logId, createdAt: Date.now(), duration: expiresIn };
        let newLogs = [...prev, log];
        if (newLogs.length > maxSize) {
          newLogs = newLogs.slice(-maxSize);
        }
        return newLogs;
      });
      setTimeout(() => {
        const logToBeFadeOut = document.getElementById(logId);
        if (logToBeFadeOut) {
          logToBeFadeOut.classList.add("fade-out");
          setTimeout(() => {
            setActiveLogs((prev: any) => prev.filter((t: any) => t.id !== logId));
          }, fadeOutDuration);
        }
      }, maintainDuration);
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
              index={index * verticalDirection}
            />
          );
        })}
    </>
  );
};

const LogItem = ({ type, message = "", index = 0, createdAt }: any) => {
  return (
    <Text2D
      text={`${message} (${moment(createdAt).format("hh:mm:ss")}) [${type}]`}
      right={18}
      top={(index + 1) * 18}
      textAlignHorizontal="right"
      textAlignVertical="top"
      fontSize={12}
      color={LOG_TYPE_COLOR[type] ?? "black"}
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

const success = (message: string, options = DEFAULT_OPTIONS) => {
  addLogItem(LOG_TYPE.SUCCESS, message, null, options);
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
  success,
};
