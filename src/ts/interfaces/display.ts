export interface Display {
  /**
   * Renders the twoDimArray on screen
   * */
  render(twoDimArray: number[][]): void;
  /**
   * Clears the screen
   */
  clear(): void;

  /**
   * Defines the background color used on chip8's display.
   */
  setBackgroundColor(color: any): void;

  /**
   * Defines the background color used on chip8's display.
   */
  setForegroundColor(color: any): void;
}
