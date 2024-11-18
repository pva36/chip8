import { Cpu } from "../src/ts/cpu.js";
import { Chip8 } from "../src/ts/chip8.js";

const chip8 = new Chip8(1);

// TODO: implement function that cleans all components of Chip8 object.

// TODO: test sys0nnn
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

// TODO: cls00E0

// ret00E
// TODO: should I prevent subtraction when the stack pointer is 0,
// or should I allow it, and how should I implement it if that is the case?
test("test ret00EE", () => {
  expect(
    ((): number => {
      chip8.setStack(3, 0x00111);
      chip8.sp = 3;

      Cpu.ret00EE(chip8);
      return chip8.pc;
    })(),
  ).toBe(0x00111);
});

// jp1nnn
test("test jp1nnn", () => {
  expect(
    ((): number => {
      // clean chip8
      chip8.sp = 0;
      chip8.setStack(0, 0);

      Cpu.jp1nnn(0x0101, chip8);
      return chip8.pc;
    })(),
  ).toBe(0x0101);
});

// call2nnn
describe("call2nnn tests", () => {
  test("test PC modification", () => {
    expect(
      ((): number => {
        // clean chip8
        chip8.pc = 0;
        chip8.sp = 0;

        Cpu.call2nnn(0x21ba, chip8);

        return chip8.pc;
      })(),
    ).toBe(0x01ba);
  });

  test("test stack pointer modification", () => {
    expect(
      ((): number => {
        return chip8.sp;
      })(),
    ).toBe(0x1);
  });

  // TODO: test("test top of the stack modification");
});

// TODO: ld6xkk

// TODO: add7xkk

// TODO: drwDxyn
