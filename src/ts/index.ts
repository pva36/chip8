import { Chip8 } from "./chip8.js";
import { Renderer } from "./renderer.js";
import { Keyboard } from "./keyboard.js";

const canvas: HTMLCanvasElement = document.querySelector("canvas#display")!;
// const chip8 = new Chip8();
const reader = new FileReader();
const renderer = new Renderer(10, canvas, 64, 32);
const keyboard = new Keyboard(document);
const chip8 = new Chip8(renderer, keyboard);
const romInputButton = document.querySelector("button[id='runGame']")!;
const submitInstructionForm = document.querySelector("form#runInstruction");

// chip8.sendInstructionToCpu(0x0123);
// chip8.sendInstructionToCpu(0x6120);
// chip8.sendInstructionToCpu(0x6210);
// chip8.sendInstructionToCpu(0xa050);
// chip8.sendInstructionToCpu(0xd125);

/**
 * Main
 */
function main() {
  romInputButton.addEventListener("click", romHandler);

  // event listener for submit instruction
  submitInstructionForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formInput: HTMLInputElement = document.querySelector(
      "input#chip8instruction",
    ) as HTMLInputElement;
    const instruction: string = formInput.value;
    const regex = /^0x[\da-fA-F]{4}/;
    if (regex.test(instruction)) {
      chip8.sendInstructionToCpu(parseInt(instruction));
    } else {
      alert("Please enter a instruction in the format specified");
    }
  });
}

/**
 * Functions -----------------------------------------------------------------
 */

async function romHandler() {
  const romInput = document.querySelector("input[type='file']");
  sendBinary(romInput as HTMLInputElement | null);
}

async function sendBinary(inputElement: HTMLInputElement | null) {
  if (typeof inputElement === null) {
    // TODO: find a better error message for an end user
    throw Error("input element that get the binary file is null");
  } else {
    const inputElementVer = inputElement as HTMLInputElement;
    // console.log("in else of 'sendBinary'");
    if (inputElementVer.files!.length < 1) {
      alert("Please select a file from your compute!");
    } else {
      // TODO: test that the file IS a CHIP ROM.
      const binaryFile = inputElementVer.files![0];
      // initialize the reader object
      reader.onload = (event) => {
        let data = event.target!.result;
        let array = new Uint8Array(data as ArrayBuffer);
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
}

main();
