function displayData(clientsList = clients) {
  const ul = document.querySelector("#clientsData");
  clientsList.forEach(client => {
    ul.appendChild(getElement(client));
  });
  getTotalAmount(clientsList);
}

function getElement(client) {
  const newLi = document.createElement("li");
  const avatar = document.createElement("img");
  newLi.className = "media";
  avatar.className = "mr-3 align-self-senter";
  avatar.setAttribute("src", client.avatar);
  newLi.appendChild(avatar);
  newLi.appendChild(getClientDescription(client));
  return newLi;
}

function getClientDescription(client) {
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

  div.appendChild(textPart1);
  div.appendChild(emailLink);
  div.appendChild(textPart2);

  return div;
}

function sortData(order) {
  const sortedClients = clients.sort((lastClient, nextClient) => {
    if (order == "ascending") {
      return lastClient.lastName > nextClient.lastName ? 1 : -1;
    } else {
      return lastClient.lastName < nextClient.lastName ? 1 : -1;
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
      return client.gender == "Male";
    } else {
      return client.gender == "Female";
    }
  });
  refreshData(filteredList);
}

function filterClients() {
  const filterString = document
    .querySelector("#filterInput")
    .value.toLowerCase()
    .trim();
  console.log(filterString);
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
  return Number(amount.slice(1));
}
