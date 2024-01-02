// ^ HTML Elements
var siteNameInput = document.getElementById("siteName");
var siteUrlInput = document.getElementById("siteUrl");
var searchInput = document.getElementById("search");
var submitButton = document.getElementById("submit");
var deleteTableButton = document.getElementById("deleteTable");
var tableBody = document.getElementById("tableBody");
var cloneSiteNameInput = siteNameInput.cloneNode();
var cloneSiteUrlInput = siteUrlInput.cloneNode();
var feedbackNameInput = document.getElementById("feedbackNameInput");
var feedbackUrlInput = document.getElementById("feedbackUrlInput");
var cloneFeedbackNameInput = feedbackNameInput.cloneNode();
var cloneFeedbackUrlInput = feedbackUrlInput.cloneNode();
var btnBookUpdateOk = document.querySelectorAll("#btnBookUpdateOk");
var btnBookUpdate = document.querySelectorAll("#btnBookUpdate");
var bookList = getData() || [];

// ^ Functions
function getData() {
  return JSON.parse(localStorage.getItem("data"));
}

function setData() {
  return localStorage.setItem("data", JSON.stringify(bookList));
}

function createRow(book, index, searchTerm) {
  return `
            <tr>
                <td>${index + 1}</td>
                <td id="tdBookName">
                
                ${
                  searchTerm
                    ? book.name.replace(
                        searchTerm.toLowerCase() || searchTerm.toUpperCase(),
                        `<span class="fw-bold text-danger">${
                          searchTerm.toLowerCase() || searchTerm.toUpperCase()
                        }</span>`
                      )
                    : book.name
                }
                
                </td>
                <td id="tdBookUrl">
                  <a 
                    class="btn btn-outline-dark" 
                    href="${book.url}"
                    target="_blank"
                    title="${book.url}">
                    Visit
                  </a>
                </td>
                <td >
                  <button id="btnBookUpdate"
                    class="btn btn-warning"
                    onclick="setDataToForm(${index})">
                    Update
                  </button>
                  <button id="btnBookUpdateOk" class="d-none btn btn-success" type="button" onclick="updateOk(${index})">OK</button>
                </td>
                <td >
                  <button id="btnBookDelete"
                    class="btn btn-danger"
                    deletedBook="${book.name}"
                    onclick="deleteBook(this,${index})">
                    Delete
                  </button>
                  <button id="btnBookUpdateCancel" class="d-none btn btn-danger" type="button" onclick="updateCancel()">CANCEL</button>
                </td>
              </tr>
            `;
}

function setDataToForm(index) {
  // ^ Disable all button & inputs
  document.querySelectorAll("button").forEach((e) => (e.disabled = true));
  document.querySelectorAll("input").forEach((e) => (e.disabled = true));
  document.querySelectorAll("a").forEach((e) => e.classList.add("disabled"));

  // ! UPDATE | OK BUTTON
  //#region OK
  btnBookUpdateOk = document.querySelectorAll("#btnBookUpdateOk");

  btnBookUpdateOk[index].disabled = false;
  btnBookUpdateOk.forEach((element) => element.classList.add("d-none"));
  btnBookUpdateOk[index].classList.remove("d-none");

  btnBookUpdate = document.querySelectorAll("#btnBookUpdate");
  btnBookUpdate.forEach((element) => element.classList.remove("d-none"));
  btnBookUpdate[index].classList.add("d-none");

  //#endregion

  // ! UPDATE | CANCEL BUTTON
  //#region CANCEL
  var tdBookUpdateCancel = document.querySelectorAll("#btnBookUpdateCancel");
  var btnBookDelete = document.querySelectorAll("#btnBookDelete");
  tdBookUpdateCancel[index].disabled = false;
  tdBookUpdateCancel.forEach((element) => element.classList.add("d-none"));
  tdBookUpdateCancel[index].classList.remove("d-none");

  btnBookDelete.forEach((element) => element.classList.remove("d-none"));
  btnBookDelete[index].classList.add("d-none");
  //#endregion

  // ! CLONE | NAME INPUT
  //#region NAME
  var tdBookName = document.querySelectorAll("#tdBookName");
  cloneSiteNameInput.disabled = false;
  cloneSiteNameInput.value = bookList[index].name;
  tdBookName[index].innerHTML = "";
  tdBookName[index].appendChild(cloneSiteNameInput);
  tdBookName[index].appendChild(cloneFeedbackNameInput);
  //#endregion

  // ! CLONE | URL INPUT
  //#region URL
  var tdBookUrl = document.querySelectorAll("#tdBookUrl");
  cloneSiteUrlInput.disabled = false;
  cloneSiteUrlInput.value = bookList[index].url;
  tdBookUrl[index].innerHTML = "";
  tdBookUrl[index].appendChild(cloneSiteUrlInput);
  tdBookUrl[index].appendChild(cloneFeedbackUrlInput);
  //#endregion
}

