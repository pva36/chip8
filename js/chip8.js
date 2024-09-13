// class Uint8bit {
//   constructor() {
//     this._value = new Uint8Array(1);
//   }
//   get value() {
//     return this._value[0];
//   }
//   set value(value) {
//     if (typeof value !== "number" || value < 0) {
//       throw new Error("Must be an 8-bit unsigned integer");
//     } else {
//       this._value = value[0];
//     }
//   }
// }
//
// class Uint16bit {
//   constructor() {
//     this._value = new Uint16Array(1);
//   }
//   get value() {
//     return this._value[0];
//   }
//   set value(value) {
//     if (typeof value !== "number" || value < 0) {
//       throw new Error("Must be an 16-bit unsigned integer");
//     } else {
//       this._value[0] = value;
//     }
//   }
// }

class Chip8 {
  constructor() {
    this.memory = new Uint8Array(0x1000);

    // 16 general purpose 8-bit registers
    this.V = new Uint8Array(0x10);

    // I register (16-bit)
    // This is managed with the I getter and setter.
    this._I = new Uint16Array(1);

    // TODO: delay and sound timers (8-bit registers)

    // Program Counter (16-bit)
    this._PC = new Uint16Array(1);

    // Stack Pointer (8-bit)
    this._SP = new Uint8Array(1);

    // Stack (array of 16 16-bit values)
    this.S = new Uint16Array(0x10);
  }

  // Getter and setter for I register.
  get I() {
    return this._I[0];
  }
  set I(value) {
    this._I[0] = value;
  }

  // Getter and setter for Program Counter
  get PC() {
    return this._PC[0];
  }
  set PC(value) {
    this._PC[0] = value;
  }

  // Getter and setter for Stack Pointer
  get SP() {
    return this._PC[0];
  }
  set PC(value) {
    this._PC[0] = value;
  }
}

/* test */
let chip8 = new Chip8();
