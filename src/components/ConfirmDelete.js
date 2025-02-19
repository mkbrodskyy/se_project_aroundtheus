import Popup from "./Popup.js";

class ConfirmDelete extends Popup {
  constructor(popupSelector) {
    super({ popupSelector });
    this._form = this._popup.querySelector(".modal__form");
  }

  open(card) {
    this._card = card;
    super.open();
  }

  handleConfirmDelete(confirmation) {
    this._handleFormSubmit = confirmation;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit();
    });
  }
}

export default ConfirmDelete;