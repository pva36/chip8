export class Chip8 {
  constructor() {
    this.memory = new Uint8Array(0x1000);

    // 16 general purpose 8-bit registers
    this.V = new Uint8Array(0x10);

    // I register (16-bit)
    // This is managed with the I getter and setter.
    this._I = new Uint16Array(1);

    // delay and sound timers (8-bit registers)
    // delayTimer (8-bit register)
    this._DT = new Uint8Array(1);
    // soundTimer (8-bit register)
    this._ST = new Uint8Array(1);

    // Program Counter (16-bit)
    this._PC = new Uint16Array(1);

    // Stack Pointer (8-bit)
    this._SP = new Uint8Array(1);

    // Stack (array of 16 16-bit values)
    this.S = new Uint16Array(0x10);

    // Display (64x32 pixels) rows: 64, cols: 32.
    this.Display = Array.from({ length: 64 }, () => Array(32).fill(0));
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
  set SP(value) {
    this._PC[0] = value;
  }

  // Getter and setter for delayTimer
  get delayTimer() {
    return this._DT[0];
  }
  set delayTimer(value) {
    this._DT[0] = value;
  }

  // Getter and setter for soundTimer
  get soundTimer() {
    return this._ST[0];
  }
  set soundTimer(value) {
    this._ST[0] = value;
  }

  // Instructions ------------------------------------------------------------

  // 0n nn
  //

  // 00 E0 -> CLS: clear the display
  CLS() {
    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 32; y++) {
        this.Display[x][y] = 0;
      }
    }
  }

  // 00 EE
  //

  // 1n nn -> JP addr: Jump to location n nn.
  // The interpreter sets the program counter to n nn.
  JP(instruction) {
    // get address using an AND mask (extract 12 least significant bits.
    const address = instruction & 0x0fff;

    this.PC = address;
  }

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
  LD_Vx_Byte(instruction) {
    const vIndex = (instruction & 0x0f00) >>> 8;
    const value = instruction & 0x00ff;

    this.V[vIndex] = value;
  }

  // 7x kk -> ADD Vx, byte
  // Set Vx = Vx + kk.
  // Adds the value kk to the value of register Vx, then stores the result
  // in Vx.

  ADD_Vx_byte(instruction) {
    const vIndex = (instruction & 0x0f00) >>> 8;
    const value = instruction & 0x00ff;

    this.V[vIndex] += value;
  }

  // An nn -> LD I, addr
  // Set I = n nn
  // The value of register I is set to n nn.
  LD_I_addr(instruction) {
    this.I = instruction & 0x0fff;
  }

  // Dxyn -> DRW Vx, Vy, nibble
  // Display n-byte sprite starting at memory location I at (Vx, Vy),
  // set VF = collision.
  DRW_Vx_Vy_nibble(instruction) {
    // set Vf == 0;
    this.V[0xf] == 0x0;

    const xIndex = (instruction & 0x0f00) >>> 8;
    const yIndex = (instruction & 0x00f0) >>> 4;
    const nibble = instruction & 0x000f;
    let startAddress = this.I;

    let x = this.V[xIndex];
    let y = this.V[yIndex];

    let mask;
    let maskShift;
    let rightShiftAmount;

    for (let i = nibble; i > 1; i--) {
      const currentByte = memory[startAddress];

      x = this.V[xIndex]; // reset the x-coordinate;
      mask = 0b10000000; // reset mask
      maskShift = 0;
      rightShiftAmount = 7; // reset right shift amount

      // set every bit on Display horizontally
      for (let i = 7; i >= 0; i--) {
        let value = (currentByte & mask) >>> rightShiftAmount;

        // wrap sprite around if outside screen edges
        if (x > 63) {
          x = x - 63;
        }
        if (y > 31) {
          y = y - 31;
        }

        // set the bit value into display
        this.Display[x][y] = this.Display ^ value;

        // Set Vf accordingly
        if (V[0xf] === 0) {
          // check only if Vf = 0
          if (this.Display[x][y] === 0) {
            this.V[0xf] = 0x1;
          }
        }

        // set variables for next iteration -------------------------
        rightShiftAmount--;
        // set mask in order to extract next bit to the right;
        maskShift++;
        mask = mask >>> maskShift;
        x++; // next column
      }
      // set variables for next iteration ---------------------------
      startAddress++;
      y++; // next row
    }
  }

  loadRom(Uint8Arrayfile) {
    let startAddress = 0x200;

    // console.log("Loading program into memory...");
    for (let byte of Uint8Arrayfile) {
      // console.log(`adding "${byte}" into address # ${startAddress}`);
      this.memory[startAddress++] = byte;
    }
    this.memory[0] = 0x1;
    // console.log([].map.call(this.memory, (x) => x.toString(16)));
  }

  clearRegisters() {
    this.I = 0x0;
    this.S = 0x0;
    for (let i = 0x0; i <= 0xf; i++) {
      this.V[i] = 0x0;
    }
    this.PC = 0x0;
    this.SP = 0x0;
    this.delayTimer = 0x0;
    this.soundTimer = 0x0;

    // debugging info
    // console.log("CPU initial state");
    // console.log(`I: ${this.I}`);
    // console.log(`S: ${this.S}`);
    // for (let i = 0x0; i <= 0xf; i++) {
    //   console.log(`V${i}: ${this.V[i]}`);
    // }
    // console.log(`PC: ${this.PC}`);
    // console.log(`SP: ${this.SP}`);
    // console.log(`delayTimer ${this.delayTimer}`);
    // console.log(`soundTimer: ${this.soundTimer}`);
  }

  cleanMemory() {
    // console.log("Cleaning memory...");
    for (let i = 0; i < this.memory.length; i++) {
      this.memory[i] = 0x0;

      // debugging
      // console.log(`memory address ${i}: ${this.memory[i]}`);
    }
  }

  // Set font data between 0x50 and 0x9F in memory
  setFontData() {
    let firstByte = 0x50;
    // 0
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;

    // 1
    this.memory[firstByte++] = 0x20;
    this.memory[firstByte++] = 0x60;
    this.memory[firstByte++] = 0x20;
    this.memory[firstByte++] = 0x20;
    this.memory[firstByte++] = 0x70;

    // 2
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;

    // 3
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0xf0;

    // 4
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0x10;

    // 5
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0xf0;

    // 6
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;

    // 7
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0x20;
    this.memory[firstByte++] = 0x40;
    this.memory[firstByte++] = 0x40;

    // 8
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;

    // 9
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x10;
    this.memory[firstByte++] = 0xf0;

    // A
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0x90;

    // B
    this.memory[firstByte++] = 0xe0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xe0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xe0;

    // C
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;

    // D
    this.memory[firstByte++] = 0xe0;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0x90;
    this.memory[firstByte++] = 0xe0;

    // E
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;

    // F
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte++] = 0xf0;
    this.memory[firstByte++] = 0x80;
    this.memory[firstByte] = 0x80;

    // console.log("Font data:");
    // for (let i = 0x50; i <= 0x9f; i++) {
    //   console.log(`memory address ${i}: ${this.memory[i]}`);
    // }
  }

  runProgram(file) {
    console.log("running!");
    this.clearRegisters();

    this.cleanMemory();

    this.setFontData();

    this.loadRom(file);

    // set program counter to the program's beginning
    this.PC = 0x200;
    console.log(`PC: ${this.PC}`);
  }
}

/* test */
// let chip8 = new Chip8();
