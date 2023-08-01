class Stat {
  public value: number;
  public valueExtra: number;

  constructor(value: number, valueExtra: number) {
    this.value = value;
    this.valueExtra = valueExtra;
  }

  public get(): number {
    return this.value + this.valueExtra;
  }

  public setDefault(value: number): void {
    this.value = value;
  }

  public addExtra(value: number): void {
    this.valueExtra += value;
  }

  public static create(value: number): Stat {
    return new Stat(value, 0);
  }
}

export default Stat;
