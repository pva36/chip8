import { Chip8 } from "./chip8.js";
import { Renderer } from "./renderer.js";

const canvas: HTMLCanvasElement = document.querySelector("canvas#display")!;
// const chip8 = new Chip8();
const reader = new FileReader();
const chip8 = new Chip8();
const renderer = new Renderer(10, canvas, 64, 32);
const romInputButton = document.querySelector("button[id='runGame']")!;

function main() {
  romInputButton.addEventListener("click", romHandler);

  let switcher = true;
  setInterval(() => {
    renderer.clearScreen();
    renderer.test_renderDisplay(switcher);
    if (switcher) switcher = false;
    else switcher = true;
  }, 1000);
}

async function romHandler() {
  const romInput = document.querySelector("input[type='file']");
  sendBinary(romInput as HTMLInputElement | null);
  //   file = event.target.files[0];
  //
  //   reader.onload = function (event) {
  //     let data = event.target.result;
  //     let array = new Uint8Array(data);
  //     // console.log([].map.call(array, (x) => x.toString(16)));
  //
  //     chip8.runProgram(array);
  //     // return array;
  //   };
  //   reader.onerror = function (event) {
  //     console.log("Error : " + event.type);
  //   };
  //
  //   reader.readAsArrayBuffer(file);
}

async function sendBinary(inputElement: HTMLInputElement | null) {
  if (typeof inputElement === null) {
    // TODO: find a better error message for an end user
    throw Error("input element that get the binary file is null");
  } else {
    const inputElementVer = inputElement as HTMLInputElement;
    console.log("in else of 'sendBinary'");
    if (inputElementVer.files!.length < 1) {
      alert("Please select a file from your compute!");
    } else {
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

    //   // initialize the reader object
    //   reader.onload = (event) => {
    //     let data = event.target!.result;
    //     let array = new Uint8Array(data as ArrayBuffer);
    //     console.log([].map.call(array, (x: number) => x.toString(16)));
    //   };
    //   reader.onerror = (event) => {
    //     console.log("Error: ", event.type);
    //   };

    //   reader.readAsArrayBuffer(binaryFile);
    // }
  }
}

/*
 * OLD STUFF
 */

// let file;

// Renderer Test
// renderer.renderDisplay(testArray);
// renderer.test_renderDisplay();
//
// // the cleanScreen method needs to be called inside a function, otherwise
// // the this inside clearScreen() will refer to the global object.
// setTimeout(function () {
//   renderer.clearScreen();
// }, 5000);
//
// // Get rom from user and run emulator
// romInput.addEventListener("change", async function (event) {

//   file = event.target.files[0];
//
//   reader.onload = function (event) {
//     let data = event.target.result;
//     let array = new Uint8Array(data);
//     // console.log([].map.call(array, (x) => x.toString(16)));
//
//     chip8.runProgram(array);
//     // return array;
//   };
//   reader.onerror = function (event) {
//     console.log("Error : " + event.type);
//   };
//
//   reader.readAsArrayBuffer(file);
// });

main();
