export class Chip8 {
    /**
     * Static Methods ----------------------------------------------------------
     */
    static check16bitRegInput(input, registerName) {
        if (input < 0) {
            throw Error(`${registerName} cannot hold negative values!`);
        }
        else if (input > 0xffff) {
            throw Error(`${registerName} cannot hold values greater than 0xffff!`);
        }
        return true;
    }
    static check8bitRegInput(input, registerName) {
        if (input < 0) {
            throw Error(`${registerName} cannot hold negative values!`);
        }
        else if (input > 0xff) {
            throw Error(`${registerName} cannot hold values greater than 0xff!`);
        }
        return true;
    }
    /**
     * Constructors ------------------------------------------------------------
     */
    constructor() {
        // Vx registers
        this._v = new Uint8Array(0x10);
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
    getV(index) {
        if (index < 0 || index > 0xf) {
            throw Error(`V[<<${index}>>] doesn't exist!`);
        }
        else {
            return this._v[index];
        }
    }
    setV(index, value) {
        if (index < 0 || index > 0xf) {
            throw Error(`V[<<${index}>>] doesn't exist!`);
        }
        else if (value < 0 || value > 0xff) {
            throw Error(`V[${index} cannot hold values greater than 255 (0xFF)]`);
        }
    }
    // Getter and setter for I register.
    // TODO: clean check logic
    get i() {
        return this._i[0];
    }
    set i(value) {
        if (value < 0) {
            throw Error("The I register cannot hold a negative value!");
        }
        else if (value > 0xffff) {
            throw Error("The I register cannot hold a number greater than 65.535(0xFFFF)");
        }
        else {
            this._i[0] = value;
        }
    }
    // Getter and setter for Program Counter
    // TODO: clean check logic
    get pc() {
        return this._pc[0];
    }
    set pc(value) {
        if (value < 0) {
            throw Error("The PROGRAM COUNTER cannot hold a negative value!");
        }
        else if (value > 0xffff) {
            throw Error("The PROGRAM COUNTER register cannot hold a number greater than 65.535(0xFFFF)");
        }
        else {
            this._pc[0] = value;
        }
    }
    // Getter and setter for Stack Pointer
    // TODO clean check logic
    get sp() {
        return this._sp[0];
    }
    set sp(value) {
        if (value < 0) {
            throw Error("The STACK POINTER cannot hold a negative value!");
        }
        else if (value > 0xffff) {
            throw Error("The STACK POINTER cannot hold a number greater than 65.535(0xFFFF)");
        }
        else {
            this._sp[0] = value;
        }
    }
    // Getter and setter for Stack
    getStack(index) {
        return this._stack[index];
    }
    setStack(index, value) {
        if (index < 0 || index > 16) {
            throw Error(`Index of the STACK must be between 0 and 16. A ${index} was provided!`);
        }
        if (Chip8.check16bitRegInput(value, "STACK[${}]")) {
            this._stack[index] = value;
        }
    }
    // Getter and setter for delayTimer
    get delayTimer() {
        return this._delayTimer[0];
    }
    set delayTimer(value) {
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
    fetchBinary(arrayBin) {
        console.log([].map.call(arrayBin, (x) => x.toString(16)));
    }
}
