export interface Something {
  readonly something: string;
}
export class SomethingEntity implements Something {
  readonly something: string;
  constructor(data: Something) {
    this.something = data.something;
  }
}
