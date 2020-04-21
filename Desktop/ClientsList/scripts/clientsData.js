const firebase = require('firebase/app');
require('firebase/database');
import { displayData } from "./dom";
let clients = [];

export function getData() {
  console.log("getData()");
const database = firebase.database();
const clientsRef = database.ref("clients");

clientsRef.on("value", snapshot => {
  clients = convertObjToArr(snapshot.val());
  displayData(clients);
});
}

function convertObjToArr(object) {
  return Object.keys(object).map(key => {
    return {
      clientID: key,
      ... object[key]
    };
  });
}

export { clients }; 