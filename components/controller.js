class Controller {
  pannel = {};
  commands = {};
  handler;
  constructor(commands, handler) {
    this.commands = commands;
    this.handler = handler;
    this.handleKeyUp = this.handleKeyUp.bind(this);

    /**For Bot program */
    for (let command in commands)
      this.pannel[command] = () =>
        new KeyboardEvent("keyup", { code: commands[command].code });
  }

  setHandler(handler) {
    this.handler = handler;
  }

  notifyHandler(code) {
    this.handler(this.commands[code].value);
  }

  getControlPannel() {
    return this.pannel;
  }

  handleKeyUp(e) {
     e.preventDefault();
     if (this.commands.hasOwnProperty(e.code)) this.notifyHandler(e.code);
  }

  activate() {
    return document.addEventListener("keyup", this.handleKeyUp);
  }

  desactivate() {
    return document.removeEventListener('keyup', this.handleKeyUp);
  }
}

export default Controller;
