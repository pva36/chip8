import { Chip8 as IChip8 } from "./interfaces/chip8";
import { Cpu } from "./cpu.js";
import { Display } from "./display.js";
import { Keyboard } from "./keyboard.js";
import { UInt8Register } from "./register.js";
import { UInt16Register } from "./register.js";

export class Chip8 implements IChip8 {
  memory: Uint8Array; // Memory
  i_register: UInt16Register; // I register
  delayTimer: UInt8Register; // Delay Timer
  soundTimer: UInt8Register; // Sound Timer
  pc: UInt16Register;

  private _v: Uint8Array = new Uint8Array(0x10); // Vx Registers

  private _sp: Uint8Array; // Stack Pointer
  private _stack: Uint16Array; // Stack

  displayDataArray: number[][]; // Internal Display Data

  displayObject: Display; // Display object (of class Display)

  skipAutoPc: boolean;

  Keyboard: Keyboard;

  runningLoops: any[] = [];

  romContainer: Uint8Array | null;

  // Constructor ------------------------------------------------------------
  constructor(displayObject: any, keyboardObject: any) {
    this.displayObject = displayObject;
    this.memory = new Uint8Array(0x1000);
    this.i_register = new UInt16Register(0);
    this.delayTimer = new UInt8Register(0);
    this.soundTimer = new UInt8Register(0);
    this.pc = new UInt16Register(0);

    this._v;

    this._sp = new Uint8Array(1);
    this._stack = new Uint16Array(0x10);

    // Display (64x32 pixels) rows: 32, cols: 64.
    this.displayDataArray = Array.from({ length: 32 }, () => Array(64).fill(0));

    this.setFonts();

    this.skipAutoPc = false;

    this.Keyboard = keyboardObject;

    this.romContainer = null;
  }

  // interface methods
  clear(): void {
    this.clearRegisters();

    this.clearRunningLoops();

    this.clearDisplay();
    this.setFonts();
  }

  loadRom(arrayBin: Uint8Array): void {
    // load program into the Chip8
    this.romContainer = arrayBin;
  }

  run(): void {
    // clear Chip8 object
    this.clear();

    // ensures that this.romContainer is not null, else, throw an error
    if (this.romContainer == null) {
      throw new Error("No Rom loaded!");
    }

    // load rom into memory, starting from location 0x200.
    let memIndex = 0x200; // TODO constant that gives more info about what is this
    for (const byte of this.romContainer as Uint8Array) {
      this.memory[memIndex++] = byte;
    }

    // run cpu
    Cpu.cpuRun(this);
  }

  pause(): void {
    // TODO
  }

  stop(): void {
    // TODO
  }

  resume(): void {
    // TODO
  }

  // Getters and Setters -----------------------------------------------------

  // Vx Registers
  // TODO: clean check logic
  getV(index: number) {
    if (index < 0 || index > 0xf) {
      throw Error(`V[<<${index}>>] doesn't exist!`);
    } else {
      return this._v[index];
    }
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

  // Getter and setter for Stack Pointer
  get sp() {
    return this._sp[0];
  }
  set sp(value: number) {
    // TODO: should a negative value in the stack pointer counter be allowed?
    // if (value < 0) {
    //   console.warn("A negative value has been assigned to the Stack Pointer!");
    // } else if (value > 0xffff) {
    //   console.warn(
    //     "A number greater than 65,535 has been assigned to the Stack Pointer",
    //   );
    // }
    this._sp[0] = value;
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

  // Interaction with other elements of the system
  /**
   * Run an 'asynchronous infinite loop' that executes the Renderer object.
   */
  runRendererObject(): void {
    setInterval(() => {
      this.displayObject.render(this.displayDataArray);
    });
  }

  /**
   * Sends `instruction` to be processed by the Chip8's cpu.
   */
  sendInstructionToCpu(instruction: number): void {
    Cpu.processInstruction(instruction, this);
  }

  /**
   * Clear Chip8's internal display data.
   */
  clearDisplay(): void {
    this.displayDataArray = Array.from({ length: 32 }, () => Array(64).fill(0));
  }

  /**
   * Set Chip8's fonts starting at address 0x50.
   */
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

  /**
   * Cleans memory, V registers, I register, delay and sound timers, program
   * counter, stack pointer and stack.
   */
  private clearRegisters(): void {
    // clean Memory (8-bit)
    for (let i = this.memory.length - 1; i >= 0; i--) {
      this.memory[i] = 0;
    }

    // clean Vx registers (8-bit)
    for (let i = this._v.length - 1; i >= 0; i--) {
      this.setV(i, 0);
    }

    // clean I register (16-bit)
    this.i_register.value = 0;

    // clean delay and sound timers (8-bit registers)
    this.delayTimer.value = 0;
    this.soundTimer.value = 0;

    // clean Program Counter (16-bit)
    this.pc.value = 0;

    // clean Stack Pointer (8-bit)
    this.sp = 0;

    // clean Stack
    for (let i = this._stack.length - 1; i >= 0; i--) {
      this.setStack(i, 0);
    }
  }

  private clearRunningLoops(): void {
    for (const runningLoop of this.runningLoops) {
      clearInterval(runningLoop);
    }
  }

  // TODO: get system info (in order to display info in the browser as a gui `debugger`)
}
