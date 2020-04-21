import { getTotalAmount, getDeleteBtn, fillClientForm } from "./script";
import { clients } from "./clientsData";

  function getElement(client) {

    const newLi = document.createElement("li");
    newLi.className = "media";
    newLi.id = client.clientID;
    newLi.appendChild(getClientDescription(client, client.clientID));
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
    editLink.addEventListener("click", event => {
      event.preventDefault();
      fillClientForm(id); 
    });
    
    return editLink;
  }
  
  function clearList() {
    const ul = document.querySelector("#clientsData");
      while (ul.firstChild) {
       ul.removeChild(ul.firstChild);
      }
  }

  export function showCorrectSection(filteredClients) {
    if (filteredClients.length === 0) {
      document.querySelector(".notFound").style.display = "block";
      document.querySelector("#clientsData").style.display = "none";
    } else {
      document.querySelector(".notFound").style.display = "none";
      document.querySelector("#clientsData").style.display = "block";
    }
  }
  
  export function showClientsList() {
    document.querySelector(".notFound").style.display = "none";
    document.querySelector("#clientsData").style.display = "block";
  }

  export function displayData(clientsList = clients) {
    clearList();
    clientsList.forEach(client => {
      const ul = document.querySelector("#clientsData");
      ul.appendChild(getElement(client));
      
    });
    getTotalAmount(clientsList);
  }

  export function refreshData(updatedClients) {
    clearList();
    displayData(updatedClients);
  }