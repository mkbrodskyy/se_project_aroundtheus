import Popup from "./Popup.js";

class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super({popupSelector});
    this._image = this._popup.querySelector(".modal__image");
    this._caption = this._popup.querySelector(".modal__caption");
  }

  open(name, link) {
    console.log(name, link);
    this._image.src = link;
    this._image.alt = name;
    this._caption.textContent = name;
    super.open();
  }
}

export default PopupWithImage;
