class Card {
  constructor(
    data,
    templateSelector,
    handleImageClick,
    handleDeleteIcon,
    handleLikeCard
  ) {
    this.data = data;
    this.isLiked = data.isLiked;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteIcon = handleDeleteIcon;
    this._handleLikeIcon = handleLikeCard;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    return cardElement;
  }

  generateCard() {
    this._element = this._getTemplate();
    this._likeButton = this._element.querySelector(".card__like-button");
    this._setEventListeners();
    this._updateLikes();

    this._element.querySelector(".card__image").src = this.data.link;
    this._element.querySelector(".card__image").alt = this.data.name;
    this._element.querySelector(".card__title").textContent = this.data.name;

    return this._element;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeIcon(this);
    });
    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => this._handleDeleteIcon(this));
    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => this._handleImageClick(this.data));

  }

  setLikeStatus(isLiked) {
    this.isLiked = isLiked;
    this._updateLikes();
  }

  _updateLikes() {
    if (this.isLiked) {
      console.log("you are liking this");
      this._likeButton.classList.add("card__like-button_active");
    } else {
      console.log("you are not liking this");
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  deleteCard() {
    this._element.remove();
    this._element = null;
  }
}

export default Card;
