import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

// ---------------- Initial Cards Data ----------------
const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

// ---------------- DOM Element References ----------------
const profileEditForm = document.forms["profile-form"];
const addCardForm = document.forms["card-form"];
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewImageModal = document.querySelector("#preview-image-modal");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const cardTitleInput = document.querySelector("#card-title");
const cardUrlInput = document.querySelector("#card-url");
const cardsListEl = document.querySelector(".cards__list");
const previewImage = previewImageModal.querySelector(".modal__image");
const previewCaption = previewImageModal.querySelector(".modal__caption");
const modalOpenedSelector = "modal_opened";

// ---------------- Card Functions ----------------
function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  return card.generateCard();
}

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData);
  cardsListEl.append(cardElement);
});

function handleAddCardFormSubmit(event) {
  event.preventDefault();
  const newCard = {
    name: cardTitleInput.value,
    link: cardUrlInput.value,
  };
  const cardElement = createCard(newCard);
  cardsListEl.prepend(cardElement);
  closeModal(addCardModal);
  formValidators["card-form"].disableButton();
  addCardForm.reset();
}

// Image Click Handler
function handleImageClick(data) {
  previewImage.src = data.link;
  previewImage.alt = data.name;
  previewCaption.textContent = data.name;
  openModal(previewImageModal);
}

// ---------------- Modal Control Functions ----------------
function toggleModal(modal, isOpen = false) {
  modal.classList.toggle(modalOpenedSelector, isOpen);
  document[`${isOpen ? "add" : "remove"}EventListener`](
    "keydown",
    escapeHandler
  );
}

function openModal(modal) {
  toggleModal(modal, true);
}

function closeModal(modal) {
  toggleModal(modal, false);
}

function escapeHandler(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(`.${modalOpenedSelector}`);
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// ---------------- Form Handlers ----------------
function handleProfileFormSubmit(event) {
  event.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

// ---------------- Event Listeners ----------------
editButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent.trim();
  profileDescriptionInput.value = profileDescription.textContent.trim();
  formValidators["profile-form"].resetValidation();
  openModal(profileEditModal);
});

addButton.addEventListener("click", () => {
  openModal(addCardModal);
});

// Save Button Event Listeners
addCardForm.addEventListener("submit", handleAddCardFormSubmit);
profileEditForm.addEventListener("submit", handleProfileFormSubmit);

// Combining overlay and close button listeners
const popups = document.querySelectorAll(".modal");

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains("modal_opened") ||
      evt.target.classList.contains("modal__close")
    ) {
      closeModal(popup);
    }
  });
});

// ---------------- Initialize Form Validators ----------------
const settings = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
  formSelector: ".modal__form",
};

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
  console.log(config.formSelector);
};

enableValidation(settings);
console.log(formValidators);
