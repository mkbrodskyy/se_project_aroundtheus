import Popup from "./Popup.js";

class ConfirmDelete extends Popup {
  constructor(popupSelector, handleDeleteCard) {
    super({ popupSelector });
    this._form = this._popup.querySelector(".modal__form");
    this.handleDeleteCard = handleDeleteCard;
  }

  open(card) {
    this._card = card;
    super.open();
  }

  confirmDelete(confirmation) {
    this._handleFormSubmit = confirmation;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      // change form to button
      evt.preventDefault();
      this._handleFormSubmit();
    });
  }
}

export default ConfirmDelete;

/* token 


div
  div
    button

*/
