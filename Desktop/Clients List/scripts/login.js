
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

togleStatus(state);


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

function hideAlert() {
const alertsList = document.querySelectorAll('.alert');
alertsList.forEach(alert => {
    alert.className += " d-none";
});
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
    //   var displayName = user.displayName;
      let email = user.email;
      console.log(email);
      window.location.href = "file:///Users/oluna/Desktop/Clients%20List/clientsList.html";
    //   var emailVerified = user.emailVerified;
    //   var photoURL = user.photoURL;
    //   var isAnonymous = user.isAnonymous;
    //   var uid = user.uid;
    //   var providerData = user.providerData;
      // ...
    } else {
      // User is signed out.
      // ...
    }
  });