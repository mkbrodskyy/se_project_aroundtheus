class UserInfo {
  constructor({ nameSelector, infoSelector, imageSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._infoElement = document.querySelector(infoSelector);
    this._avatarElement = document.querySelector(imageSelector);
  }

  getUserInfo() {
    return {
      title: this._nameElement.textContent,
      description: this._infoElement.textContent,
    };
  }

  setUserInfo({ name, about, avatar }) {
    this._nameElement.textContent = name;
    this._infoElement.textContent = about;
  }

  setUserAvatar(avatar) {
    this._avatarElement.src = avatar;
  }
}

export default UserInfo;
