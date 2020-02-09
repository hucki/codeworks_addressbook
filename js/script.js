class AddressEntry {
  constructor(name = "", surname = "", phone = "", address = "") {
    this._name = name;
    this._surname = surname;
    this._phone = phone;
    this._address = address;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
  get surname() {
    return this._surname;
  }
  set surname(surname) {
    this._surname = surname;
  }
  get phone() {
    return this._phone;
  }
  set phone(phone) {
    this._phone = phone;
  }
  get address() {
    return this._address;
  }
  set address(address) {
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

    $('<tr>')
      .appendTo($('<thead>')
        .appendTo($('<table>')
          .addClass('actualContactList')
          .appendTo('#contacts_table')));
    for (let [key, value] of Object.entries(addressBook[0])) {
      $('<td>').text(`${key}`.substring(1,key.length)).appendTo('tr');
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
  addressBook[addressId] = new AddressEntry(name,surname,phone,address);
  showContactList();
}
function deleteAddress(id) {

}

function showNewAddressForm() {
  $('#newAddressForm').removeAttr('hidden');
}
function hideNewAddressForm() {
  $('#newAddressForm').attr('hidden');
}
function resetContacts() {
  addressBook = [];
  addAddress('John','Doe', '+34 601 465 366', 'Friedrichstr. 76, 10117 Berlin', );
  addAddress('Jane','Smith', '+34 601 465 366', 'Carrer d\'Àvila, 27, 08005 Barcelona');
  addAddress('Max','Mad');

  showContactList();
}
