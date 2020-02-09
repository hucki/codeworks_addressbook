class AdressEntry {
  constructor(name, surname) {
    this._name = name;
    this._surname = surname;
  }
  get name() {
    return this._name;
  }
  get surname() {
    return this._surname;
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

function showContactList() {
  numberOfContacts = addressBook.length;
  if(numberOfContacts > 0) {
    $('#contacts_table').text('');
/*
    $('<table>')
      .addClass('actualContactList')
      .appendTo('#contacts_table');
*/
    $('<tr>').appendTo($('<thead>').appendTo($('<table>').addClass('actualContactList').appendTo('#contacts_table')));
    for (let [key, value] of Object.entries(addressBook[0])) {
      $('<td>').text(`${key}`).appendTo('tr');
    }
    for(let i = 0; i < numberOfContacts; i++) {
      $('<tr>').addClass((i%2 === 0 ? 'even' : 'odd')).attr('id','contact_'+i).appendTo('.actualContactList');
      for (let [key, value] of Object.entries(addressBook[i])) {
        $('<td>').text(`${value}`).appendTo('#contact_'+i);
      }
    }

  } else {
    $('#contacts_table').text('no Contacts found!');
  }

}

function addAddress(name,surname,phone,address) {
  let addressId = addressBook.length;
  addressBook[addressId] = new AdressEntry(name,surname);
}

function resetContacts() {
  addressBook = [];
  addAddress('John','Doe');
  addAddress('Jane','Smith');
  addAddress('Max','Müller');
  addressBook[0].address = 'Friedrichstraße 76, 10117 Berlin';
  addressBook[0].phone = '+34 601 465 366';

  showContactList();
}
