class AdressEntry {
  constructor(name, surname) {
    this._name = name;
    this._surname = surname;
  }
  set phone(phone) {
    this._phone = phone;
  }
  set adress(address) {
    this._address = address;
  }
};

let numberOfContacts = 0;
let addressBook = [];
let contactsTable;
let contactsTableHtml;
//let newContactsTable = document.createElement("<table>");
//let newContactsRow = document.createElement("<tr>");

function showContactList() {
  numberOfContacts = addressBook.length;
  contactsTable = document.getElementById("contacts_table");
  if(numberOfContacts > 0) {
    //contactsTable.appendChild(newContactsTable);
    //contactsTable.innerHTML = `<table>`;
    contactsTableHtml = $('<table>').addClass('actualContactList');
    contactsTable.append(contactsTableHtml);
    /*
    for(let i = 0; i < numberOfContacts; i++) {
      //contactsTable.innerHTML.append(`<tr> ${addressBook[i]._name} ${addressBook[i]._surname} </tr>`);
      let tableRow = $('<tr>').addClass('Row').text(`${addressBook[i]._name} ${addressBook[i]._surname}`);
      contactsTableHtml.append(tableRow);
      //contactsTableHtml = contactsTableHtml + `${addressBook[i]._name} ${addressBook[i]._surname} <br>`;
    }
    //contactsTableHtml = contactsTableHtml + `End List: <br>`;
    //contactsTable.innerHTML.append(`</table>`);
    //contactsTable.innerHTML = contactsTableHtml;
    */
  } else {
    contactsTableHtml.innerHTML = "no Contacts found!";
  }

}

function addAddress(name,surname,phone,address) {
  let addressId = addressBook.length;
  addressBook[addressId] = new AdressEntry(name,surname);
}
