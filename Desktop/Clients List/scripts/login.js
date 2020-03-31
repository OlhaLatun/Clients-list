
let state = "login";
const form = document.querySelector("[name='registerForm']");


form.querySelector("[type='password']").addEventListener("blur", event => {
    validatePassword(event.target);
});

form.addEventListener("submit", event => {
    event.preventDefault();
    validateForm(event.target);
});

function validateForm(target) {
    validatePassword(target.password);
   registerNewUser(target.email.value, target.password.value);
};

function validatePassword(field) {
    if (field.value.length < 10) {
        field.className += " is-invalid";
    } else {
        field.className = "form-control is-valid";
    }
};


const loginForm = document.querySelector("[name='loginForm']");

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    validateLoginForm(event.target);
});
    
function togleStatus(state) {
    state === "login" ? showLogin() : showRegister(); 
}

function showLogin() {
    loginForm.style.display = "block";
    form.style.display = "none";
    }
    

function showRegister() {
        loginForm.style.display = "none";
        form.style.display = "block";
    }

togleStatus(state);


function validateLoginForm(target) {
    logIn(target.email.value, target.password.value);
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
    alert(`Error! ${error.code} - ${error.message}`);
};

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