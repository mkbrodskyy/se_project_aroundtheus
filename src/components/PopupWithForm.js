import Popup from './Popup.js';

class PopupWithForm extends Popup {
    constructor(popupSelector, handleFormSubmit) {
        super({popupSelector});
        this._handleFormSubmit = handleFormSubmit;
        this._form = this._popup.querySelector('.popup__form');
        this._inputList = this._form ? this._form.querySelectorAll('.popup__input') : [];
        this._submitButton = this._form ? this._form.querySelector('.popup__submit') : null;
    }

    _getInputValues() {
        this._formValues = {};
        this._inputList.forEach(input => {
            this._formValues[input.name] = input.value;
        });
        return this._formValues;
    }

    setEventListeners() {
        super.setEventListeners();
        if (this._form) {
            this._form.addEventListener('submit', (evt) => {
                evt.preventDefault();
                this._handleFormSubmit(this._getInputValues());
            });
        }
    }

    close() {
        super.close();
        if (this._form) {
            this._form.reset();
        }
    }
}

export default PopupWithForm;