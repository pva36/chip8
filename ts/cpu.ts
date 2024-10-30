// to avoid declaring an interface
import { Chip8 } from "./chip8.js";

export class Cpu {
  chip8: Chip8;

  constructor(chip8: Chip8) {
    this.chip8 = chip8;
  }

  /**
   * Switches ----------------------------------------------------------------
   */

  processInstruction(instruction: number): void {
    console.log(`executing instruction '${instruction.toString(16)}'`);

    // check that instruction is one byte (I want to be very careful);
    if (instruction < 0 && instruction > 0xffff) {
      throw Error(
        "Chip8's CPU cannot handle instructions that aren't 16-bit (2 bytes) long",
      );
    } else {
      // get the first nibble
      let firstNibble = instruction & 0xf000;
      // console.log(firstNibble);

      switch (firstNibble) {
        case 0x0000:
          this.processInstruction0(instruction);
          break;

        case 0x1000:
          // console.log(`instruction starts with 0x1`);
          this.jp1nnn(instruction);
          break;

        case 0x2000:
          console.log(`instruction starts with 0x2`);
          break;

        case 0x3000:
          console.log(`instruction starts with 0x3`);
          break;

        case 0x4000:
          console.log(`instruction starts with 0x4`);
          break;

        case 0x5000:
          console.log(`instruction starts with 0x5`);
          break;

        case 0x6000:
          this.ld6xkk(instruction);
          break;

        case 0x7000:
          this.add7xkk(instruction);
          break;

        case 0x8000:
          console.log(`instruction starts with 0x8`);
          break;

        case 0x9000:
          console.log(`instruction starts with 0x9`);
          break;

        case 0xa000:
          this.ldAnnn(instruction);
          break;

        case 0xb000:
          console.log(`instruction starts with 0xB`);
          break;

        case 0xc000:
          console.log(`instruction starts with 0xC`);
          break;

        case 0xd000:
          this.drwDxyn(instruction);
          break;

        case 0xe000:
          console.log(`instruction starts with 0xE`);
          break;

        case 0xf000:
          console.log(`instruction starts with 0xF`);
          break;

        default:
          throw Error("Error at the entry switch!");
      }
    }
  }
  processInstruction0(instruction: number): void {
    let secondNibble = instruction & 0x0f00;
    switch (secondNibble) {
      case 0x0100:
      case 0x0200:
      case 0x0300:
      case 0x0400:
      case 0x0500:
      case 0x0600:
      case 0x0700:
      case 0x0800:
      case 0x0900:
      case 0x0a00:
      case 0x0b00:
      case 0x0c00:
      case 0x0d00:
      case 0x0e00:
      case 0x0f00:
        /// console.log(`Instruction has the form 0x0nnn`);
        this.sys0nnn(instruction);
        break;
      case 0x0000:
        // console.log(`Instruction has the form 0x00nn`);
        let thirdFourthNibble = instruction & 0x00ff;
        switch (thirdFourthNibble) {
          case 0x00e0:
            this.cls00E0(instruction);
            break;
          case 0x00ee:
            this.ret00EE();
            break;
          default:
            throw Error("Error at switch 0x00Ex");
        }
        break;
      default:
        throw Error("Error at switch of 0x0---");
    }
  }

  /**
   * Instructions ------------------------------------------------------------
   */
  sys0nnn(instruction: number): void {
    // TODO: implement
    console.log(`inside sys0nnn`);
  }

  cls00E0(instruction: number): void {
    // console.log(`inside cls00E0`);
    this.chip8.clearDisplay();
  }

  ret00EE(): void {
    // console.log(`inside ret00EE`);

    let ch8 = this.chip8;
    // set pc to address at the top of the stack
    ch8.pc = ch8.getStack(ch8.sp);

    // subtracts 1 from the stack pointer.
    try {
      ch8.sp -= 1;
    } catch {
      console.error(
        "Instruction tried to subtract from STACK POINTER with a negative value as a result",
        "or tried to add to STACK POINTER with a value greater than 0xFF as a result",
      );
    }
  }

