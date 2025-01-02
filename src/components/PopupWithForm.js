class PopupWithForm extends Popup {
    constructor(popupSelector, handleSubmit) {
      super(popupSelector);
      this._handleSubmit = handleSubmit;
      this._form = this._popup.querySelector('.popup__form');
      this._inputList = this._form.querySelectorAll('.popup__input');
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
      this._form.addEventListener('submit', (event) => {
        event.preventDefault();
        this._handleSubmit(this._getInputValues());
      });
    }
  
    close() {
      super.close();
      this._form.reset();
    }
  }
  