function updateOk(index) {
  if (
    validatedName(cloneSiteNameInput, cloneFeedbackNameInput) &&
    validatedUrl(cloneSiteUrlInput, cloneFeedbackUrlInput)
  ) {
    bookList[index].name = cloneSiteNameInput.value;
    bookList[index].url = cloneSiteUrlInput.value;
    setData();
    updateCancel();
    resetInputs();
    // ! reset name feedback
    feedbackTagName.innerHTML = "";
    inputTagName.classList.remove("is-valid");
    inputTagName.classList.remove("is-invalid");

    feedbackTagName.classList.remove("valid-feedback");
    feedbackTagName.classList.remove("invalid-feedback");

    // ! reset url feedback
    feedbackTagUrl.innerHTML = "";
    inputTagUrl.classList.remove("is-valid");
    inputTagUrl.classList.remove("is-invalid");

    feedbackTagUrl.classList.remove("valid-feedback");
    feedbackTagUrl.classList.remove("invalid-feedback");
  }
}

function updateCancel() {
  // ^ Disable all button & inputs
  document.querySelectorAll("button").forEach((e) => (e.disabled = false));
  document.querySelectorAll("input").forEach((e) => (e.disabled = false));
  document.querySelectorAll("a").forEach((e) => e.classList.remove("disabled"));
  displayDataRows();
}

function displayDataRows() {
  var htmlContent = "";
  for (var i = 0; i < bookList.length; i++) {
    htmlContent += createRow(bookList[i], i);
  }
  tableBody.innerHTML = htmlContent;
}

function resetInputs() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
  cloneSiteNameInput.value = "";
  cloneSiteUrlInput.value = "";
}

function addBook() {
  var book = {
    name: siteNameInput.value,
    url: siteUrlInput.value,
  };

  bookList.push(book);
  tableBody.innerHTML += createRow(book, bookList.length - 1);
  setData();
  resetInputs();
  deleteTableButton.disabled = false;
}

function deleteBook(deletedbook, index) {
  bookList.splice(index, 1);
  displayDataRows();
  setData();

  // deletedbook.parentNode.parentNode.remove();
  // var bookName = deletedbook.getAttribute("deletedBook");
  // for (var i = 0; i < bookList.length; i++) {
  // if (bookList[i].name == bookName) {
  // bookList.splice(i, 1);
  // deletedbook.parentNode.parentNode.remove();
  // setData();
  // break;
  // }
  // }
}

function deleteTable() {
  bookList = [];
  setData(bookList);
  location.reload();
}

function searchFunction() {
  var term = searchInput.value;

  var htmlContent = "";
  var FoundFlag = 0;
  for (var i = 0; i < bookList.length; i++) {
    if (bookList[i].name.toLowerCase().includes(term.toLowerCase())) {
      htmlContent += createRow(bookList[i], i, term);
      FoundFlag = 1;
    }
  }
  if (!FoundFlag && searchInput.value !== "")
    htmlContent = `
  <td colspan="5" class="py-2 text-danger fw-bold "><img class="img-fluid"
                                        src="free-icon-no-results-6195678.png" alt=""></td>
  `;
  tableBody.innerHTML = htmlContent;
}

