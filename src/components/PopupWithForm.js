import Popup from "./Popup.js";

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super({ popupSelector });
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".modal__form");
    this._inputList = this._form
      ? this._form.querySelectorAll(".modal__input")
      : [];
    // this._submitButton = this._form
    //   ? this._form.querySelector(".popup__submit")
    //   : null;
  }

  _getInputValues() {
    this._formValues = {};
    this._inputList.forEach((input) => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  getForm() {
    return this._form
  }

  setEventListeners() {
    super.setEventListeners();
    // if (this._form) {
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      this._handleFormSubmit(this._getInputValues());
    });
    // }
  }

  setInputValues(data) {
    this._inputList.forEach((input) => {
      // Here you insert the `value` by the `name` of the input
      input.value = data[input.name];
    });
  }

//   close() {
//     if (this._form) {
//       this._form.reset();
//     }
//     super.close();
//   }
}

export default PopupWithForm;
