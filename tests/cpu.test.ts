import { Cpu } from "../src/ts/cpu";
import { Chip8 } from "../src/ts/chip8";

// Mock canvas
const chip8 = new Chip8(1);

test("test sys0nnn", () => {
  expect(
    ((): number => {
      chip8.pc = 0;
      Cpu.sys0nnn(0x0111, chip8);
      const pc: number = chip8.pc;
      return pc;
    })(),
  ).toBe(0x111);
});
// TODO: sys0nnn
// TODO: cls00E0
// TODO: ret00E
// TODO: jp1nnn

// test call2nnn
// test("calll2n ", () => {});
// TODO: ld6xkk
// TODO: add7xkk
// TODO: drwDxyn
