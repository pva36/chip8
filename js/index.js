import { Chip8 } from "./chip8.js";

const chip8 = new Chip8();
const reader = new FileReader();
// let programBytes;
let file;
const fileInput = document.querySelector("input#file");

// console.log(fileInput);

fileInput.addEventListener("change", async function (event) {
  file = event.target.files[0];

  reader.onload = function (event) {
    let data = event.target.result;
    let array = new Uint8Array(data);
    // console.log([].map.call(array, (x) => x.toString(16)));

    chip8.runProgram(array);
    // return array;
  };
  reader.onerror = function (event) {
    console.log("Error : " + event.type);
  };

  reader.readAsArrayBuffer(file);
});
