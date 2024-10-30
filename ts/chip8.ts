import { Cpu } from "./cpu.js";

interface Renderer {
  scale: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cols: number;
  rows: number;
  renderDisplay: Function;
  clearScreen: Function;
  run_rendererDemo: Function;
}

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

  cpu: Cpu;

  /**
   * Constructor ------------------------------------------------------------
   */
  constructor(displayObject: Renderer) {
    this.cpu = new Cpu(this);

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

    // Display (64x32 pixels) rows: 64, cols: 32.
    this.display = Array.from({ length: 64 }, () => Array(32).fill(0));
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
  fetchBinary(arrayBin: Uint8Array) {
    console.log([].map.call(arrayBin, (x: number) => x.toString(16)));
    let switcher = true;

    // test connection with renderer
    setInterval(() => {
      this.displayObject.clearScreen();
      this.displayObject.run_rendererDemo(switcher);
      if (switcher) switcher = false;
      else switcher = true;
    }, 1000);
  }

  sendInstructionToCpu(instruction: number) {
    this.cpu.processInstruction(instruction);
  }

  clearDisplay(): void {
    this.display = Array.from({ length: 64 }, () => Array(32).fill(0));
    // console.log(this.display);
  }

  // chip 8 helper functions
  // clear registers (reset)
  // get instruction (to pass it to the `cpu`)
  // get system info (in order to display info in the browser as a gui `debugger`)
  //
}
