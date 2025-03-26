import { Chip8 as IChip8 } from "./interfaces/chip8";
import { Cpu } from "./cpu.js";
import { Display } from "./display.js";
import { Keyboard } from "./keyboard.js";
import {
  UInt8Register,
  UInt16Register,
  VRegisters,
  Stack,
} from "./register.js";

export class Chip8 implements IChip8 {
  memory: Uint8Array; // Memory
  i_register: UInt16Register; // I register
  delayTimer: UInt8Register; // Delay Timer
  soundTimer: UInt8Register; // Sound Timer
  pc: UInt16Register;
  v_registers: VRegisters; // V registers
  stack: Stack;

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
    this.v_registers = new VRegisters();
    this.stack = new Stack();

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

    this.clearDisplayData();

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

  // /**
  //  * Run an 'asynchronous infinite loop' that executes the Renderer object.
  //  */
  // runRendererObject(): void {
  //   setInterval(() => {
  //     this.displayObject.render(this.displayDataArray);
  //   });
  // }

  /**
   * Sends `instruction` to be processed by the Chip8's cpu.
   */
  sendInstructionToCpu(instruction: number): void {
    Cpu.processInstruction(instruction, this);
  }

  /**
   * Clear Chip8's internal display data.
   */
  clearDisplayData(): void {
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
    for (let i = this.v_registers.length - 1; i >= 0; i--) {
      this.v_registers.setV(i, 0);
    }

    // clean I register (16-bit)
    this.i_register.value = 0;

    // clean delay and sound timers (8-bit registers)
    this.delayTimer.value = 0;
    this.soundTimer.value = 0;

    // clean Program Counter (16-bit)
    this.pc.value = 0;

    // clean Stack Pointer (8-bit)
    this.stack.pointer = 0;

    // clean Stack
    for (let i = this.stack.length - 1; i >= 0; i--) {
      this.stack.setStack(i, 0);
    }
  }

  private clearRunningLoops(): void {
    for (const runningLoop of this.runningLoops) {
      clearInterval(runningLoop);
    }
  }

  // TODO: get system info (in order to display info in the browser as a gui `debugger`)
}
