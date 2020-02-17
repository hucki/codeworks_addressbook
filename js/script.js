class Contact {
  constructor(id = 0, name = "", surname = "", phone = "", address = "") {
    this._id = id;
    this._name = name;
    this._surname = surname;
    this._phone = phone;
    this._address = address;
  }
  get id()              {return this._id;}
  // no id setter
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
let messageTimeout;
let numberOfRows = 0;

function addContact(name,surname,phone,address) {
  let contactId = addressBook.length;
  addressBook[contactId] = new Contact(contactId,name,surname,phone,address);
  addToLocalStorage(addressBook[contactId]);
  addTableRow(contactId);
  $('#contactList').find('input[type=text]').val('');
}

function showContactList() {
  numberOfRows = 0;
  toggleUndoButton();
  toggleDeleteButton();
  if(addressBook.length > 0) {
    $('#contactList tbody').html('');
    for(let i = 0; i < addressBook.length; i++) {
      addressBook[i] ? addTableRow(i) : null;
    }
  } else {
    $('#contactList tbody').html('');
  }
  $('#contentTable').scrollTop(200);
  $('#contentTable').find('.editButton').hide();

  $('tbody tr td').on('mouseenter', function () {
    let thisId = $(this).parent().prop('id').replace('contact_','');
    let editButtonId = '#editButton_'+thisId;
    $('.editButton').not(editButtonId).hide();
    $(editButtonId).show().on('click', function (event) {
      let thisId = $(this).prop('id').replace('editButton_','');
      editDialog(thisId);
    });
  })
}

function addTableRow(contactId) {
  $('<tr>').addClass((numberOfRows%2 === 0 ? 'even' : 'odd')).attr('id','contact_'+contactId).appendTo('#contactList tbody');
  $('<td>').addClass('checker').html(`<input id="check_${contactId}" type="checkbox" value="${contactId}" name="check_${contactId}">`).appendTo('#contact_'+contactId);
  for (let [key, value] of Object.entries(addressBook[contactId])) {
    key != '_id' ? $('<td>').html(`${value}`).appendTo('#contact_'+contactId) : null;
  }
  $('<td class="editCell">').html('<span class="editButton" style="display:none" id="editButton_' + contactId + '">&#x270E;</span>').appendTo('#contact_'+contactId);
  numberOfRows++;
}

function sortTable (event) {
  $('.tableHeading').not('#'+event.target.id).removeClass('sortAsc').removeClass('sortDesc').addClass('sortNot');
  $('.sortSymbol').html('')
  let sortKey = event.target.id.toLowerCase().replace('heading','').replace('first','');
  let sortFactor = 1;
  let sortClass = event.target.className.split(' ').find(function(item) {
    return item.substr(0,4) === 'sort';
  })
  switch(sortClass) {
    case 'sortNot':
      $(this).addClass('sortAsc').removeClass('sortNot');
      sortClass = 'sortAsc';
      $(this).children().html('&#x25B2;')
      break;
    case 'sortAsc':
      $(this).addClass('sortDesc').removeClass('sortAsc');
      $(this).children().html('&#x25BC;')
      sortClass = 'sortDesc';
      sortFactor = -1;
      break;
    case 'sortDesc':
      $(this).addClass('sortNot').removeClass('sortDesc');
      $(this).children().html('')
      sortClass = 'sortNot';
      sortKey = 'id'
      break;
    default:
      break;
  };

  if (sortKey === 'id') {
    addressBook.sort((a, b) => (a[`${sortKey}`]-b[`${sortKey}`]));
  } else {
    addressBook.sort((a, b) => (a[`${sortKey}`].localeCompare(b[`${sortKey}`]))*sortFactor);
  }
  showContactList();
}

//functions to edit existing contacts
function editDialog(thisId) {
  $('#editId').text(thisId);
  $('#editFirstName').val(addressBook[thisId]['name']);
  $('#editSurname').val(addressBook[thisId]['surname']);
  $('#editPhone').val(addressBook[thisId]['phone']);
  $('#editAddress').val(addressBook[thisId]['address']);
  $('#editModal').show();
  $('#saveButton').on('click', saveChanges);
  $('#editContainer input[type=text]').keyup(saveChanges);
  $('#editModal').on('click', function(event) {
    event.target.id === 'editModal' ? $('#editModal').hide() : null;
  })
}

function saveChanges() {
  event.preventDefault;
  let thisId = $('#editId').text();
  if ((event.type === 'keyup' && event.which === 13) || event.type === 'click' ) {
    if (checkInput($('#editFirstName').val(),$('#editSurname').val(),$('#editPhone').val(),$('#editAddress').val())) {
      localStorage.setItem(thisId+'__name', addressBook[thisId]['name'] = $('#editFirstName').val());
      localStorage.setItem(thisId+'__surname', addressBook[thisId]['surname'] = $('#editSurname').val());
      localStorage.setItem(thisId+'__phone', addressBook[thisId]['phone'] = $('#editPhone').val());
      localStorage.setItem(thisId+'__address', addressBook[thisId]['address'] = $('#editAddress').val());
      $('#editModal').hide();
      showContactList();
      showMessage('Changes saved!');
    }
  }
}

function closeDialog(event) {
  event.which === 27 ? $('#editModal').hide() : null;
}

function checkboxUpdate() {
  if(event.target.name==='checkAll') {
    $(':checkbox').filter(':visible').prop('checked',$('#checkAll').prop('checked'));
    if($(':checkbox').not('#checkAll').filter(':visible').length != $(':checkbox').not('#checkAll').filter(':checkbox').length) {
      showMessage(`All ${$(':checkbox').not('#checkAll').filter(':visible').length} filtered contacts marked`);
    }
  }
  $(':checkbox').not('#checkAll').each(function(event) {
    if($(this).prop('checked')===false) {
      $('#checkAll').prop('checked', false);
      return false;
    } else {
      $('#checkAll').prop('checked', true);
    }
  })
  toggleDeleteButton();
}

function showContactInput(){
  $('.contentTable').scrollTop($('#contactList').height());
  $('#newFirstName').focus();
}

function saveInput(event) {
  event.preventDefault();
  if (event.which === 13) {
    if (checkInput($('#newFirstName').val(),$('#newSurname').val(),$('#newPhone').val(),$('#newAddress').val())) {
      addContact($('#newFirstName').val(),$('#newSurname').val(),$('#newPhone').val(),$('#newAddress').val());
      $('.contentTable').scrollTop($('#contactList').height());
    }
  }
}

function checkInput(name,surname,phone,address) {
  if(name||surname||phone||address) {
    if((phone && validatePhonenumber(phone))|| phone.length === 0) {
      return true;
    } else {
      showMessage('This is not a valid Phonenumber!','Alert');
      return false;
    }
  } else {
    showMessage('An empty contact will not be saved!','Alert');
    return false;
  }
}

function validatePhonenumber(nr) {
  let testPattern = /[+]?[(]?[0-9 ]+[)/-]?[0-9 ]*[-]?[0-9 ]*/g;
  return (nr.match(testPattern)=== null ? '' : nr.match(testPattern).join('')) === nr ? true : false;
}

function toggleDeleteButton() {
  let checkedVisible = $(':checkbox').not('#checkAll').filter(':visible:checked').length;
  checkedVisible > 0 ? $('#deleteButton').prop('disabled', false ).text(`Delete (${checkedVisible})`) : $('#deleteButton').prop('disabled', true).text('Delete');
}

function deleteContacts(event) {
  let contactsToDelete = [];
  addressBookDeleted = [];
  $(':checkbox').not('#checkAll').each(function(){
    ($(this).prop('checked')===true) ? contactsToDelete.push($(this).attr('id').replace('check_','')):null;
  })
  let deleteCounter = 0;
  contactsToDelete.forEach((item, i) => {
    let contactToDelete = addressBook.splice(item-deleteCounter,1)
    let contactId = contactToDelete[0]['_id'];
    for (let [key, value] of Object.entries(contactToDelete[0])) {
      addressBookDeleted[contactId] ? null : addressBookDeleted[contactId] = new Contact(contactId,'','','','');
      addressBookDeleted[contactId][key] = value;
    }
    removeFromLocalStorage(contactToDelete[0]);
    deleteCounter++;
  });

  showMessage(`${(deleteCounter>0?deleteCounter:'No')} contact${(deleteCounter>1?'s':'')} deleted.`,'Confirmation')
  $(':checkbox').each(function(){
    $(this).prop('checked',false);
  })
  resetSearch();
  showContactList();
}

function toggleUndoButton() {
  addressBookLength(addressBookDeleted) > 0 ? $('#undoButton').prop('disabled', false ).text(`Undo (${addressBookLength(addressBookDeleted)})`) : $('#undoButton').prop('disabled', true).text('Undo');
}

function undoDelete(){
  addressBookDeleted.forEach((item, i) => {
    addToLocalStorage(item);
    addressBook.push(item);
  });
  showMessage(`${(addressBookLength(addressBookDeleted)>0?addressBookLength(addressBookDeleted):'No')} contact${(addressBookLength(addressBookDeleted)>1?'s':'')} restored.`,'Confirmation')
  addressBookDeleted = [];
  showContactList();
}

function addressBookLength(whichAddressBook=addressBook) {
  if (whichAddressBook.length === 0) {
    return 0;
  } else {
    let abLength = 0
    for (let i = 0; i<whichAddressBook.length;i++) {
      whichAddressBook[i] ? abLength++ : null;
    }
    return abLength;
  }
}

function showMessage(text, type='Confirmation') {
  clearTimeout(messageTimeout);
  let content = type === 'Alert' ? '&#x2757; ' + text :  text;
  $('#message').html(content).attr('style','width: '+(text.length*9)+'px').slideDown('slow');
  messageTimeout = setTimeout(function () {
    $('#message').slideUp();
  }, 2000);;
}

function liveSearch() {
  let foundContacts = [];
  let searchValue = $(this).val().toLowerCase();
  if(searchValue.length > 0) {
    $(':checkbox').prop('checked', false);
    $('#searchfield').addClass('searchActive');
    $('#contactList tbody tr td').not('.checker').not('.editCell').each(function(){
      // find searchValue in each Cell
      let findInText = $(this).text().toLowerCase();
      if (findInText.indexOf(searchValue) >= 0) {
        // found searchValue in one Cell
        (foundContacts.findIndex((element) => element === $(this).parent().attr('id')) < 0) ? foundContacts.push($(this).parent().attr('id')) : null;
        let foundValue = $(this).text().substr(findInText.indexOf(searchValue), searchValue.length);
        let highlightText = $(this).text();
        $(this).html(highlightText.replace(foundValue, `<span class="found">${foundValue}</span>`));
        $(this).parent().show();
        $('#filterInfo').text(foundContacts.length + ' of ' + addressBookLength(addressBook) + ' entries matched');
      } else {
        $(this).html($(this).text());
        (foundContacts.findIndex((element) => element === $(this).parent().attr('id')) < 0) ? $(this).parent().hide() : null;
        $('#filterInfo').text(foundContacts.length + ' of ' + addressBookLength(addressBook) + ' entries matched');
      }
    })
    $('#contactList tbody tr td :checkbox').prop('checked',false).filter(function() {
      return $(this).parent().parent().prop('style') === 'display: none' ? false : true;
    });
  } else {
    resetSearch();
    $('#contactList tbody tr td').not('.checker').not('.editCell').each(function(){
      $(this).html($(this).text());
      $(this).parent().show();
    });
  }
}

function resetSearch() {
  $('#searchfield').val('');
  $('#searchfield').removeClass('searchActive');
  $('#filterInfo').text('');
}

function resetContacts() {
  localStorage.clear();
  addressBook = [];
  addressBookDeleted = [];
  $('#checkAll').prop('checked', false);
  resetSearch();
  for(let i  = 0; i<1; i++) {
    addContact('Jane','Codeworks', '+34 601 465 366', `Carrer d'Àvila, 27, 08005 Barcelona`);
    addContact('Cliff','Huxtable','+1 555 123456','10 Stigwood Avenue, New York City');
    addContact('Sirius','Black','+1 555 123489','12 Grimmauld Place, London, UK');
    addContact('Spongebob','Squarepants','+1 555 123522','124 Conch Street, Bikini Bottom, Pacific Ocean');
    addContact('Herman','Munster','+1 555 123555','1313 Mockingbird Lane, Mockingbird Heights, USA');
    addContact('Doc','Brown','+1 555 123654','1640 Riverside Drive, Hill Valley, California');
    addContact('Sherlock','Holmes','+1 555 123687','221B Baker Street, London, UK');
    addContact('Fox','Mulder','+1 555 123720','2630 Hegal Place, Apt. 42, Alexandria, Virginia, 23242');
    addContact('Peter','Griffin','+1 555 123753','31 Spooner Street, Quahog, Rhode Island');
    addContact('Dana','Scully','+1 555 123786','3170 W. 53 Rd. #35, Annapolis, Maryland');
    addContact('Raymond','Barone','+1 555 123819','320 Fowler Street, Lynbrook, New York');
    addContact('Clark','Kent','+1 555 123852','344 Clinton St., Apt. 3B, Metropolis, USA');
    addContact('Dudley','Dursley','+1 555 123885','4 Privet Drive, Little Whinging, Surrey, UK');
    addContact('Tim','Taylor','+1 555 123918','510 Glenview, Detroit, Michigan');
    addContact('Jon','Arbuckle','+1 555 123951','711 Maple Street, USA');
    addContact('Roseanne','Conners','+1 555 123984','714 Delaware, Lanford IL');
    addContact('Al','Bundy','+1 555 124017','9764 Jeopardy Lane, Chicago, Illinois');
    addContact('Jerry','Seinfeld','+1 555 124050','Apartment 5A, 129 West 81st Street, New York, New York');
    addContact('Tyler','Durden','+1 555 124083','537 Paper Street, Bradford 19808 ');
    addContact('Homer','Simpson','+1 555 124116','742 Evergreen Terrace, Springfield');
    addContact('Kate','Tanner','+1 555 124149','167 Hemdale Street, Los Angeles, California ');
    addContact('Hercule','Poirot','+1 555 124182','Apt. 56B, Whitehaven Mansions, Sandhurst Square, London W1');

    addContact('John','Codeworks', '+34 601 465 366', `Carrer d'Àvila, 27, 08005 Barcelona`);
    addContact('Claire','Huxtable','+1 555 123456','10 Stigwood Avenue, New York City');
    addContact('Regulus','Black','+1 555 123489','12 Grimmauld Place, London, UK');
    addContact('Garry','Squarepants','+1 555 123522','124 Conch Street, Bikini Bottom, Pacific Ocean');
    addContact('Lily','Munster','+1 555 123555','1313 Mockingbird Lane, Mockingbird Heights, USA');
    addContact('Buffy','Summers','+1 555 123621','1630 Revello Drive, Sunnydale, CA');
    addContact('Dr.','Watson','+1 555 123687','221B Baker Street, London, UK');
    addContact('Lois','Griffin','+1 555 123753','31 Spooner Street, Quahog, Rhode Island');
    addContact('Debra','Barone','+1 555 123819','320 Fowler Street, Lynbrook, New York');
    addContact('Lois','Lane','+1 555 123852','344 Clinton St., Apt. 3B, Metropolis, USA');
    addContact('Harry','Potter','+1 555 123885','4 Privet Drive, Little Whinging, Surrey, UK');
    addContact('Jill','Taylor','+1 555 123918','510 Glenview, Detroit, Michigan');
    addContact('Garfield','Arbuckle','+1 555 123951','711 Maple Street, USA');
    addContact('Dan','Conners','+1 555 123984','714 Delaware, Lanford IL');
    addContact('Peggy','Bundy','+1 555 124017','9764 Jeopardy Lane, Chicago, Illinois');
    addContact('Cosmo','Cramer','+1 555 124050','Apartment 5A, 129 West 81st Street, New York, New York');
    addContact('Robert','Paulson','+1 555 124083','537 Paper Street, Bradford 19808 ');
    addContact('Marge','Simpson','+1 555 124116','742 Evergreen Terrace, Springfield');
    addContact('Willie','Tanner','+1 555 124149','167 Hemdale Street, Los Angeles, California ');
    addContact('Arthur','Hastings','+1 555 124182','Apt. 56B, Whitehaven Mansions, Sandhurst Square, London W1');
  }
  showContactList();
  showMessage('Dummy Adresses restored.')
}

// localStorage handling
function addToLocalStorage(contactObj) {
  let contactId = contactObj['_id'];
  for (let [key, value] of Object.entries(contactObj)) {
    localStorage.setItem(contactId+'_'+key, value);
  }
}

function removeFromLocalStorage(contactObj) {
  let contactId = contactObj['_id'];
  for (let [key, value] of Object.entries(contactObj)) {
    localStorage.removeItem(contactId+'_'+key);
  }
}

function retrieveFromLocalStorage() {
  addressBook = [];
  addressBookDeleted = [];
  $('#checkAll').prop('checked', false);
  resetSearch();
  for (let i = 0; i < localStorage.length; i++) {
    let contactId = localStorage.key(i).split('__')[0]
    addressBook[contactId] ? null : addressBook[contactId] = new Contact(contactId,'','','','');
    let addressKey = localStorage.key(i).split('__')[1]
    let addressValue = localStorage.getItem(localStorage.key(i));
    addressBook[contactId][addressKey] = addressValue;
  }
}

function initApp(){
  retrieveFromLocalStorage();
  showContactList();
}

$(document).ready(function() {

  initApp();

  // user interaction handling
  $('#contactList').change(checkboxUpdate)
  $('#searchfield').keyup(liveSearch);
  $('#showInput').on('click', showContactInput);
  $('#resetButton').on('click', resetContacts);
  $('#deleteButton').on('click', deleteContacts);
  $('#undoButton').on('click', undoDelete);
  $('#contactListFooter input[type=text]').not('#searchfield').keyup(saveInput);
  $('.tableHeading').on('click', sortTable);

  $(window).keyup(closeDialog);
});
