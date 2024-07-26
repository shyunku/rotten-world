class Keyboard {
  private keys: Map<string, boolean>;
  private listeners: Map<string[], any>;

  constructor() {
    this.keys = new Map<string, boolean>();
    this.listeners = new Map<string[], any>();
    this.init();
  }

  public isPressed(key: string) {
    return this.keys.get(key);
  }

  public on(keys: string[], callback: any) {
    this.listeners.set(keys, callback);
  }

  private init() {
    document.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      if (e.key === "CapsLock") return;
      this.keys.set(e.key, true);
      this.listeners.forEach((callback, keys) => {
        if (keys.includes(e.key)) callback();
      });
    });

    document.addEventListener("keyup", (e) => {
      this.keys.set(e.key, false);
      this.listeners.forEach((callback, keys) => {
        if (keys.includes(e.key)) callback();
      });
    });
  }
}

export default Keyboard;
