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
let contactsTable;
let messageTimeout;
let numberOfContacts = addressBook.length;

function initApp(){
  showContactList();
  resizeContactList();
  $('#editContentDiv').show();
  $('#editContentDiv').hide();
}

function resizeContactList() {
  let maxHeight = $( window ).height() - $('.header').height()-$('#showInput').height()-40;
  $('.contentTable').attr('style','max-height: '+maxHeight+'px');
}

function showContactList() {
  toggleUndoButton();
  toggleDeleteButton();
  $('.controlsRight').find('button').not('#resetButton').prop('disabled', true );
  numberOfContacts = addressBook.length;
  if(numberOfContacts > 0) {
    $('#contacts_table').text('');
    $('#actualContactList tbody').html('');
    for(let i = 0; i < numberOfContacts; i++) {
      addTableRow(i);
    }
  } else {
    $('#contacts_table').text('no Contacts found!');
    $('#actualContactList tbody').html('');
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

function editDialog(thisId) {
  $('#editId').text(thisId);
  $('#editFirstName').val(addressBook[thisId]['name']);
  $('#editSurname').val(addressBook[thisId]['surname']);
  $('#editPhone').val(addressBook[thisId]['phone']);
  $('#editAddress').val(addressBook[thisId]['address']);
  $('#editContentDiv').show();
}

function saveChanges() {
  event.preventDefault;
  let thisId = $('#editId').text();
  console.log(thisId);
  addressBook[thisId]['name'] = $('#editFirstName').val();
  addressBook[thisId]['surname'] = $('#editSurname').val();
  addressBook[thisId]['phone'] = $('#editPhone').val();
  addressBook[thisId]['address'] = $('#editAddress').val();
  $('#editContentDiv').hide();
  showContactList();
  showMessage('Changes saved!');
}
function addTableRow(addressId) {
  $('<tr>').addClass((addressId%2 === 0 ? 'even' : 'odd')).attr('id','contact_'+addressId).appendTo('#actualContactList tbody');
  $('<td>').addClass('checker').html(`<input id="check_${addressId}" type="checkbox" value="${addressId}" name="check_${addressId}">`).appendTo('#contact_'+addressId);
  for (let [key, value] of Object.entries(addressBook[addressId])) {
    $('<td>').html(`${value}`).appendTo('#contact_'+addressId);
  }
  $('<td class="editCell">').html('<span class="editButton" style="display:none" id="editButton_' + addressId + '">&#x270E;</span>').appendTo('#contact_'+addressId);
}

function addAddress(name,surname,phone,address) {
  let addressId = addressBook.length;
  addressBook[addressId] = new AddressEntry(name,surname,phone,address);
  addTableRow(addressId);
  $('#actualContactList').find('input[type=text]').val('');
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
  $('.contentTable').scrollTop($('#actualContactList').height());
  $('#newFirstName').focus();
}

function validatePhonenumber() {
  let testPattern = /[+]?[(]?[0-9 ]+[)/-]?[0-9 ]*[-]?[0-9 ]*/g;
  return ($('#newPhone').val().match(testPattern)=== null ? '' : $('#newPhone').val().match(testPattern).join('')) === $('#newPhone').val() ? true : false;
}

function addContact(event) {
  event.preventDefault();
  if ((event.type === 'keyup' && event.which === 13) || event.type === 'click' ) {
    if($('#newFirstName').val()||$('#newSurname').val()||$('#newPhone').val()||$('#newAddress').val()) {
      if(($('#newPhone').val() && validatePhonenumber())|| $('#newPhone').val().length === 0) {
        addAddress($('#newFirstName').val(),$('#newSurname').val(),$('#newPhone').val(),$('#newAddress').val());
        $('.contentTable').scrollTop($('#actualContactList').height());
      } else {
        showMessage('Not a valid Phonenumber.','Alert');
      }
    } else {
      showMessage('Please input data before submitting.','Alert');
    }
  }
}

function deleteContacts(event) {
  let contactsToDelete = [];
  let addressBookDeletedArray = [];
  addressBookDeleted = [];
  $(':checkbox').not('#checkAll').each(function(){
    ($(this).prop('checked')===true) ? contactsToDelete.push($(this).attr('id').replace('check_','')):null;
  })
  let deleteCounter = 0;
  contactsToDelete.forEach((item, i) => {
    addressBookDeletedArray.push(addressBook.splice(item-deleteCounter,1));
    deleteCounter++;
  });
  addressBookDeletedArray.forEach((item, i) => {
    addressBookDeleted.push(item[0]);
  });
  showMessage(`${(deleteCounter>0?deleteCounter:'No')} contact${(deleteCounter>1?'s':'')} deleted.`,'Confirmation')
  $(':checkbox').each(function(){
    $(this).prop('checked',false);
  })
  resetSearch();
  showContactList();
}

function toggleUndoButton() {
  addressBookDeleted.length > 0 ? $('#undoButton').prop('disabled', false ).text(`Undo (${addressBookDeleted.length})`) : $('#undoButton').prop('disabled', true).text('Undo');
}

function toggleDeleteButton() {
  let checkedVisible = $(':checkbox').not('#checkAll').filter(':visible:checked').length;
  checkedVisible > 0 ? $('#deleteButton').prop('disabled', false ).text(`Delete (${checkedVisible})`) : $('#deleteButton').prop('disabled', true).text('Delete');
}

function undoDelete(){
  addressBookDeleted.forEach((item, i) => {
    addressBook.push(item);
  });
  showMessage(`${(addressBookDeleted.length>0?addressBookDeleted.length:'No')} contact${(addressBookDeleted.length>1?'s':'')} restored.`,'Confirmation')
  addressBookDeleted = [];
  showContactList();
}

function showMessage(text, type='Confirmation') {
  clearTimeout(messageTimeout);
  let content = type === 'Alert' ? '&#x2757; ' + text :  text;
  $('#confirmedMessage').html(content).attr('style','width: '+(text.length*9)+'px').slideDown('slow');
  messageTimeout = setTimeout(function () {
    $('#confirmedMessage').slideUp();
  }, 2000);;
}

function liveSearch() {
  let foundContacts = [];
  let searchValue = $(this).val().toLowerCase();

  if(searchValue.length > 0) {
    $(':checkbox').prop('checked', false);
    $('#searchfield').addClass('searchActive');
    $('#actualContactList tbody tr td').not('.checker').not('.editCell').each(function(){
      // find searchValue in each Cell


      let findInText = $(this).text().toLowerCase();
      if (findInText.indexOf(searchValue) >= 0) {
        // found searchValue in one Cell
        (foundContacts.findIndex((element) => element === $(this).parent().attr('id')) < 0) ? foundContacts.push($(this).parent().attr('id')) : null;
        let foundValue = $(this).text().substr(findInText.indexOf(searchValue), searchValue.length);
        let highlightText = $(this).text();
        $(this).html(highlightText.replace(foundValue, `<span class="found">${foundValue}</span>`));
        $(this).parent().show();
        $('#filterInfo').text(foundContacts.length + ' of ' + addressBook.length + ' entries matched');
      } else {
        $(this).html($(this).text());
        (foundContacts.findIndex((element) => element === $(this).parent().attr('id')) < 0) ? $(this).parent().hide() : null;
        $('#filterInfo').text(foundContacts.length + ' of ' + addressBook.length + ' entries matched');
      }
    })
    $('#actualContactList tbody tr td :checkbox').prop('checked',false).filter(function() {
      return $(this).parent().parent().prop('style') === 'display: none' ? false : true;
    });
  } else {
    resetSearch();
    $('#actualContactList tbody tr td').not('.checker').each(function(){
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
  addressBook = [];
  addressBookDeleted = [];
  $('#checkAll').prop('checked', false);
  resetSearch();

  addAddress('Cody','Codeworks', '+34 601 465 366', `Carrer d'Àvila, 27, 08005 Barcelona`);
  addAddress('Cliff','Huxtable','+1 555 123456','10 Stigwood Avenue, New York City')
  addAddress('Sirius','Black','+1 555 123489','12 Grimmauld Place, London, UK')
  addAddress('Spongebob','Squarepants','+1 555 123522','124 Conch Street, Bikini Bottom, Pacific Ocean')
  addAddress('Lily','Munster','+1 555 123555','1313 Mockingbird Lane, Mockingbird Heights, USA')
  addAddress('Halliwell','House','+1 555 123588','1329 Carroll Ave, Los Angeles, California')
  addAddress('Buffy','Summers','+1 555 123621','1630 Revello Drive, Sunnydale, CA')
  addAddress('Doc','Brown','+1 555 123654','1640 Riverside Drive, Hill Valley, California')
  addAddress('Sherlock','Holmes','+1 555 123687','221B Baker Street, London, UK')
  addAddress('Fox','Mulder','+1 555 123720','2630 Hegal Place, Apt. 42, Alexandria, Virginia, 23242')
  addAddress('Peter','Griffin','+1 555 123753','31 Spooner Street, Quahog, Rhode Island')
  addAddress('Dana','Scully','+1 555 123786','3170 W. 53 Rd. #35, Annapolis, Maryland')
  addAddress('Raymond','Barone','+1 555 123819','320 Fowler Street, Lynbrook, New York')
  addAddress('Clark','Kent','+1 555 123852','344 Clinton St., Apt. 3B, Metropolis, USA')
  addAddress('Dudley','Dursley','+1 555 123885','4 Privet Drive, Little Whinging, Surrey, UK')
  addAddress('Tim','Taylor','+1 555 123918','510 Glenview, Detroit, Michigan')
  addAddress('Jon','Arbuckle','+1 555 123951','711 Maple Street, USA')
  addAddress('Roseanne','Conners','+1 555 123984','714 Delaware, Lanford IL')
  addAddress('Al','Bundy','+1 555 124017','9764 Jeopardy Lane, Chicago, Illinois')
  addAddress('Jerry','Seinfeld','+1 555 124050','Apartment 5A, 129 West 81st Street, New York, New York')
  addAddress('Tyler','Durden','+1 555 124083','537 Paper Street, Bradford 19808 ')
  addAddress('Homer','Simpson','+1 555 124116','742 Evergreen Terrace, Springfield')
  addAddress('Kate','Tanner','+1 555 124149','167 Hemdale Street, Los Angeles, California ')
  addAddress('Hercule','Poirot','+1 555 124182','Apt. 56B, Whitehaven Mansions, Sandhurst Square, London W1')

  addAddress('Cody','Codeworks', '+34 601 465 366', `Carrer d'Àvila, 27, 08005 Barcelona`);
  addAddress('Claire','Huxtable','+1 555 123456','10 Stigwood Avenue, New York City')
  addAddress('Sirius','Black','+1 555 123489','12 Grimmauld Place, London, UK')
  addAddress('Garry','Squarepants','+1 555 123522','124 Conch Street, Bikini Bottom, Pacific Ocean')
  addAddress('Lily','Munster','+1 555 123555','1313 Mockingbird Lane, Mockingbird Heights, USA')
  addAddress('Halliwell','House','+1 555 123588','1329 Carroll Ave, Los Angeles, California')
  addAddress('Buffy','Summers','+1 555 123621','1630 Revello Drive, Sunnydale, CA')
  addAddress('Doc','Brown','+1 555 123654','1640 Riverside Drive, Hill Valley, California')
  addAddress('Dr.','Watson','+1 555 123687','221B Baker Street, London, UK')
  addAddress('Fox','Mulder','+1 555 123720','2630 Hegal Place, Apt. 42, Alexandria, Virginia, 23242')
  addAddress('Lois','Griffin','+1 555 123753','31 Spooner Street, Quahog, Rhode Island')
  addAddress('Dana','Scully','+1 555 123786','3170 W. 53 Rd. #35, Annapolis, Maryland')
  addAddress('Raymond','Barone','+1 555 123819','320 Fowler Street, Lynbrook, New York')
  addAddress('Lois','Lane','+1 555 123852','344 Clinton St., Apt. 3B, Metropolis, USA')
  addAddress('Harry','Potter','+1 555 123885','4 Privet Drive, Little Whinging, Surrey, UK')
  addAddress('Jill','Taylor','+1 555 123918','510 Glenview, Detroit, Michigan')
  addAddress('Jon','Arbuckle','+1 555 123951','711 Maple Street, USA')
  addAddress('Roseanne','Conners','+1 555 123984','714 Delaware, Lanford IL')
  addAddress('Peggy','Bundy','+1 555 124017','9764 Jeopardy Lane, Chicago, Illinois')
  addAddress('Jerry','Seinfeld','+1 555 124050','Apartment 5A, 129 West 81st Street, New York, New York')
  addAddress('Robert','Paulson','+1 555 124083','537 Paper Street, Bradford 19808 ')
  addAddress('Marge','Simpson','+1 555 124116','742 Evergreen Terrace, Springfield')
  addAddress('Willie','Tanner','+1 555 124149','167 Hemdale Street, Los Angeles, California ')
  addAddress('Hercule','Poirot','+1 555 124182','Apt. 56B, Whitehaven Mansions, Sandhurst Square, London W1')

  showContactList();
  showMessage('Dummy Adresses restored.')
}
