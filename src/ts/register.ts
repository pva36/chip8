export class UInt8Register {
  private _value = new Uint8Array(1);

  /**
   * If `input` is negative or greater than 0xff throw an error, else return
   * true.
   */
  private static checkRegInput(input: number, registerName: string): boolean {
    if (input < 0) {
      throw Error(`${registerName} cannot hold negative values!`);
    } else if (input > 0xff) {
      throw Error(`${registerName} cannot hold values greater than 0xff!`);
    }
    return true;
  }

  constructor(n: number) {
    // this.validNumber(n);
    this._value[0] = n;
  }

  // private validNumber(n: number) {
  //   if (n > 255) {
  //     throw Error("n must be less than 256");
  //   } else if (n < 0) {
  //     throw Error("n must be a positive number less than 256");
  //   }
  // }

  public get value() {
    return this._value[0];
  }

  /**
   * Set `value` as `n`. If `n` is greater
   * than 255 (0xff), the final value is (`n` - 255) - 1.
   */
  public set value(n: number) {
    // this.validNumber(n);
    this._value[0] = n;
  }
}

export class UInt16Register {
  private _value = new Uint16Array(1);

  /**
   * If `input` is negative or greater than 0xffff throw an error, else return
   * true.
   */
  private static checkRegInput(input: number, registerName: string): boolean {
    if (input < 0) {
      throw Error(`${registerName} cannot hold negative values!`);
    } else if (input > 0xffff) {
      throw Error(`${registerName} cannot hold values greater than 0xffff!`);
    }
    return true;
  }

  constructor(n: number) {
    // this.validNumber(n);
    this._value[0] = n;
  }

  // private validNumber(n: number) {
  //   if (n > 65535) {
  //     throw Error("n must be less than 65,536");
  //   } else if (n < 0) {
  //     throw Error("n must be a positive number less than 65,536");
  //   }
  // }

  public get value(): number {
    return this._value[0];
  }

  /**
   * Set `value` as `n`. If `n` is greater
   * than 65,535 (0xffff), the final value is (`n` - 65,535) - 1.
   */
  public set value(n: number) {
    // this.validNumber(n);
    this._value[0] = n;
  }
}
