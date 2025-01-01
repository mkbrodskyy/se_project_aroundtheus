class Card {
  constructor(data, cardSelector, handleImageClick) {
    this._data = data;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._getTemplate();
    this._setEventListeners();
  }

  _getTemplate() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._cardImage = this._cardElement.querySelector(".card__image");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._title = this._cardElement.querySelector(".card__title");
  }

  _setEventListeners() {
    this._cardImage.addEventListener("click", () => {
      this._handleImageClick(this._data);
    });
    this._likeButton.addEventListener("click", () => {
      this._handleLikeIcon();
    });
    this._deleteButton.addEventListener("click", () => {
      this._deleteCard();
    });
  }

  _handleLikeIcon() {
    this._likeButton.classList.toggle("card__like-button_solid");
  }

  _deleteCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  generateCard() {
    this._cardImage.src = this._data.link;
    this._cardImage.alt = this._data.name;
    this._title.textContent = this._data.name;

    return this._cardElement;
  }
}

export default Card;