function validatedName(inputTag, feedbackTag) {
  var bookNameRegex = /^[a-zA-Z0-9\s.,!?()'-]+$/;

  if (bookNameRegex.test(inputTag.value)) {
    feedbackTag.innerHTML = "Looks good!";
    inputTag.classList.replace("is-invalid", "is-valid");
    feedbackTag.classList.add("valid-feedback");
    feedbackTag.classList.replace("invalid-feedback", "valid-feedback");
    return true;
  } else {
    feedbackTag.innerHTML =
      "letters (uppercase and lowercase), numbers, spaces, and common punctuation characters such as .,!?()'-";
    inputTag.classList.add("is-invalid");
    feedbackTag.classList.add("invalid-feedback");
    inputTag.classList.replace("is-valid", "is-invalid");
    feedbackTag.classList.replace("valid-feedback", "invalid-feedback");
  }
}

function validatedUrl(inputTag, feedbackTag) {
  var urlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;
  if (urlRegex.test(inputTag.value)) {
    feedbackTag.innerHTML = "Looks good!";
    inputTag.classList.replace("is-invalid", "is-valid");
    feedbackTag.classList.add("valid-feedback");
    feedbackTag.classList.replace("invalid-feedback", "valid-feedback");
    return true;
  } else {
    feedbackTag.innerHTML =
      "Please enter a valid URL. It should start with 'http://' or 'https://' (optional), may include 'www.' (optional), followed by a domain name, and can have an optional path with valid characters such as '-', '_', '~', '/', '?', '#', '@', '!', '$', '&', ''', '(', ')', '*', '+', ',', ';', and '='.";
    inputTag.classList.add("is-invalid");
    feedbackTag.classList.add("invalid-feedback");
    inputTag.classList.replace("is-valid", "is-invalid");
    feedbackTag.classList.replace("valid-feedback", "invalid-feedback");
  }
}

function dataValidation(
  inputTagName,
  feedbackTagName,
  inputTagUrl,
  feedbackTagUrl
) {
  console.log(validatedName(inputTagName, feedbackTagName));
  console.log(validatedUrl(inputTagUrl, feedbackTagUrl));
  if (
    validatedName(inputTagName, feedbackTagName) &&
    validatedUrl(inputTagUrl, feedbackTagUrl)
  ) {
    addBook();

    // ! reset name feedback
    feedbackTagName.innerHTML = "";
    inputTagName.classList.remove("is-valid");
    inputTagName.classList.remove("is-invalid");

    feedbackTagName.classList.remove("valid-feedback");
    feedbackTagName.classList.remove("invalid-feedback");

    // ! reset url feedback
    feedbackTagUrl.innerHTML = "";
    inputTagUrl.classList.remove("is-valid");
    inputTagUrl.classList.remove("is-invalid");

    feedbackTagUrl.classList.remove("valid-feedback");
    feedbackTagUrl.classList.remove("invalid-feedback");
  }
}
// ^ initialization routine
displayDataRows();
bookList.length
  ? (deleteTableButton.disabled = false)
  : (deleteTableButton.disabled = true);

// ^ Events

// ! form
siteNameInput.addEventListener("input", function () {
  searchInput.value = "";
  searchFunction();
  validatedName(siteNameInput, feedbackNameInput);
});
siteUrlInput.addEventListener("input", function () {
  searchInput.value = "";
  searchFunction();
  validatedUrl(siteUrlInput, feedbackUrlInput);
});

// ! clone
cloneSiteNameInput.addEventListener("input", function () {
  validatedName(cloneSiteNameInput, cloneFeedbackNameInput);
});
cloneSiteUrlInput.addEventListener("input", function () {
  validatedUrl(cloneSiteUrlInput, cloneFeedbackUrlInput);
});

submitButton.addEventListener("click", function () {
  searchInput.value = "";
  searchFunction();
  dataValidation(
    siteNameInput,
    feedbackNameInput,
    siteUrlInput,
    feedbackUrlInput
  );
});

submitButton.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // event.preventDefault(); // Prevents the default form submission
    document.getElementsByTagName("form")[0].submit; // Manually submit the form
  }
});

btnBookUpdateOk.forEach((element) =>
  element.addEventListener("click", function () {})
);

deleteTableButton.addEventListener("click", deleteTable);
searchInput.addEventListener("input", searchFunction);
