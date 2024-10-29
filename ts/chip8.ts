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
  private memory: Uint8Array;

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
  private display: number[][];

  private displayObject: Renderer;

  private cpu: Cpu;

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

  // Instructions ------------------------------------------------------------

  // 0n nn
  //

  // 00 E0 -> CLS: clear the display
  // CLS() {
  //   for (let x = 0; x < 64; x++) {
  //     for (let y = 0; y < 32; y++) {
  //       this.display[x][y] = 0;
  //     }
  //   }
  // }

  // 00 EE
  //

  // 1n nn -> JP addr: Jump to location n nn.
  // The interpreter sets the program counter to n nn.
  // JP(instruction) {
  //   // get address using an AND mask (extract 12 least significant bits.
  //   const address = instruction & 0x0fff;

  //   this.pc = address;
  // }

  // 2n nn
  //

  // 3x kk
  //

  // 4x kk
  //

  // 5x y0
  //

  // 6x kk -> LD Vx, byte
  // Set Vx = kk.
  // The interpreter puts the value kk into register Vx
  // LD_Vx_Byte(instruction) {
  //   const vIndex = (instruction & 0x0f00) >>> 8;
  //   const value = instruction & 0x00ff;

  //   this._v[vIndex] = value;
  // }

  // 7x kk -> ADD Vx, byte
  // Set Vx = Vx + kk.
  // Adds the value kk to the value of register Vx, then stores the result
  // in Vx.

  // ADD_Vx_byte(instruction) {
  //   const vIndex = (instruction & 0x0f00) >>> 8;
  //   const value = instruction & 0x00ff;
  //   this._v[vIndex] += value;
  // }

  // An nn -> LD I, addr
  // Set I = n nn
  // The value of register I is set to n nn.
  // LD_I_addr(instruction) {
  //   this.i = instruction & 0x0fff;
  // }

  // Dxyn -> DRW Vx, Vy, nibble
  // Display n-byte sprite starting at memory location I at (Vx, Vy),
  // set VF = collision.
  // DRW_Vx_Vy_nibble(instruction) {
  //   // set Vf == 0;
  //   this._v[0xf] == 0x0;

  //   const xIndex = (instruction & 0x0f00) >>> 8;
  //   const yIndex = (instruction & 0x00f0) >>> 4;
  //   const nibble = instruction & 0x000f;
  //   let startAddress = this.i;

  //   let x = this._v[xIndex];
  //   let y = this._v[yIndex];

  //   let mask;
  //   let maskShift;
  //   let rightShiftAmount;

  //   for (let i = nibble; i > 1; i--) {
  //     const currentByte = memory[startAddress];

  //     x = this._v[xIndex]; // reset the x-coordinate;
  //     mask = 0b10000000; // reset mask
  //     maskShift = 0;
  //     rightShiftAmount = 7; // reset right shift amount

  //     // set every bit on Display horizontally
  //     for (let i = 7; i >= 0; i--) {
  //       let value = (currentByte & mask) >>> rightShiftAmount;

  //       // wrap sprite around if outside screen edges
  //       if (x > 63) {
  //         x = x - 63;
  //       }
  //       if (y > 31) {
  //         y = y - 31;
  //       }

  //       // set the bit value into display
  //       this.display[x][y] = this.display ^ value;

  //       // Set Vf accordingly
  //       if (V[0xf] === 0) {
  //         // check only if Vf = 0
  //         if (this.display[x][y] === 0) {
  //           this._v[0xf] = 0x1;
  //         }
  //       }

  //       // set variables for next iteration -------------------------
  //       rightShiftAmount--;
  //       // set mask in order to extract next bit to the right;
  //       maskShift++;
  //       mask = mask >>> maskShift;
  //       x++; // next column
  //     }
  //     // set variables for next iteration ---------------------------
  //     startAddress++;
  //     y++; // next row
  //   }
  // }

  // loadRom(Uint8Arrayfile) {
  //   let startAddress = 0x200;

  //   // console.log("Loading program into memory...");
  //   for (let byte of Uint8Arrayfile) {
  //     // console.log(`adding "${byte}" into address # ${startAddress}`);
  //     this.memory[startAddress++] = byte;
  //   }
  //   this.memory[0] = 0x1;
  //   // console.log([].map.call(this.memory, (x) => x.toString(16)));
  // }

  // clearRegisters() {
  //   this.i = 0x0;
  //   this._stack = 0x0;
  //   for (let i = 0x0; i <= 0xf; i++) {
  //     this._v[i] = 0x0;
  //   }
  //   this.pc = 0x0;
  //   this.sp = 0x0;
  //   this.delayTimer = 0x0;
  //   this.soundTimer = 0x0;

  //   // debugging info
  //   // console.log("CPU initial state");
  //   // console.log(`I: ${this.I}`);
  //   // console.log(`S: ${this.S}`);
  //   // for (let i = 0x0; i <= 0xf; i++) {
  //   //   console.log(`V${i}: ${this.V[i]}`);
  //   // }
  //   // console.log(`PC: ${this.PC}`);
  //   // console.log(`SP: ${this.SP}`);
  //   // console.log(`delayTimer ${this.delayTimer}`);
  //   // console.log(`soundTimer: ${this.soundTimer}`);
  // }

  // cleanMemory() {
  //   // console.log("Cleaning memory...");
  //   for (let i = 0; i < this.memory.length; i++) {
  //     this.memory[i] = 0x0;

  //     // debugging
  //     // console.log(`memory address ${i}: ${this.memory[i]}`);
  //   }
  // }

  // // Set font data between 0x50 and 0x9F in memory
  // setFontData() {
  //   let firstByte = 0x50;
  //   // 0
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;

  //   // 1
  //   this.memory[firstByte++] = 0x20;
  //   this.memory[firstByte++] = 0x60;
  //   this.memory[firstByte++] = 0x20;
  //   this.memory[firstByte++] = 0x20;
  //   this.memory[firstByte++] = 0x70;

  //   // 2
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;

  //   // 3
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0xf0;

  //   // 4
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0x10;

  //   // 5
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0xf0;

  //   // 6
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;

  //   // 7
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0x20;
  //   this.memory[firstByte++] = 0x40;
  //   this.memory[firstByte++] = 0x40;

  //   // 8
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;

  //   // 9
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x10;
  //   this.memory[firstByte++] = 0xf0;

  //   // A
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0x90;

  //   // B
  //   this.memory[firstByte++] = 0xe0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xe0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xe0;

  //   // C
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;

  //   // D
  //   this.memory[firstByte++] = 0xe0;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0x90;
  //   this.memory[firstByte++] = 0xe0;

  //   // E
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;

  //   // F
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte++] = 0xf0;
  //   this.memory[firstByte++] = 0x80;
  //   this.memory[firstByte] = 0x80;

  //   // console.log("Font data:");
  //   // for (let i = 0x50; i <= 0x9f; i++) {
  //   //   console.log(`memory address ${i}: ${this.memory[i]}`);
  //   // }
  // }

  // runProgram(file) {
  //   console.log("running!");
  //   this.clearRegisters();

  //   this.cleanMemory();

  //   this.setFontData();

  //   this.loadRom(file);

  //   // set program counter to the program's beginning
  //   this.pc = 0x200;
  //   console.log(`PC: ${this.pc}`);
  // }
}
