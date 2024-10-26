export class Renderer {
  constructor(scale, canvas, cols, rows) {
    this.scale = scale;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "black";
    this.cols = cols;
    this.rows = rows;

    this.canvas.width = cols * this.scale;
    this.canvas.height = rows * this.scale;
  }

  // renders info extracted from the chip8 interpreter, with scaling.
  renderDisplay(twoDimArray) {
    // the input should be an array of 64x32, with 0s and 1s.
    const xLength = twoDimArray.length;
    const yLength = twoDimArray[0].length;

    for (
      let x = 0, xCanvas = 0;
      xCanvas < xLength * this.scale && x < xLength;
      xCanvas += this.scale, x++
    ) {
      for (
        let y = 0, yCanvas = 0;
        yCanvas < yLength * this.scale && y < yLength;
        yCanvas += this.scale, y++
      ) {
        if (twoDimArray[x][y] === 1) {
          this.context.fillRect(xCanvas, yCanvas, this.scale, this.scale);
        }
      }
    }
  }

  clearScreen() {
    // console.log(this);
    this.context.clearRect(
      0,
      0,
      this.cols * this.scale,
      this.rows * this.scale,
    );
  }

  test_renderDisplay() {
    let testArray = Array.from({ length: 64 }, (_, i) => {
      return i % 2 === 0 ? Array(32).fill(1) : Array(32).fill(0);
    });
    this.renderDisplay(testArray);
  }
}
