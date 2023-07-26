abstract class Drawable {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  public abstract update(t: number): void;
  public abstract draw(): JSX.Element;
}

export default Drawable;
