import { Cpu } from "./cpu.js";
import { Renderer } from "./renderer.js";

export class Chip8 {
  /**
   * Static Methods ----------------------------------------------------------
   */
  static check16bitRegInput(input: number, registerName: string): boolean {
    if (input < 0) {
      throw Error(`${registerName} cannot hold negative values!`);
    } else if (input > 0xffff) {
      throw Error(`${registerName} cannot hold values greater than 0xffff!`);
    }
    return true;
  }

  static check8bitRegInput(input: number, registerName: string): boolean {
    if (input < 0) {
      throw Error(`${registerName} cannot hold negative values!`);
    } else if (input > 0xff) {
      throw Error(`${registerName} cannot hold values greater than 0xff!`);
    }
    return true;
  }

  /**
   * Variable declarations ---------------------------------------------------
   */

  // Memory
  memory: Uint8Array;

  // Vx registers
  private _v: Uint8Array = new Uint8Array(0x10);

  // I register
  private _i: Uint16Array;

  // Delay Timer
  private _delayTimer: Uint8Array;

  // Sound Timer
  private _soundTimer: Uint8Array;

  // Program Counter
  private _pc: Uint16Array;

  // Stack Pointer
  private _sp: Uint8Array;

  // Stack
  private _stack: Uint16Array;

  // Display
  display: number[][];

  displayObject: Renderer;

  /**
   * Constructor ------------------------------------------------------------
   */
  constructor(displayObject: any) {
    // display object of class Renderer
    this.displayObject = displayObject;

    // Memory (8-bit)
    this.memory = new Uint8Array(0x1000);

    // Vx registers (8-bit)
    this._v;

    // I register (16-bit)
    this._i = new Uint16Array(1);

    // delay and sound timers (8-bit registers)
    this._delayTimer = new Uint8Array(1);
    this._soundTimer = new Uint8Array(1);

    // Program Counter (16-bit)
    this._pc = new Uint16Array(1);

    // Stack Pointer (8-bit)
    this._sp = new Uint8Array(1);

    // Stack (array of 16 16-bit values)
    this._stack = new Uint16Array(0x10);

    // Display (64x32 pixels) rows: 32, cols: 64.
    this.display = Array.from({ length: 32 }, () => Array(64).fill(0));

    this.setFonts();
  }

  /**
   * Getters and Setters -----------------------------------------------------
   */

  // Vx Registers
  // TODO: clean check logic
  getV(index: number) {
    if (index < 0 || index > 0xf) {
      throw Error(`V[<<${index}>>] doesn't exist!`);
    } else {
      return this._v[index];
    }
  }
  setV(index: number, value: number) {
    if (index < 0 || index > 0xf) {
      throw Error(`V[<<${index}>>] doesn't exist!`);
    } else if (value < 0 || value > 0xff) {
      throw Error(`V[${index} cannot hold values greater than 255 (0xFF)]`);
    }
    this._v[index] = value;
  }

  // Getter and setter for I register.
  // TODO: clean check logic
  get i() {
    return this._i[0];
  }
  set i(value: number) {
    if (value < 0) {
      throw Error("The I register cannot hold a negative value!");
    } else if (value > 0xffff) {
      throw Error(
        "The I register cannot hold a number greater than 65.535(0xFFFF)",
      );
    } else {
      this._i[0] = value;
    }
  }

  // Getter and setter for Program Counter
  // TODO: clean check logic
  get pc() {
    return this._pc[0];
  }
  set pc(value: number) {
    if (value < 0) {
      throw Error("The PROGRAM COUNTER cannot hold a negative value!");
    } else if (value > 0xffff) {
      throw Error(
        "The PROGRAM COUNTER register cannot hold a number greater than 65.535(0xFFFF)",
      );
    } else {
      this._pc[0] = value;
    }
  }

  // Getter and setter for Stack Pointer
  // TODO clean check logic
  get sp() {
    return this._sp[0];
  }
  set sp(value: number) {
    // TODO: should a negative value in the stack pointer counter be allowed?
    if (value < 0) {
      throw Error("The STACK POINTER cannot hold a negative value!");
    } else if (value > 0xffff) {
      throw Error(
        "The STACK POINTER cannot hold a number greater than 65.535(0xFFFF)",
      );
    } else {
      this._sp[0] = value;
    }
  }

