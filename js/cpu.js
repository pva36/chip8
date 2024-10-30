export class Cpu {
    constructor(chip8) {
        this.chip8 = chip8;
    }
    /**
     * Run
     */
    executeProgram() {
        const ch8 = this.chip8;
        ch8.pc = 0x200;
        setInterval(() => {
            // set instruction:
            let highByte = ch8.memory[ch8.pc];
            let lowByte = ch8.memory[ch8.pc + 1];
            let instruction = 0 | (highByte << 8);
            instruction = instruction | lowByte;
            // console.log("pc", ch8.pc);
            this.processInstruction(instruction);
            ch8.pc += 2; // increment after each operation
        });
    }
    /**
     * Switches ----------------------------------------------------------------
     */
    processInstruction(instruction) {
        console.log(`executing instruction '${instruction.toString(16)}'`);
        // check that instruction is one byte (I want to be very careful);
        if (instruction < 0 && instruction > 0xffff) {
            throw Error("Chip8's CPU cannot handle instructions that aren't 16-bit (2 bytes) long");
        }
        else {
            // get the first nibble
            let firstNibble = instruction & 0xf000;
            // console.log(firstNibble);
            switch (firstNibble) {
                case 0x0000:
                    this.processInstruction0(instruction);
                    break;
                case 0x1000:
                    this.jp1nnn(instruction);
                    break;
                case 0x2000:
                    console.log(`instruction starts with 0x2`);
                    console.error(`0x2nnn not implemented`);
                    break;
                case 0x3000:
                    console.log(`instruction starts with 0x3`);
                    console.error(`0x3nnn not implemented`);
                    break;
                case 0x4000:
                    console.log(`instruction starts with 0x4`);
                    console.error(`0x4nnn not implemented`);
                    break;
                case 0x5000:
                    console.log(`instruction starts with 0x5`);
                    console.error(`0x5nnn not implemented`);
                    break;
                case 0x6000:
                    this.ld6xkk(instruction);
                    break;
                case 0x7000:
                    this.add7xkk(instruction);
                    break;
                case 0x8000:
                    console.log(`instruction starts with 0x8`);
                    console.error(`0x8nnn not implemented`);
                    break;
                case 0x9000:
                    console.log(`instruction starts with 0x9`);
                    console.error(`0x9nnn not implemented`);
                    break;
                case 0xa000:
                    this.ldAnnn(instruction);
                    break;
                case 0xb000:
                    console.log(`instruction starts with 0xB`);
                    console.error(`0xBnnn not implemented`);
                    break;
                case 0xc000:
                    console.log(`instruction starts with 0xC`);
                    console.error(`0xCnnn not implemented`);
                    break;
                case 0xd000:
                    this.drwDxyn(instruction);
                    break;
                case 0xe000:
                    console.log(`instruction starts with 0xE`);
                    console.error(`0xEnnn not implemented`);
                    break;
                case 0xf000:
                    console.log(`instruction starts with 0xF`);
                    console.error(`0xFnnn not implemented`);
                    break;
                default:
                    throw Error("Error at the entry switch!");
            }
        }
    }
    processInstruction0(instruction) {
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
    sys0nnn(instruction) {
        // TODO: implement
        console.log(`inside sys0nnn`);
    }
    cls00E0(instruction) {
        // console.log(`inside cls00E0`);
        this.chip8.clearDisplay();
    }
    ret00EE() {
        // console.log(`inside ret00EE`);
        let ch8 = this.chip8;
        // set pc to address at the top of the stack
        ch8.pc = ch8.getStack(ch8.sp);
        // subtracts 1 from the stack pointer.
        try {
            ch8.sp -= 1;
        }
        catch (_a) {
            console.error("Instruction tried to subtract from STACK POINTER with a negative value as a result", "or tried to add to STACK POINTER with a value greater than 0xFF as a result");
        }
    }
    jp1nnn(instruction) {
        // console.log(`js1nnn`);
        // the interpreter sets the program counter to `nnn`
        let address = instruction & 0x0fff;
        this.chip8.pc = address;
        // console.log("pc: ", this.chip8.pc);
    }
    call2nnn(instruction) { }
    se3xkk(instruction) { }
    sne4xkk(instruction) { }
    se5xy0(instruction) { }
    ld6xkk(instruction) {
        // Set Vx = kk.
        // The intepreter puts the value kk into register Vx.
        const value = instruction & 0x00ff;
        const index = (instruction & 0x0f00) >> 8;
        // console.log("value =", value.toString(16), ", index =", index.toString(16));
        this.chip8.setV(index, value);
        console.log(`index = ${index}, value = ${value}, V${index.toString(16)} = ${this.chip8.getV(index)}`);
    }
    add7xkk(instruction) {
        // Set Vx = Vx + kk
        // Adds the value kk to the value of register Vx, then stores the result in Vx.
        const value = instruction & 0x00ff;
        const index = (instruction & 0x0f00) >> 8;
        const currentValue = this.chip8.getV(index);
        this.chip8.setV(index, value + currentValue);
    }
    ld8xy0(instruction) { }
    or8xy1(instruction) { }
    and8xy2(instruction) { }
    xor8xy3(instruction) { }
    add8xy4(instruction) { }
    sub8xy5(instruction) { }
    shr8xy6(instruction) { }
    subn8xy7(instruction) { }
    shl8xyE(instruction) { }
    sne9xy0(instruction) { }
    ldAnnn(instruction) {
        // Set I = nnn
        // The value of register I is set to nnn
        const address = instruction & 0x0fff;
        this.chip8.i = address;
    }
    jpBnnn(instruciton) { }
    rndCxkk(instruction) { }
    drwDxyn(instruction) {
        // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
        const ch8 = this.chip8;
        const x = (instruction & 0x0f00) >> 8;
        const y = (instruction & 0x00f0) >> 4;
        const n = instruction & 0x000f;
        // get Vx and Vy
        // Vx contains the y-coordinate and viceversa ()
        const colsCoord = ch8.getV(x);
        let rowsCoord = ch8.getV(y);
        console.log(`xCoord = ${colsCoord}, yCoord = ${rowsCoord}`);
        // fill array with sprite's data
        let spriteArray = [];
        let memIndex = ch8.i;
        for (let j = 0; j < n; memIndex++, j++) {
            spriteArray.push(ch8.memory[memIndex]);
        }
        // console.log("sprite array:");
        // const arraystring = spriteArray.map((num) => num.toString(2));
        // console.dir(arraystring);
        // VF
        ch8.setV(0xf, 0);
        let vFalreadyOn = false;
        // draw into display
        for (const byte of spriteArray) {
            let currentCol = colsCoord;
            let currentRow = rowsCoord;
            let bitOffset = 7;
            let mask = 128;
            for (let j = 8; j > 0; j--, bitOffset--, currentCol++, mask = mask >> 1) {
                let displayPixelOldValue = ch8.display[currentRow][currentCol];
                // console.log("using mask =", mask.toString(2));
                // console.log("and bit offset =", bitOffset);
                // const extractedBit = (byte & mask) >> bitOffset;
                // console.log(
                //   "from",
                //   byte.toString(16),
                //   "extracted",
                //   extractedBit.toString(16),
                // );
                ch8.display[currentRow][currentCol] ^= (byte & mask) >> bitOffset;
                // first check VF is already set to 1. If not, check collision.
                if (vFalreadyOn === false) {
                    if (displayPixelOldValue === 1 &&
                        displayPixelOldValue !== ch8.display[currentRow][currentCol]) {
                        ch8.setV(0xf, 1);
                        vFalreadyOn = true;
                    }
                }
            }
            rowsCoord++; // next iteration of loop operate over next row on display
        }
    }
    skpEx9E(instruction) { }
    sknpExA1(instruction) { }
    ldFx07(instruction) { }
    ldFx0A(instruction) { }
    ldFx15(instruction) { }
    ldFx18(instruction) { }
    addFx1E(instruction) { }
    ldFx29(instruction) { }
    ldFx33(instruction) { }
    ldFx55(instruction) { }
    ldFx65(instruction) { }
}
