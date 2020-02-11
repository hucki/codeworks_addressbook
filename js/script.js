class AddressEntry {
  constructor(name = "", surname = "", phone = "", address = "") {
    this._name = name;
    this._surname = surname;
    this._phone = phone;
    this._address = address;
  }
  get name()            {return this._name;}
  set name(name)        {this._name = name;}
  get surname()         {return this._surname;}
  set surname(surname)  {this._surname = surname;}
  get phone()           {return this._phone;}
  set phone(phone)      {this._phone = phone;}
  get address()         {return this._address;}
  set address(address)  {this._address = address;}
};

let addressBook = [];
let addressBookDeleted = [];
let addressBookDeletedArray = [];
let numberOfContacts = addressBook.length;
let contactsTable;
let contactsTableHtml;

function showContactList() {
  numberOfContacts = addressBook.length;
  if(numberOfContacts > 0) {
    $('#contacts_table').text('');
    $('#actualContactList tbody').html('');
    for(let i = 0; i < numberOfContacts; i++) {
      $('<tr>').addClass((i%2 === 0 ? 'even' : 'odd')).attr('id','contact_'+i).appendTo('#actualContactList tbody');
      $('<td>').addClass('checker').html(`<input id="check_${i}" type="checkbox" value="${i}" name="check_${i}">`).appendTo('#contact_'+i);
      for (let [key, value] of Object.entries(addressBook[i])) {
        $('<td>').text(`${value}`).appendTo('#contact_'+i);
      }
    }
  } else {
    $('#contacts_table').text('no Contacts found!');
    $('#actualContactList tbody').html('');
  }

}

function addAddress(name,surname,phone,address) {
  let addressId = addressBook.length;
  addressBook[addressId] = new AddressEntry(name,surname,phone,address);
  $('#actualContactList').find('input[type=text]').val('');
  showContactList();
}

function addContact(event) {
  event.preventDefault();
  if ( (event.type === 'keyup' && event.which === 13) || event.type === 'click' ) {
    if($('#newFirstName').val()||$('#newSurname').val()||$('#newPhone').val()||$('#newAddress').val()) {
      addAddress($('#newFirstName').val(),$('#newSurname').val(),$('#newPhone').val(),$('#newAddress').val());
    } else {
      alert('Please input data in at least one given field.');
    }
  }
}

function deleteContacts(ids) {

  addressBook.splice(id);
  showContactList();
}


function liveSearch() {
  let foundContacts = [];
  let searchValue = $(this).val().toLowerCase(); //.split(' ');
  console.log(searchValue);

  if(searchValue.length > 0) {
    //searchValue.forEach((item, i) => {
      $('#actualContactList tbody tr td').not('.checker').each(function(){
        let findInText = $(this).text().toLowerCase();
        if (findInText.indexOf(searchValue) >= 0) {
          (foundContacts.findIndex((element) => element === $(this).parent().attr('id')) < 0) ? foundContacts.push($(this).parent().attr('id')) : null;
          let foundValue = $(this).text().substr(findInText.indexOf(searchValue), searchValue.length);
          let highlightText = $(this).text();
          $(this).html(highlightText.replace(foundValue, `<span class="found">${foundValue}</span>`));
          $(this).parent().show();
        } else {
          $(this).html($(this).text());
          (foundContacts.findIndex((element) => element === $(this).parent().attr('id')) < 0) ? $(this).parent().hide() : null;
        }
      })
    //});
  } else {
    $('#actualContactList tbody tr td').not('.checker').each(function(){
      $(this).html($(this).text());
      $(this).parent().show();
    });
  }
}

function resetContacts() {
  addressBook = [];
  addAddress('John','Doe', '+34 601 465 366', 'Friedrichstr. 76, 10117 Berlin');
  addAddress('Jane','Smith', '+34 601 465 366', `Carrer d'Àvila, 27, 08005 Barcelona`);
  addAddress('Max','Mad');

  showContactList();
}
