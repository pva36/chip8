var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { Chip8 } from "./chip8.js";
import { Renderer } from "./renderer.js";
const canvas = document.querySelector("canvas#display");
// const chip8 = new Chip8();
// const reader = new FileReader();
const renderer = new Renderer(10, canvas, 64, 32);
const romInput = document.querySelector("button[id='runGame']");
function main() {
    romInput.addEventListener("click", romHandler);
    let switcher = true;
    setInterval(() => {
        renderer.clearScreen();
        renderer.test_renderDisplay(switcher);
        if (switcher)
            switcher = false;
        else
            switcher = true;
    }, 1000);
}
function romHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(event.target);
        alert("Run GAME!");
    });
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
