class UserInfo {
  constructor({ nameSelector, infoSelector, imageSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._infoElement = document.querySelector(infoSelector);
    //  this._imageElement = document.querySelector(imageSelector);
  }

  getUserInfo() {
    return {
      title: this._nameElement.textContent,
      description: this._infoElement.textContent,
      // image: this._imageElement.src
    };
  }

  setUserInfo({ title, description, image }) {
    this._nameElement.textContent = title;
    this._infoElement.textContent = description;
    // this._imageElement.src = image
  }
}

export default UserInfo;
