firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
  //   var displayName = user.displayName;
    let email = user.email;
  //   var emailVerified = user.emailVerified;
  //   var photoURL = user.photoURL;
  //   var isAnonymous = user.isAnonymous;
  //   var uid = user.uid;
  //   var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    window.location.href = "file:///Users/oluna/Desktop/Clients%20List/login.html";
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
  
 
  const newId = database.ref().child("clients").push().key;
  let updates = {};
  updates[`clients/${newId}`] = data;
  updateDB(updates);
}

function updateDB(updates) {
  database.ref().update(updates, function(error){
    if (error) {
      console.error("Data was not added to database!");
    } else {
      console.log("Data added successfully");
    }
  });
}

function displayData(clientsList = clients) {
  clearList();
  const ul = document.querySelector("#clientsData");
  for (property in clientsList) {
    ul.appendChild(getElement(clientsList[property], property));
  }
  getTotalAmount(clientsList);
}

function getElement(client, id) {
  const newLi = document.createElement("li");
  // const avatar = document.createElement("img");
  newLi.className = "media";
  newLi.id = id;
  // avatar.className = "mr-3 align-self-senter";
  // avatar.setAttribute("src", client.avatar);
  // newLi.appendChild(avatar);
  newLi.appendChild(getClientDescription(client, id));
  return newLi;
}

function getClientDescription(client, id) {
  const div = document.createElement("div");
  div.className = "media-body";
  const emailLink = document.createElement("a");
  emailLink.setAttribute("href", `mailto:${client.mail}`);
  emailLink.innerHTML = client.email;

  const textPart1 = document.createTextNode(
    `${client.lastName} ${client.firstName} `
  );
  const textPart2 = document.createTextNode(
    ` ${client.gender},  ${client.date}, ${client.amount}`
  );

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute('type', "button");
  deleteBtn.className = "btn btn-outline-secondary btn-sm ml-1";
  deleteBtn.setAttribute('data-toggle', "modal");
  deleteBtn.setAttribute('data-target', "#exampleModal");
  deleteBtn.innerHTML = " Delete";

  deleteBtn.addEventListener("click", event => {
    event.preventDefault();
    getDeleteBtn(id);
  }); 

  const editLink = createEditLink(id);

  div.appendChild(textPart1);
  div.appendChild(emailLink);
  div.appendChild(textPart2);
  div.appendChild(editLink);
  div.appendChild(deleteBtn);

  return div;
}

function createEditLink(id) {
  const editLink = document.createElement("a");
  editLink.setAttribute('href', "#");
  editLink.className = "px-2 edit-client-link";
  editLink.setAttribute('data-toggle', "modal");
  editLink.setAttribute('data-target', "#editClientModal");
  editLink.setAttribute('data-client-id', id);
  editLink.innerHTML = " Edit";
  editLink.addEventListener("click", () => {
    fillClientForm(id); 
  })
  
  return editLink;
}

function fillClientForm(id) {

  if (editClientForm) {
    editClientForm.firstName.value = clients[id].firstName;
    editClientForm.lastName.value = clients[id].lastName;
    editClientForm.email.value = clients[id].email;
    editClientForm.gender.value = clients[id].gender;
    editClientForm.amount.value = clients[id].amount;
    editClientForm.date.value = clients[id].date;
    editClientForm.clientID.value = id;
  }
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
  
  const id = form.clientID.value;
  console.log(id);
  let updates = {};
  updates[`clients/${id}`] = data;
  if (id) updateDB(updates);
}

function getDeleteBtn(id) {
  const confirmDelete = document.querySelector("#confirmDelete");

  confirmDelete.addEventListener("click", () => {
    deleteClient(id);
  })
}

function  deleteClient(id) {
  const clientRef = database.ref(`clients/${id}`);
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

function refreshData(updatedClients) {
  clearList();
  displayData(updatedClients);
}

function clearList() {
  $("ul").empty();
  // const ul = document.querySelector("#clientsData");
  //   while (ul.firstChild) {
  //     ul.removeСhild(ul.firstChild);
  // }
}

function filterByGender(sex) {
  const filteredList = clients.filter(client => {
    if (sex == "male") {
      return client.gender.toLowerCase() == "male";
    } else if (sex == "female"){
      return client.gender.toLowerCase() == "female";
    } else {
      return client.gender.toLowerCase() == "other";
    }
  });
  refreshData(filteredList);
}

function filterClients() {
  const filterString = document
    .querySelector("#filterInput")
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
function showCorrectSection(filteredClients) {
  if (filteredClients.length === 0) {
    document.querySelector(".notFound").style.display = "block";
    document.querySelector("#clientsData").style.display = "none";
  } else {
    document.querySelector(".notFound").style.display = "none";
    document.querySelector("#clientsData").style.display = "block";
  }
}

function showClientsList() {
  document.querySelector(".notFound").style.display = "none";
  document.querySelector("#clientsData").style.display = "block";
}

function getTotalAmount(clientsList = clients) {
  const total = clientsList.reduce((amount, client) => {
    return amount + removeCurrencyFromAmount(client.amount);
  }, 0);
  document.querySelectorAll(".totalAmountContainer").forEach(element => {
    element.innerHTML = total.toFixed(2);
  });
}

function removeCurrencyFromAmount(amount) {
  return amount ? Number(amount.slice(1)) : 0;
}

function logOut() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.href = "file:///Users/oluna/Desktop/Clients%20List/login.html";
  }).catch(function(error) {
    console.log(error);
    // An error happened.
  });
}