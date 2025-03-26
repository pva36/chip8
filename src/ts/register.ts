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

export class VRegisters {
  private _v: Uint8Array = new Uint8Array(0x10);
  // length = this._v.length;

  // TODO: clean check logic
  getV(index: number) {
    if (index < 0 || index > 0xf) {
      throw Error(`V[<<${index}>>] doesn't exist!`);
    } else {
      return this._v[index];
    }
  }

  get length() {
    return this._v.length;
  }

  /**
   * Set `value` as the value of the V(`index`)  register. If `value` is greater
   * than 255 (0xff), the final value is (`value` - 255) - 1.
   */
  setV(index: number, value: number) {
    if (index < 0 || index > 0xf) {
      throw Error(`V[<<${index}>>] doesn't exist!`);
    }
    // if (value < 0) {
    //   console.error(`value: ${value} is negative`);
    // }
    // if (value > 0xff) {
    //   console.warn(`value: ${value} is greater than 255`);
    //   // throw Error(`V[${index}] cannot hold values greater than 255 (0xFF)`);
    // }
    this._v[index] = value;
  }
}

export class Stack {
  private _stack: Uint16Array = new Uint16Array(0x10);
  private _pointer: Uint8Array = new Uint8Array(1);

  get length() {
    return this._stack.length;
  }

  get pointer() {
    return this._pointer[0];
  }

  set pointer(value: number) {
    // TODO: should a negative value in the stack pointer counter be allowed?
    // if (value < 0) {
    //   console.warn("A negative value has been assigned to the Stack Pointer!");
    // } else if (value > 0xffff) {
    //   console.warn(
    //     "A number greater than 65,535 has been assigned to the Stack Pointer",
    //   );
    // }
    this._pointer[0] = value;
  }

  // Getter and setter for Stack
  getStack(index: number) {
    return this._stack[index];
  }
  setStack(index: number, value: number) {
    // if (index < 0 || index > 16) {
    //   throw Error(
    //     `Index of the STACK must be between 0 and 16. A ${index} was provided!`,
    //   );
    // }
    // if (Chip8.check16bitRegInput(value, "STACK[${}]")) {
    //   this._stack[index] = value;
    // }
    this._stack[index] = value;
  }
}
