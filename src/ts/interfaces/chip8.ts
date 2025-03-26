export interface Chip8 {
  /**
   * Runs or resets the emulation. If there is no Rom loaded into the Chip8
   * Object throw error
   */
  run(): void;

  /**
   * Clear the Chip8 object (sets it to an original state).
   */
  clear(): void;

  /**
   * Pauses the emulation process. All state is maintained as it is
   */
  pause(): void;

  /**
   * Resumes the emulation process. It continues exactly as it was after calling
   * the Chip8.pause() method
   */
  resume(): void;

  /**
   * Stops the emulation process. All state is maintained as it is
   */
  stop(): void;

  /**
   * Loads the rom into the Chip8 object
   */
  loadRom(arrayBin: Uint8Array): void;
}
