import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import "./index.css";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import {
  initialCards,
  settings,
  editButton,
  addButton,
  profileTitleInput,
  profileDescriptionInput,
} from "../utils/constants.js";

// ---------------- Initial Cards Data ----------------
// const initialCards = [
//   {
//     name: "Yosemite Valley",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
//   },
//   {
//     name: "Lake Louise",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
//   },
//   {
//     name: "Bald Mountains",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
//   },
//   {
//     name: "Latemar",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
//   },
//   {
//     name: "Vanoise National Park",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
//   },
//   {
//     name: "Lago di Braies",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
//   },
// ];

// ---------------- DOM Element References ----------------
// const profileEditForm = document.forms["profile-form"];
// const addCardForm = document.forms["card-form"];
// const profileEditModal = document.querySelector("#profile-edit-modal");
// const addCardModal = document.querySelector("#add-card-modal");
// const previewImageModal = document.querySelector("#preview-image-modal");

// const cardTitleInput = document.querySelector("#card-title");
// const cardUrlInput = document.querySelector("#card-url");
// const cardsListEl = document.querySelector(".cards__list");
// const previewImage = previewImageModal.querySelector(".modal__image");
// const previewCaption = previewImageModal.querySelector(".modal__caption");
// const modalOpenedSelector = "modal_opened";

// ---------------- User Info ----------------
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  infoSelector: ".profile__description",
  // imageSelector: ".profile__image",
});

// ---------------- Card Functions ----------------
function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  return card.generateCard();
}

const section = new Section(
  {
    items: initialCards,
    renderer: addCard,
  },
  ".cards__list"
);
section.renderItems();

function addCard(cardData) {
  const cardElement = createCard(cardData);
  section.addItem(cardElement);
}

function handleAddCardFormSubmit(values) {
  const newCard = {
    name: values.title,
    link: values.link,
  };
  addCard(newCard);

  // closeModal(addCardModal);
  addCardPopup.close();
  formValidators["card-form"].disableButton();
  // formValidators["card-form"].resetValidation();
  addCardPopup.getForm().reset();
}

// Image Click Handler
function handleImageClick({ name, link }) {
  imagePopup.open(name, link);
}

// // ---------------- Modal Control Functions ----------------
// function toggleModal(modal, isOpen = false) {
//   modal.classList.toggle(modalOpenedSelector, isOpen);
//   /* document[`${isOpen ? "add" : "remove"}EventListener`](
//     "keydown",
//     escapeHandler
//   ); */
// }

// function openModal(modal) {
//   toggleModal(modal, true);
// }

// function closeModal(modal) {
//   toggleModal(modal, false);
// }

/* function escapeHandler(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(`.${modalOpenedSelector}`);
    if (openedModal) {
      closeModal(openedModal);
    }
  }
} */

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

// ---------------- Form Handlers ----------------
function handleProfileFormSubmit(values) {
  console.log(values);
  userInfo.setUserInfo({
    title: values.title,
    description: values.description,
  });
  /* closeModal(profileEditModal); */
  // closeModal(editProfilePopup);
  editProfilePopup.close();
}

// ---------------- Event Listeners ----------------
editButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  profileTitleInput.value = userData.title;
  profileDescriptionInput.value = userData.description;
  formValidators["profile-form"].resetValidation();
  /* openModal(profileEditModal); */
  editProfilePopup.open();
});

addButton.addEventListener("click", () => {
  // openModal(addCardModal);
  addCardPopup.open();
});

// Save Button Event Listeners
// addCardForm.addEventListener("submit", handleAddCardFormSubmit);
// profileEditForm.addEventListener("submit", handleProfileFormSubmit);

// Combining overlay and close button listeners
// const popups = document.querySelectorAll(".modal");

// popups.forEach((popup) => {
//   popup.addEventListener("mousedown", (evt) => {
//     if (
//       evt.target.classList.contains("modal_opened") ||
//       evt.target.classList.contains("modal__close")
//     ) {
//       // closeModal(popup);
//       popup.classList.remove("modal_opened");
//     }
//   });
// });

// ---------------- Initialize Form Validators ----------------

// const settings = {
//   inputSelector: ".modal__input",
//   submitButtonSelector: ".modal__button",
//   inactiveButtonClass: "modal__button_inactive",
//   inputErrorClass: "modal__input_type_error",
//   errorClass: "modal__error_visible",
//   formSelector: ".modal__form",
// };

// Define an object for storing validators
const formValidators = {};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    // Get the name of the form
    const formName = formElement.getAttribute("name");

    // Store the validator using the `name` of the form
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation(settings);
