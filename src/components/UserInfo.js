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

  setUserInfo({ title, description, avatar }) {
    this._nameElement.textContent = title;
    this._infoElement.textContent = description;
  }

  setUserAvatar(avatar) {
    this._avatarElement.src = avatar;
  }
}

export default UserInfo;
