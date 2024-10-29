export class Cpu {
    constructor(chip8) {
        this.chip8 = chip8;
    }
    /**
     * Switches ----------------------------------------------------------------
     */
    processInstruction(instruction) {
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
                    console.log(`instruction starts with 0x6`);
                    break;
                case 0x7000:
                    console.log(`instruction starts with 0x7`);
                    break;
                case 0x8000:
                    console.log(`instruction starts with 0x8`);
                    break;
                case 0x9000:
                    console.log(`instruction starts with 0x9`);
                    break;
                case 0xa000:
                    console.log(`instruction starts with 0xA`);
                    break;
                case 0xb000:
                    console.log(`instruction starts with 0xB`);
                    break;
                case 0xc000:
                    console.log(`instruction starts with 0xC`);
                    break;
                case 0xd000:
                    console.log(`instruction starts with 0xD`);
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
}
