
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.css";

const firebase = require('firebase/app');
const $ = require('jquery');
require('firebase/auth');
require('firebase/database');
import { appInit } from "./firebase-latun";
import { getData, clients } from "./clientsData";
import { showClientsList, showCorrectSection, refreshData, displayData } from "./dom";


appInit();
getData();

//Observe changes

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    let email = user.email;
  } else {
    window.location.href = "./login.html";
  }
});

const addClientForm = document.getElementById("addClientForm");

addClientForm.addEventListener("submit", event => {
    event.preventDefault();
    addClient(event.target);
    $('#newClientForm').modal('hide');
    return false;
});

const editClientForm = document.getElementById("editClientForm");

editClientForm.addEventListener("submit", event => {
    event.preventDefault();
    editClient(event.target);
    $('#editClientModal').modal('hide');
    return false;
});

const filterGender = [
  { id: "filterMale", value: "male" },
  { id: "filterFemale", value: "female" },
  { id: "filterOther", value: "other" },
  { id: "filterAll", value: "all"}
];

filterGender.forEach(filter => {
  const element = document.querySelector(`#${filter.id}`);
  element.addEventListener("mouseover", () => {
    filterByGender(filter.value);
  });
});

const sortFields = [
  { id: "sortAscending", value: "ascending" },
  { id: "sortDescending", value: "descending" }
];

sortFields.forEach(field => {
  const element = document.querySelector(`#${field.id}`);
  element.addEventListener("click", () => {
    sortData(field.value);
  });
});

const filterField = document.querySelector("#filterInput");
filterField.addEventListener("keyup", event => {
  filterClients(event);
})

const logOutBtn = document.querySelector("#logout");
logOutBtn.addEventListener("click", () => {
  logOut();
});
 
function addClient(form) {
  
  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    gender: form.gender.value,
    amount: form.amount.value,
    date: form.date.value,
  };
  
 
  const newId = firebase.database().ref().child("clients").push().key;
  let updates = {};
  updates[`clients/${newId}`] = data;
  updateDB(updates);
}

function updateDB(updates) {
  firebase.database().ref().update(updates, function(error){
    if (error) {
      console.error("Data was not added to database!");
    } else {
      console.log("Data added successfully");
    }
  });
}

function editClient(form) {
  
  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    gender: form.gender.value,
    amount: form.amount.value,
    date: form.date.value,
  };
  
  const id = form.clientId.value;
  console.log(id);
  let updates = {};
  updates[`clients/${id}`] = data;
  if (id) updateDB(updates);
}

function  deleteClient(id) {
  const clientRef = firebase.database().ref(`clients/${id}`);
  clientRef.remove();
}

function sortData(order) {
  const sortedClients = clients.sort((lastClient, nextClient) => {
    if (order == "ascending") {
      return lastClient.lastName.toLowerCase() > nextClient.lastName.toLowerCase() ? 1 : -1;
    } else {
      return lastClient.lastName.toLowerCase() < nextClient.lastName.toLowerCase() ? 1 : -1;
    }
  });
  refreshData(sortedClients);
}

function filterByGender(sex) {
  const filteredList = clients.filter(client => {
    if (sex == "male") {
      return client.gender.toLowerCase() == "male";
    } else if (sex == "female"){
      return client.gender.toLowerCase() == "female";
    } else if (sex == "other") {
      return client.gender.toLowerCase() == "other";
    } else {
     return clients;
    };
  });
  refreshData(filteredList);
}

function filterClients(event) {
  const filterString = event.target
    .value.toLowerCase()
    .trim();
  if (filterString) {
    const filteredClients = clients.filter(client => {
      return (
        client.firstName.toLowerCase().includes(filterString) ||
        client.lastName.toLowerCase().includes(filterString) ||
        client.email.toLowerCase().includes(filterString)
      );
    });
    refreshData(filteredClients);
    showCorrectSection(filteredClients);
  } else {
    refreshData(clients);
    showClientsList();
  }
}

function removeCurrencyFromAmount(amount) {
  return amount ? Number(amount.slice(1)) : 0;
}

function logOut() {
  firebase.auth().signOut().then(function() {
      window.location = '/login.html';
  }).catch(function(error) {
    console.log(error);
  });
}

export function getTotalAmount(clientsList = clients) {
  const total = clientsList.reduce((amount, client) => {
    return amount + removeCurrencyFromAmount(client.amount);
  }, 0);
  document.querySelectorAll(".totalAmountContainer").forEach(element => {
    element.innerHTML = total.toFixed(2);
  });
}

export function getDeleteBtn(id) {
  const confirmDelete = document.querySelector("#confirmDelete");
  confirmDelete.addEventListener("click", () => {
    deleteClient(id);
  })
}

export function fillClientForm(id) {

  const currentClient = clients.find(client => client.clientID == id);
  if (editClientForm) {
    editClientForm.firstName.value = currentClient.firstName;
    editClientForm.lastName.value = currentClient.lastName;
    editClientForm.email.value = currentClient.email;
    editClientForm.gender.value = currentClient.gender;
    editClientForm.amount.value = currentClient.amount;
    editClientForm.date.value = currentClient.date;
    editClientForm.clientId.value = id;
  }
}