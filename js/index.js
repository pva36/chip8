var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Chip8 } from "./chip8.js";
import { Renderer } from "./renderer.js";
const canvas = document.querySelector("canvas#display");
// const chip8 = new Chip8();
const reader = new FileReader();
const renderer = new Renderer(10, canvas, 64, 32);
const chip8 = new Chip8(renderer);
const romInputButton = document.querySelector("button[id='runGame']");
// testing purposes!
// chip8.sendInstructionToCpu(0x0123);
// test 00E0
chip8.sendInstructionToCpu(0x00ee);
// test 00EE
chip8.sendInstructionToCpu(0x00e0);
// test jp1nnn
chip8.sendInstructionToCpu(0x1345);
chip8.sendInstructionToCpu(0x1654);
// chip8.sendInstructionToCpu(0x1123);
// chip8.sendInstructionToCpu(0x2123);
// chip8.sendInstructionToCpu(0x3123);
// chip8.sendInstructionToCpu(0x4123);
// chip8.sendInstructionToCpu(0x5123);
// chip8.sendInstructionToCpu(0x6123);
// chip8.sendInstructionToCpu(0x7123);
// chip8.sendInstructionToCpu(0x8123);
// chip8.sendInstructionToCpu(0x9123);
// chip8.sendInstructionToCpu(0xa123);
// chip8.sendInstructionToCpu(0xb123);
// chip8.sendInstructionToCpu(0xc123);
// chip8.sendInstructionToCpu(0xd123);
// chip8.sendInstructionToCpu(0xe123);
// chip8.sendInstructionToCpu(0xf123);
/**
 * Main
 */
function main() {
    romInputButton.addEventListener("click", romHandler);
}
/**
 * Functions -----------------------------------------------------------------
 */
function romHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const romInput = document.querySelector("input[type='file']");
        sendBinary(romInput);
    });
}
function sendBinary(inputElement) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof inputElement === null) {
            // TODO: find a better error message for an end user
            throw Error("input element that get the binary file is null");
        }
        else {
            const inputElementVer = inputElement;
            console.log("in else of 'sendBinary'");
            if (inputElementVer.files.length < 1) {
                alert("Please select a file from your compute!");
            }
            else {
                // TODO: test that the file IS a CHIP ROM.
                const binaryFile = inputElementVer.files[0];
                // initialize the reader object
                reader.onload = (event) => {
                    let data = event.target.result;
                    let array = new Uint8Array(data);
                    // console.log([].map.call(array, (x: number) => x.toString(16)));
                    // pass the array to the chip8 object
                    chip8.fetchBinary(array);
                };
                reader.onerror = (event) => {
                    console.log("Error: ", event.type);
                };
                // pass binaryFile to the reader object
                reader.readAsArrayBuffer(binaryFile);
            }
        }
    });
}
main();
