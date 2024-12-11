// type keyboardDownState = Record<string, boolean>;

export class Keyboard {
  keyboardDownState: { [index: string]: boolean } = {};

  static keyTranslation(key: string): string | undefined {
    switch (key) {
      case "1":
        return "1";
      case "2":
        return "2";
      case "3":
        return "3";
      case "4":
        return "c";
      case "q":
        return "4";
      case "w":
        return "5";
      case "e":
        return "6";
      case "r":
        return "d";
      case "a":
        return "7";
      case "s":
        return "8";
      case "d":
        return "9";
      case "f":
        return "10";
      case "z":
        return "a";
      case "x":
        return "0";
      case "c":
        return "b";
      case "v":
        return "f";
      default:
        return undefined;
    }
  }
  constructor(document: Document) {
    this.keyboardDownState = {
      "0": false,
      "1": false,
      "2": false,
      "3": false,
      "4": false,
      "5": false,
      "6": false,
      "7": false,
      "8": false,
      "9": false,
      a: false,
      b: false,
      c: false,
      d: false,
      e: false,
      f: false,
    };
    document.addEventListener("keypress", (event) => {
      const keyName = Keyboard.keyTranslation(event.key);
      if (!(typeof keyName === "undefined")) {
        this.keyboardDownState[keyName] = true;
        // alert(`key ${keyName} pressed!`);
        // console.dir(this.keyboardDownState);
      }
    });
    document.addEventListener("keyup", (event) => {
      const keyName = Keyboard.keyTranslation(event.key);
      if (!(typeof keyName === "undefined")) {
        this.keyboardDownState[keyName] = false;
      }
    });
  }
  getKeyboardState() {
    return this.keyboardDownState;
  }
}
