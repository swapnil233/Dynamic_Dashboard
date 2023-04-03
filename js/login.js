// Import error and success messages from ./modules/interactions.js
import { successPopup, errorPopup } from "./modules/interactions.js";

const loginBtn = document.getElementById("login_btn");
const loader = document.querySelector(".loader");
const btnText = document.querySelector(".btn_text");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.replace("./pages/dashboard.html");
  } else {
    console.log("No user signed in");
  }
});

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  toggleLoadingAnimation();

  const userEmail = document.getElementById("user_email").value;
  const userPass = document.getElementById("user_pass").value;

  try {
    await firebase.auth().signInWithEmailAndPassword(userEmail, userPass);
  } catch (error) {
    toggleLoadingAnimation();
    errorPopup(error.message, 10000);
  }
});

function toggleLoadingAnimation() {
  loader.classList.toggle("hidden");
  btnText.classList.toggle("hidden");
}