  jp1nnn(instruction: number) {
    // console.log(`js1nnn`);
    // the interpreter sets the program counter to `nnn`
    let address = instruction & 0x0fff;

    this.chip8.pc = address;

    // console.log("pc: ", this.chip8.pc);
  }

  call2nnn(instruction: number) {}

  se3xkk(instruction: number) {}

  sne4xkk(instruction: number) {}

  se5xy0(instruction: number) {}

  ld6xkk(instruction: number) {
    // Set Vx = kk.
    // The intepreter puts the value kk into register Vx.

    const value = instruction & 0x00ff;
    const index = (instruction & 0x0f00) >> 8;
    // console.log("value =", value.toString(16), ", index =", index.toString(16));

    this.chip8.setV(index, value);
  }

  add7xkk(instruction: number) {
    // Set Vx = Vx + kk
    // Adds the value kk to the value of register Vx, then stores the result in Vx.
    const value = instruction & 0x00ff;
    const index = (instruction & 0x0f00) >> 8;

    const currentValue = this.chip8.getV(index);
    this.chip8.setV(index, value + currentValue);
  }

  ld8xy0(instruction: number) {}

  or8xy1(instruction: number) {}

  and8xy2(instruction: number) {}

  xor8xy3(instruction: number) {}

  add8xy4(instruction: number) {}

  sub8xy5(instruction: number) {}

  shr8xy6(instruction: number) {}

  subn8xy7(instruction: number) {}

  shl8xyE(instruction: number) {}

  sne9xy0(instruction: number) {}

  ldAnnn(instruction: number) {
    // Set I = nnn
    // The value of register I is set to nnn

    const address = instruction & 0x0fff;
    this.chip8.i = address;
  }

  jpBnnn(instruciton: number) {}

  rndCxkk(instruction: number) {}

  drwDxyn(instruction: number) {
    // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.

    const ch8 = this.chip8;

    const x = (instruction & 0x0f00) >> 8;
    const y = (instruction & 0x00f0) >> 4;
    const n = instruction & 0x000f;

    // get Vx and Vy
    const xCoord = ch8.getV(x);
    let yCoord = ch8.getV(y);

    // fill array with sprite's data
    let spriteArray: number[] = [];
    let memIndex = ch8.i;
    for (; memIndex <= n; memIndex++) {
      spriteArray.push(ch8.memory[memIndex]);
    }

    // VF
    ch8.setV(0xf, 0);
    let vFalreadyOn = false;

    // draw into display
    for (const byte of spriteArray) {
      let currentX: number = xCoord;
      let currentY: number = yCoord;
      let bitOffset = 7;
      let mask: number = 0b1000_0000;

      for (let j = 8; j > 0; j--, bitOffset--, currentX++, mask >> 1) {
        let displayPixelOldValue = ch8.display[currentY][currentX];
        ch8.display[currentY][currentX] ^= (byte & mask) >> bitOffset;

        // first check VF is already set to 1.
        if (vFalreadyOn === false) {
          if (
            displayPixelOldValue === 1 &&
            displayPixelOldValue !== ch8.display[currentY][currentX]
          ) {
            ch8.setV(0xf, 1);
            vFalreadyOn = true;
          }
        }
      }
      yCoord++; // next iteration of loop operate over next row on display
    }
  }

  skpEx9E(instruction: number) {}

  sknpExA1(instruction: number) {}

  ldFx07(instruction: number) {}

  ldFx0A(instruction: number) {}

  ldFx15(instruction: number) {}

  ldFx18(instruction: number) {}

  addFx1E(instruction: number) {}

  ldFx29(instruction: number) {}

  ldFx33(instruction: number) {}

  ldFx55(instruction: number) {}

  ldFx65(instruction: number) {}

  /**
   * Super chip-48 Instructions
   */
}
