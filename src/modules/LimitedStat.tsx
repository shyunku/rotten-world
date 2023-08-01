class LimitedStat {
  public max: number;

  public current: number;

  constructor(current: number, max: number) {
    this.max = max;
    this.current = current;
  }

  public fill(): void {
    this.current = this.max;
  }

  public setCurrent(current: number): void {
    this.current = current;
  }

  public setMax(max: number): void {
    this.max = max;
  }

  public setMaxAndFill(max: number): void {
    this.max = max;
    this.fill();
  }

  public isFull(): boolean {
    return this.current === this.max;
  }

  public get rate(): number {
    return this.current / this.max;
  }

  // return overflowed value
  public add(value: number): number {
    this.current += value;
    if (this.current > this.max) {
      const overflow = this.current - this.max;
      this.current = this.max;
      return overflow;
    }
    return 0;
  }

  public subtract(value: number): void {
    this.current -= value;
    if (this.current < 0) {
      this.current = 0;
    }
  }

  public static createFilled(max: number): LimitedStat {
    return new LimitedStat(max, max);
  }

  public static create(current: number, max: number): LimitedStat {
    return new LimitedStat(current, max);
  }
}

export default LimitedStat;
