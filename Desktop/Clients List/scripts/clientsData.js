let clients = [];

const database = firebase.database();
const clientsRef = database.ref("clients");

clientsRef.on("value", snapshot => {
  clients = snapshot.val();
  displayData(clients);
});
