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
const maxPerPage = 25;
let pageNr = 1;
let numberOfContacts = addressBook.length;
let numberOfContactsPage = 25;
let contactsTable;
let contactsTableHtml;

function showContactList() {
  $('.controlsRight').find('button').prop( "disabled", true );
  numberOfContacts = addressBook.length;
  numberOfContactsPage = maxPerPage*pageNr > numberOfContacts ? numberOfContacts : maxPerPage*pageNr;
  if(numberOfContacts > 0) {
    $('#contacts_table').text('');
    $('#actualContactList tbody').html('');
    for(let i = 0; i < numberOfContactsPage; i++) {
      addTableRow(i);
    }
  } else {
    $('#contacts_table').text('no Contacts found!');
    $('#actualContactList tbody').html('');
  }

}

function addTableRow(addressId) {
  $('<tr>').addClass((addressId%2 === 0 ? 'even' : 'odd')).attr('id','contact_'+addressId).appendTo('#actualContactList tbody');
  $('<td>').addClass('checker').html(`<input id="check_${addressId}" type="checkbox" value="${addressId}" name="check_${addressId}">`).appendTo('#contact_'+addressId);
  for (let [key, value] of Object.entries(addressBook[addressId])) {
    $('<td>').text(`${value}`).appendTo('#contact_'+addressId);
  }
}

function addAddress(name,surname,phone,address) {
  let addressId = addressBook.length;
  addressBook[addressId] = new AddressEntry(name,surname,phone,address);
  addTableRow(addressId);
  $('#actualContactList').find('input[type=text]').val('');
}

function showContactInput(event){
  $('#actualContactList').find('input[type=text]').show();
/*
  $('table :input[type=text]').each(function() {
    $(this).slideDown();
  })
*/
}
function addContact(event) {
  event.preventDefault();
  if ( (event.type === 'keyup' && event.which === 13) || event.type === 'click' ) {
    if($('#newFirstName').val()||$('#newSurname').val()||$('#newPhone').val()||$('#newAddress').val()) {
      addAddress($('#newFirstName').val(),$('#newSurname').val(),$('#newPhone').val(),$('#newAddress').val());
      $('#actualContactList').find('input[type=text]').hide();
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
  } else {
    $('#actualContactList tbody tr td').not('.checker').each(function(){
      $(this).html($(this).text());
      $(this).parent().show();
    });
  }
}

function resetContacts() {
  addressBook = [];
  addAddress('Gabi','Müller', '+49 30 465 366', 'Friedrichstr. 76, 10117 Berlin');
  addAddress('John','Doe', '+34 601 465 366', `Carrer d'Àvila, 27, 08005 Barcelona`);
  addAddress('Max','Mad','','The Thunderdome, Down Under');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('Jack','Mayne','+11 234 567 89','Los Angeles');
  addAddress('Jill','Payne','+11 234 567 89','Los Angeles');
  addAddress('Peter','Cayne','+11 234 567 89','Los Angeles');
  addAddress('Paul','Dayne','+11 234 567 89','Los Angeles');
  addAddress('Mary','Layne','+11 234 567 89','Los Angeles');
  addAddress('Jimbo','Jayne','+11 234 567 89','Los Angeles');
  addAddress('John','Bayne','+11 234 567 89','Los Angeles');
  addAddress('John','Fayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');
  addAddress('John','Wayne','+11 234 567 89','Los Angeles');

  showContactList();
}
