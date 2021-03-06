// Format code
// TODO keep styling in your CSS file
// TODO remove unused variables
// TODO remove redundant code
// What if your requests fail?

(function () {
  "use strict";

  let spinner = document.createElement("div");
// TODO Why use string interpolation? What is the difference between "", '', and ``?
  spinner.innerHTML = `<div id="wholePageSpinner" class="loader-wrapper"><div class="loader"></div><p class="loading-msg">loading...</p></div> `;

  let navBar = document.querySelector("div.nav-bar");
  document.body.appendChild(spinner);
  document.querySelector(".whole-page").setAttribute("style", "display:none");
  document
    .querySelector(".loader-wrapper")
    .setAttribute("style", "height:100vh");

  // The following function was added for development purposes.
  function clearStorageShortcut(e) {
    var evtobj = window.event ? event : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
      sessionStorage.clear();
      window.location.reload();
      console.log("Session storage cleared");
    }
  }

  document.onkeydown = clearStorageShortcut;

  function onloadFn() {
    document.body.removeChild(spinner);
    document
      .querySelector(".whole-page")
      .setAttribute("style", "display:block");

    let mainScreen = document.querySelector(".main-screen");
    let data = document.querySelector(".data");
    let mainHeading = document.querySelector(".main-heading");
    let info = document.getElementById("info");
    let mainHeader = document.querySelector(".main-head-top-text");
    let tableBody = document.querySelector(".tbody");

    // NOTE: Selectors should be more specific
    let flexibleField = document.querySelector(".flexible");
    let displayLength = document.querySelector(".length");

    let burgerMenu = document.querySelector(".burger");

    function showSpinner() {
      data.appendChild(spinner);
      document
        .querySelector(".main-head-top-text")
        .setAttribute("style", "display:none");
    }

    // Welcome Screen ----------------

    function welcomeScreen() {
      mainHeader.setAttribute("style", "display:block;");

      document.querySelector(".data").setAttribute("style", "display:none");
      mainHeading.innerText = "Welcome";
      flexibleField.innerHTML = ``;
      displayLength.innerHTML = ``;
    }

    // TODO assign the click to the parent element
    document
      .querySelector(".logo-img")
      .addEventListener("click", welcomeScreen);

    document
      .querySelector(".logo-txt") // TODO DONE
      .addEventListener("click", welcomeScreen);

    // Colours Screen ------------------

    function getColours() {
      showSpinner();
      document
        .querySelector(".table-responsive")
        .setAttribute("style", "displaY:none"); // displaY?
      fetch("https://reqres.in/api/products/")
        .then((res) => res.json())
        .then((res) => {
          document
            .querySelector(".loader-wrapper")
            .setAttribute("style", "display:none");
          document
            .querySelector(".main-screen-content")
            .setAttribute("style", "display:block");
          document
            .querySelector(".main-head-top-text")
            .setAttribute("style", "display:flex");
          document
            .querySelector(".data")
            .setAttribute("style", "height:initial");
          data.style.width = "105%";

          let coloursDataDiv = document.createElement("div");
          coloursDataDiv.className = "colours-data";

          if (data.children.length < 3) {
            data.appendChild(coloursDataDiv);
          }

          let colours = res.data; // TODO DONE

          // Sorted with code from https://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
          colours.sort(function (a, b) {
            var keyA = a.year,
              keyB = b.year;
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });

          // TODO Use sort DONE
          mainHeading.innerText = "Colours";

          let blurbsContainer = document.createElement("div");
          blurbsContainer.className = "blurbs-container";

          flexibleField.innerHTML ='<p>items :</p>';
          displayLength.innerHTML = `<p>${colours.length}</p>`;
          if (data.getElementsByClassName("blurb").length < colours.length) {
            colours.map((color) => {
              // TODO use map DONE
              // map seems to be slightly faster according to https://www.measurethat.net/Benchmarks/Show/2090/0/array-loop-vs-foreach-vs-map#latest_results_block
              // and it also returns a new arr so it can be possibly chained to other methods https://codeburst.io/javascript-map-vs-foreach-f38111822c0f
              let imageDiv = document.createElement("div");
              imageDiv.className = "blurb";
              imageDiv.setAttribute("style", `background-color:${color.color}`);

              imageDiv.innerHTML = `
                          <p class="color-code" style="color:${color.color}" >${color.color}</p>
                          <div class="color-info">
                          <p class="color-year">${color.year}</p>
                          <p class="color-name">${color.name}</p>
                          </div>
                          `;

              coloursDataDiv.appendChild(imageDiv);
            });
          }
        });
    }

    // Deleting a user/row
    // TODO Review the following function
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    function deleteUser(selectedRow, userID, deleteButton) {
      userID = selectedRow.children[1].innerText;

      if (confirm(`Are you sure you want to delete user ${userID} ?`)) {
        //remove from table
        selectedRow.parentNode.removeChild(selectedRow);
        //remove from session storage
        let arrayJson = JSON.parse(window.sessionStorage.getItem("usersData"));
        let newArr = arrayJson.filter(
          (entry) => parseInt(entry.id) != parseInt(userID) // TODO equality strict
        );

        // Update storage
        window.sessionStorage.setItem("usersData", JSON.stringify(newArr));
        deleteButton.setAttribute("disabled", ""); // Tip: we usually set the name of attribute as the value for our code to be more clear and descriptive
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
      }
    }

    function getUsers() {
      showSpinner();
      data.style.width = "100%";

      if (document.querySelector(".colours-data")) {
        data.removeChild(document.querySelector(".colours-data"));
      }

      if (window.sessionStorage.getItem("usersData")) {
        let sessionStorageData = JSON.parse(window.sessionStorage.getItem("usersData"));

        sessionStorageData && hydrateUsers(sessionStorageData);
      } else {
        fetch("https://reqres.in/api/users")
          .then((res) => res.json())
          .then((res) => {
            //res.data.map((user) => (user.id = Math.random())); tried to give users random id values to test the following sorting FN
            res.data.sort(function (a, b) {
              var keyA = a.id,
                keyB = b.id;
              // Compare the 2 dates
              if (keyA < keyB) return -1;
              if (keyA > keyB) return +1;
              return 0;
            });
            // console.log(res.data);
            hydrateUsers(res.data);

            window.sessionStorage.setItem("usersData", JSON.stringify(res.data));
          });
      }
    }
    // Users Screen ----------------
    let sessionStorageData = JSON.parse(window.sessionStorage.getItem("usersData")); // TODO review
    function hydrateUsers(fetchedData) {
      spinner.setAttribute("style", "display:none");
      document
        .querySelector(".table-responsive")
        .setAttribute("style", "display:block");

      data.style.display = "block";

      let blurbs = document.getElementsByClassName("blurb") || "";

      document
        .querySelector(".main-screen-content")
        .setAttribute("style", "display:block");
      mainHeader.setAttribute("style", "display:flex;");

      let displaySpace = document.getElementById("space");
      let displaySpaceWrapper = document.getElementById("display-wrapper");
      let tableStringHTML = "";

      mainHeading.innerText = "User Data";
      displaySpace.innerHTML =
        '<button class="delete-btn" type="button" disabled>Delete</button>';

      let deleteButton = document.querySelector(".delete-btn");

      if (displaySpace.children.length > 1) {
        displaySpace.removeChild(displaySpace.lastChild);
      }

      displayLength.innerHTML = "";

      //  Converting Data to Table

      fetchedData.forEach((user) => {
        tableStringHTML += `<tr>
                  <td class="td user-checkbox "><input type="radio" name="radio-btn" class="delete-checkbox " id="${
                    user.id
                  }" />
                    <label for="radio-btn"></label> </td>
                  <td class="td user-id">${user.id}</td>
                  <td class="td user-last">${user.last_name}</td>
                  <td class="td user-first">${user.first_name}</td>
                  <td class="td user-email">${user.email}</td>
                  <td class="td user-avatar"> ${user.avatar.substring(
                    user.avatar.lastIndexOf("r/") + 2,
                    user.avatar.lastIndexOf("/128")
                  )}</td></tr>
                `;
      });
      document.querySelector(".tbody").innerHTML = tableStringHTML;

      let selectedRow = null;
      let userID = null;
      // TODO review
      deleteButton &&
        deleteButton.addEventListener("click", () => {
          deleteUser(selectedRow, userID, deleteButton);
        });

      document.querySelector(".tbody").addEventListener("change", (e) => {
        deleteButton.removeAttribute("disabled");
        selectedRow = e.target.parentNode.parentNode;
        userID = selectedRow.children[1].innerText;
      });
    }

    function toggleNavbar() {
      navBar.classList.toggle("nav-bar-open");
    }

    burgerMenu && burgerMenu.addEventListener("click", toggleNavbar);

    // Views eventListeners
    document.getElementById("colours").addEventListener("click", () => {
      getColours();
      // The following lines should be in getColours
      document.getElementById("colours").className += " active-link";
      document.getElementById("users").classList.remove("active-link");
    });

    document.getElementById("users").addEventListener("click", getUsers);

    document.getElementById("users").addEventListener("click", () => {
      getUsers();
      document.getElementById("users").className += " active-link";
      document.getElementById("colours").classList.remove("active-link");
    });
  }

  // TODO review
  // i would like to know why the following needs a review
  document.addEventListener("DOMContentLoaded", onloadFn);
  window.removeEventListener("load", onloadFn);

  // window.addEventListener("resize", function () {
  //   if (window.innerWidth < 730) {
  //     navBar.className += " nav-bar-open";
  //   } else {
  //     navBar.classList.remove("nav-bar-open");
  //   }
  // });
})();
