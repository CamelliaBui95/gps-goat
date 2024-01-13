class MessageDialog {
    constructor() {
        this.msgDialog = document.getElementById("message-container");
        this.msg = document.getElementById("message");
    }

    clearMessage() {
        this.msgDialog.classList.remove("onEnteringAnim");
        this.msgDialog.classList.remove("onEntering");
        this.msgDialog.classList.add("onLeavingAnim");
        this.msgDialog.classList.add("onLeaving");
    }

    setMessage(newMsg) {
        this.msg.innerHTML = newMsg;
    }

    displayMessage() {
        this.msgDialog.classList.add("onEnteringAnim");
        this.msgDialog.classList.remove("onLeavingAnim");
        this.msgDialog.classList.remove("onLeaving");
        this.msgDialog.classList.add("onEntering");
    }
}

export default MessageDialog;