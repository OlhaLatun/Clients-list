
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.css";
import "validator";

const validator = require('validator');
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
import { appInit } from "./firebase-latun";

appInit(); 


firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let email = user.email;
      window.location.href = "./clientsList.html";
    } else {
    }
  });

let state = "login";
const registerForm = document.querySelector("[name='registerForm']");


registerForm.querySelector("[type='password']").addEventListener("blur", event => {
    validatePassword(event.target);
});

registerForm.querySelector("[name='email']").addEventListener("blur", event => {
    validateEmail(event.target);
});

registerForm.addEventListener("submit", event => {
    event.preventDefault();
    validateRegisterForm(event.target);
});

const loginForm = document.querySelector("[name='loginForm']");

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    validateLoginForm(event.target);
});

loginForm.querySelector("[type='password']").addEventListener("blur", event => {
    validatePassword(event.target);
});

loginForm.querySelector("[name='email']").addEventListener("blur", event => {
    validateEmail(event.target);
});

const toggleLinks = [
    { id: "toggleLogin", value: "login" },
    { id: "toggleRegister", value: "register" }
  ];
  
  toggleLinks.forEach(link => {
   
    const element = document.querySelector(`#${link.id}`);
    element.addEventListener("click", () => {
        togleStatus(link.value);
    });
  });

  const alertDivs = document.querySelectorAll('.alert');
alertDivs.forEach(div => {
    div.addEventListener("click", () => {
        div.className += " d-none";
    });
});

togleStatus(state); 
// Validation 

function validateRegisterForm(target) {
    const isFormValid = validateRequiredFields(target);
    isFormValid ? registerNewUser(target.email.value, target.password.value) : null;
    };
     
function validateLoginForm(target) {
    const isFormValid = validateRequiredFields(target);
isFormValid ? logIn(target.email.value, target.password.value) : null;
} 

function validateRequiredFields(target) {
    const isPasswordValid = validatePassword(target.password);
    const isEmailValid = validateEmail(target.email);
    return isPasswordValid && isEmailValid;
}

function validatePassword(field) {
    if (field.value) {
        markFieldAsValid(field);
        return true;
    }
    markFieldAsInvalid(field);
    return false;
};

function validateEmail(field) {
   if (field.value && validator.isEmail(field.value)){
    markFieldAsValid(field);
        return true 
    } 
    markFieldAsInvalid(field);
   return false;
};

function markFieldAsInvalid(field) {
    field.className += " is-invalid";
}

function markFieldAsValid(field) {
    field.className = " form-control is-valid";
}

    
function togleStatus(state) {
    state === "login" ? showLogin() : showRegister(); 
}

function showLogin() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    }
    
function showRegister() {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }

function registerNewUser(email,password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(response => console.log(response)).catch(error => 
        handleError(error));
};

function logIn(email,password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(response => console.log(response)).catch(error => 
        handleError(error));
};

function handleError(error) {
    const alertsList = document.querySelectorAll('.alert');
    alertsList.forEach (alert => {
    const message = alert.querySelector('.error-message');
    message.innerHTML = error.message;
    alert.className = "alert alert-danger fade show m-4";
});
};