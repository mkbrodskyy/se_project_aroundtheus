import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import "./index.css";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import confirmDelete from "../components/ConfirmDelete.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import {
  initialCards,
  settings,
  editButton,
  addButton,
  profileTitleInput,
  profileDescriptionInput,
} from "../utils/constants.js";

// ---------------- User Info ----------------

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "11f34e71-370c-42ab-866a-065e85c99efb",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  infoSelector: ".profile__description",
  imageSelector: ".profile__image",
});

let section;

// ---------------- Card Functions ----------------
function createCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleDeleteIcon,
    handleLikeButtonClick
  );
  console.log(cardData);
  return card.generateCard();
}

const confirmDeletePopup = new confirmDelete("#delete-popup", handleFormDelete);
confirmDeletePopup.setEventListeners();

function handleFormDelete(card) {
  console.log("Form was submitted");
  deleteCard(card._id)
    .then((response) => {
      console.log("Card deleted successfully", response);
      closePopup();
    })
    .catch((error) => {
      console.error("Error deleting card", error);
    });
}

const handleDeleteIcon = (card) => {
  confirmDeletePopup.open(card);
  confirmDeletePopup.confirmDelete(() => {
    api
      .deleteACard(card._data._id)
      .then(() => {
        card.deleteCard();
        confirmDeletePopup.close();
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  });
};

Promise.all([api.getUserInfo(), api.getInitialCards()]).then(
  ([data, cards]) => {
    userInfo.setUserInfo(data.name, data.about);
    section = new Section(
      {
        items: cards,
        renderer: (data) => {
          // addCard(data);
          section.addItem(createCard(data), true);
        },
      },
      ".cards__list"
    );
    section.renderItems();
  }
);

function addCard(cardData) {
  console.log(cardData);
  const cardElement = createCard(cardData);
  section.addItem(cardElement);
}

function handleAddCardFormSubmit(values) {
  const newCard = {
    name: values.title,
    link: values.link,
  };

  api
    .createACard(newCard)
    .then((cardData) => {
      addCard(cardData);
      console.log(cardData);
      addCardPopup.close();
      formValidators["card-form"].disableButton();
      addCardPopup.getForm().reset();
    })
    .catch((err) => {
      console.error(`Error creating card: ${err}`);
    });
}

function handleImageClick({ name, link }) {
  imagePopup.open(name, link);
}

// ---------------- Popups ----------------
const imagePopup = new PopupWithImage("#preview-image-modal");
imagePopup.setEventListeners();

const addCardPopup = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
addCardPopup.setEventListeners();
const editProfilePopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileFormSubmit
);
editProfilePopup.setEventListeners();

const avatarPopup = new PopupWithForm(
  "#avatar-edit-modal",
  handleAvatarFormSubmit
);
avatarPopup.setEventListeners();

// ---------------- Form Handlers ----------------
function handleProfileFormSubmit(values) {
  console.log(values);
  userInfo.setUserInfo({
    title: values.title,
    description: values.description,
  });
  editProfilePopup.close();
}

function handleAvatarFormSubmit(values) {
  api
    .updateUserAvatar(values.avatar)
    .then((data) => {
      userInfo.setUserAvatar(data.avatar);
      avatarPopup.close();
    })
    .catch((err) => {
      console.error(`Error updating avatar: ${err}`);
    });
}

// ---------------- Event Listeners ----------------
editButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  profileTitleInput.value = userData.title;
  profileDescriptionInput.value = userData.description;
  formValidators["profile-form"].resetValidation();
  editProfilePopup.open();
});

addButton.addEventListener("click", () => {
  addCardPopup.open();
});

// ---------------- Initialize Form Validators ----------------
const formValidators = {};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    const formName = formElement.getAttribute("name");
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation(settings);

// ---------------- Delete Popup ----------------
const deletePopup = document.getElementById("delete-popup");
const confirmDeleteButton = document.getElementById("confirm-delete");

function handleLikeCard(cardId) {
  api.deleteACard(cardId).then((response) => {
    console.log(response);
    return response;
  });
  // .catch(error => console.error('Error:', error));
}

// Function to handle like button click
function handleLikeButtonClick(card) {
  console.log(card);
  if (card.isLiked) {
    api
      .dislikeacard(card._data._id)
      .then((response) => {
        console.log(response);
        card.setLikeStatus(response.isLiked);
      })
      .catch((error) => console.error("Error:", error));
  } else {
    api
      .likeaCard(card._data._id)
      .then((response) => {
        console.log(response);
        card.setLikeStatus(response.isLiked);
      })
      .catch((error) => console.error("Error:", error));
  }
}

// Add event listener to like buttons
document.querySelectorAll(".like-button").forEach((button) => {
  button.addEventListener("click", handleLikeButtonClick);
});

// ---------------- Profile Picture ----------------
const profilePicture = document.querySelector(".profile__image");
const editIcon = document.querySelector(".profile__image-edit");

editIcon.addEventListener("click", () => {
  avatarPopup.open();
});

editIcon.addEventListener("click", () => {
  avatarPopup.open();
});

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.modal__form');

  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      const submitButton = form.querySelector('.modal__button');
      submitButton.textContent = 'Saving...';
      submitButton.disabled = true;
    });
  });
});