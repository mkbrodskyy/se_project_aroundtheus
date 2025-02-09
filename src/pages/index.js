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
import { data } from "jquery";

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

// instead of PopupWithForm use ConfirmDelete
const confirmDeletePopup = new confirmDelete("#delete-popup", handleFormDelete); // WRONG CLASS! should be ConfirmDelete
// call setEventListeners on confirmDeletePopup
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
  // This is where the delete logic will live
  confirmDeletePopup.confirmDelete(() => {
    // Delete the card here with a fetch request
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
          section.addItem(createCard(data));
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

  // We get an error when deleting a card because the card we are trying to delete is not yet a card created on the server.
  // Pass the input values
  api
    .createACard(newCard)
    .then((cardData) => {
      // add the card to the cardSection
      addCard(cardData);
      console.log(cardData);
      // Close the add card modal
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

// function addNewCard(name, link) {
//   fetch("https://around-api.en.tripleten-services.com/v1/cards", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         '{"user":{"name":"Placeholder name","about":"Placeholder description","avatar":"https://practicum-content.s3.amazonaws.com/resources/avatar_placeholder_1704989734.svg","_id":"4f496d3f8732e1ed0d779c04"},"token":"11f34e71-370c-42ab-866a-065e85c99efb"}', // Replace with your actual token
//     },
//     body: JSON.stringify({
//       name: name,
//       link: link,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("New card added:", data);
//       addCard(data);
//     })
//     .catch((error) => {
//       console.error("Error adding new card:", error);
//     });
// }

// ---------------- Delete Popup ----------------
const deletePopup = document.getElementById("delete-popup");
const confirmDeleteButton = document.getElementById("confirm-delete");

// document.querySelectorAll('.bin-icon').forEach(binIcon => {
//   binIcon.addEventListener('click', () => {
//     deletePopup.style.display = 'flex';
//   });
// });

// confirmDeleteButton.addEventListener("click", (card) => {
//   //console log out the event
//   api.deleteACard(card._data._id); // get a card I
// });

// Function to handle adding a like
// function addLike(cardId) {
//   return fetch(`https://around-api.en.tripleten-services.com/v1/cards/${cardId}/likes`, {
//     method: 'PUT',
//     headers: {
//       authorization: '11f34e71-370c-42ab-866a-065e85c99efb',
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => response.json())
//   .then(data => {
//     // Update the heart icon color
//     document.querySelector(`#like-icon-${cardId}`).classList.add('liked');
//     return data;
//   })
//   .catch(error => console.error('Error:', error));
// }

// Function to handle removing a like
// function removeLike(cardId) {
//   return fetch(`https://around-api.en.tripleten-services.com/v1/cards/${cardId}/likes`, {
//     method: 'DELETE',
//     headers: {
//       authorization: '11f34e71-370c-42ab-866a-065e85c99efb',
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => response.json())
//   .then(data => {
//     // Update the heart icon color
//     document.querySelector(`#like-icon-${cardId}`).classList.remove('liked');
//     return data;
//   })
//   .catch(error => console.error('Error:', error));
// }

// Create a handleLikeCard function
// Inside the function call your api.deleteACard method
// Inside of the then block, console.log(response)

function handleLikeCard(cardId) {
  api.deleteACard(cardId).then((response) => {
    console.log(response);
    // // Update the heart icon color
    // document.querySelector(`#like-icon-${cardId}`).classList.remove('liked');
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

// profilePicture.addEventListener("mouseover", () => {
//   editIcon.style.display = "block";
// });

// profilePicture.addEventListener("mouseout", () => {
//   editIcon.style.display = "none";
// });

editIcon.addEventListener("click", () => {
  avatarPopup.open();
});

editIcon.addEventListener("click", () => {
  avatarPopup.open();
});

// When the pencil icon is clicked open a modal (see figma)
// To open this modal instantiate a new PopupWithForm
// // Inside of this make a request to your edit profile API
// avatarPopup.setSubmitHandler((values) => {
//   api.updateUserAvatar(values.avatar)
//     .then((data) => {
//       userInfo.setUserAvatar(data.avatar);
//       avatarPopup.close();
//     })
//     .catch((err) => {
//       console.error(`Error updating avatar: ${err}`);
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.modal__form');

  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      const submitButton = form.querySelector('.modal__button');
      submitButton.textContent = 'Saving...';
      submitButton.disabled = true;

      // Simulate form submission process
      // setTimeout(() => {
      //   submitButton.textContent = 'Save';
      //   submitButton.disabled = false;
      // }, 2000); // Replace this with actual form submission logic
    });
  });
});