  // Getter and setter for Stack
  getStack(index: number) {
    return this._stack[index];
  }
  setStack(index: number, value: number) {
    if (index < 0 || index > 16) {
      throw Error(
        `Index of the STACK must be between 0 and 16. A ${index} was provided!`,
      );
    }
    if (Chip8.check16bitRegInput(value, "STACK[${}]")) {
      this._stack[index] = value;
    }
  }

  // Getter and setter for delayTimer
  get delayTimer() {
    return this._delayTimer[0];
  }
  set delayTimer(value: number) {
    if (Chip8.check8bitRegInput(value, "Delay Timer")) {
      this._delayTimer[0] = value;
    }
  }

  // Getter and setter for soundTimer
  get soundTimer() {
    return this._soundTimer[0];
  }
  set soundTimer(value) {
    if (Chip8.check8bitRegInput(value, "Sound Timer")) {
      this._soundTimer[0] = value;
    }
  }

  /**
   * Interaction with other elements of the system
   */

  /**
   * Reset the Chip8 object to an original state.
   */
  reset(): void {
    // TODO: clean chip8 components.
    this.clearRegisters();

    this.clearDisplay();
    this.setFonts();
  }

  fetchBinary(arrayBin: Uint8Array): void {
    /**
     * prepare chip8 for execution:
     */
    this.reset();

    // load program into memory, starting from location 0x200;
    let memIndex = 0x200;
    for (const byte of arrayBin) {
      this.memory[memIndex++] = byte;
    }

    /**
     * Run Cpu and Renderer
     */
    Cpu.cpuRun(this);
    this.runRendererObject();
  }

  runRendererObject(): void {
    setInterval(() => {
      this.displayObject.diplayRun(this.display);
    });
  }

  sendInstructionToCpu(instruction: number): void {
    Cpu.processInstruction(instruction, this);
  }

  clearDisplay(): void {
    this.display = Array.from({ length: 32 }, () => Array(64).fill(0));
  }

  setFonts(): void {
    const fontsArray = [
      0xf0, // 0
      0x90,
      0x90,
      0x90,
      0xf0,
      0x20, // 1
      0x60,
      0x20,
      0x20,
      0x70,
      0xf0, // 2
      0x10,
      0xf0,
      0x80,
      0xf0,
      0xf0, // 3
      0x10,
      0xf0,
      0x10,
      0xf0,
      0x90, // 4
      0x90,
      0xf0,
      0x10,
      0x10,
      0xf0, // 5
      0x80,
      0xf0,
      0x10,
      0xf0,
      0xf0, // 6
      0x80,
      0xf0,
      0x90,
      0xf0,
      0xf0, // 7
      0x10,
      0x20,
      0x40,
      0x40,
      0xf0, // 8
      0x90,
      0xf0,
      0x90,
      0xf0,
      0xf0, // 9
      0x90,
      0xf0,
      0x10,
      0xf0,
      0xf0, // A
      0x90,
      0xf0,
      0x90,
      0x90,
      0xe0, // B
      0x90,
      0xe0,
      0x90,
      0xe0, // C
      0xf0,
      0x80,
      0x80,
      0x80,
      0xf0,
      0xe0, // D
      0x90,
      0x90,
      0x90,
      0xe0,
      0xf0, // E
      0x80,
      0xf0,
      0x80,
      0xf0,
      0xf0, // F
      0x80,
      0xf0,
      0x80,
      0x80,
    ];
    for (let i = 0x50, j = 0; i <= 0x9f; i++, j++) {
      this.memory[i] = fontsArray[j];
    }
  }

  clearRegisters(): void {
    // clean Memory (8-bit)
    for (let i = this.memory.length - 1; i >= 0; i--) {
      this.memory[i] = 0;
    }

    // clean Vx registers (8-bit)
    for (let i = this._v.length - 1; i >= 0; i--) {
      this.setV(i, 0);
    }

    // clean I register (16-bit)
    this.i = 0;

    // clean delay and sound timers (8-bit registers)
    this.delayTimer = 0;
    this.soundTimer = 0;

    // clean Program Counter (16-bit)
    this.pc = 0;

    // clean Stack Pointer (8-bit)
    this.sp = 0;

    // clean Stack
    for (let i = this._stack.length - 1; i >= 0; i--) {
      this.setStack(i, 0);
    }
  }

  // TODO: get system info (in order to display info in the browser as a gui `debugger`)
}
