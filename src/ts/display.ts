import { Display as IDisplay } from "./interfaces/display";
// an instance of this class should created in main, and should be passed to
// the chip 8 instance.
//
export class Display implements IDisplay {
  private scale: number;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private cols: number;
  private rows: number;
  private foregroundColor = "black";
  private backgroundColor = "white";

  constructor(
    scale: number,
    canvas: HTMLCanvasElement,
    cols: number,
    rows: number,
  ) {
    this.scale = scale;
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.cols = cols;
    this.rows = rows;
    this.canvas.width = cols * this.scale;
    this.canvas.height = rows * this.scale;
  }

  clear() {
    this.context.clearRect(
      0,
      0,
      this.cols * this.scale,
      this.rows * this.scale,
    );
  }

  render(twoDimArray: number[][]) {
    this.clear();
    this.fillCanvasBackground();
    this.fillCanvasForeground(twoDimArray);
  }

  setBackgroundColor(color: any): void {
    this.backgroundColor = color;
  }

  setForegroundColor(color: any): void {
    this.foregroundColor = color;
  }

  /**
   * Fill the Html Canvas using the data contained in twoDimArray. Considers
   * scaling factor.
   */
  private fillCanvasForeground(twoDimArray: number[][]): void {
    // the input should be an array of (64x32 wxh), with 0s and 1s.
    const rowsNumber = twoDimArray.length; // rows
    const colsNumber = twoDimArray[0].length; // cols

    this.context.fillStyle = this.foregroundColor;

    // scaling the canvas (drawing squares of area this.scale^2)
    for (
      let y = 0, yCanvas = 0;
      yCanvas < colsNumber * this.scale && y < colsNumber;
      yCanvas += this.scale, y++ // y coordinate of the upper left vertex of square
    ) {
      for (
        let x = 0, xCanvas = 0;
        xCanvas < rowsNumber * this.scale && x < rowsNumber;
        xCanvas += this.scale, x++ // x coordinate of the upper left vertex of square
      ) {
        if (twoDimArray[x][y] === 1) {
          // fill square according to coordinates and scale factor
          this.context.fillRect(yCanvas, xCanvas, this.scale, this.scale);
        }
      }
    }
  }

  /**
   * Fill the Html Canvas enterily using the this.backgroundColor
   */
  private fillCanvasBackground() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  run_rendererDemo(bool: boolean) {
    const rows = 32;
    const cols = 64;
    let testArray = Array.from({ length: rows }, (_, i) => {
      if (bool) {
        return i % 2 === 0 ? Array(cols).fill(1) : Array(cols).fill(0);
      } else {
        return i % 2 === 0 ? Array(cols).fill(0) : Array(cols).fill(1);
      }
    });
    this.fillCanvasForeground(testArray);
  }
}
