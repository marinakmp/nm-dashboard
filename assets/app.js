window.addEventListener("load", function() {
    let data = document.getElementsByClassName("data")[0];
    let mainHeading = document.getElementsByClassName("main-heading")[0];
    let info = document.getElementById("info");
    let mainHeaderContainer = document.getElementsByClassName(
        "main-header-container"
    )[0];
    let flexibleField = document.getElementsByClassName("flexible")[0];
    let displayLength = document.getElementsByClassName("length")[0];
    let dataTable = document.getElementsByClassName("data-table")[0];
    console.log(dataTable);

    function welcomeScreen() {
        data.innerHTML = "";
        mainHeading.innerText = "Welcome";
        flexibleField.innerHTML = ``;
        displayLength.innerHTML = ``;
    }

    let options = document.getElementById("data-length");

    document
        .getElementsByClassName("logo-txt")[0]
        .addEventListener("click", () => {
            welcomeScreen();
        });

    function getColours() {
        fetch("https://reqres.in/api/products/")
            .then((res) => res.json())
            .then((res) => {
                colours = res.data;
                console.log("Colours length", colours.length);

                colours.reverse();
                console.log("Colours sorted", colours);

                mainHeading.innerText = "Colours";

                let blurbsContainer = document.createElement("div");
                blurbsContainer.className = "blurbs-container";
                data.innerText = "";

                flexibleField.innerHTML = `<p>items :</p>`;
                displayLength.innerHTML = `<p>${colours.length}</p>`;

                colours.forEach((color) => {
                    let imageDiv = document.createElement("div");
                    imageDiv.className = "blurb";
                    imageDiv.setAttribute("style", `background-color:${color.color}`);
                    imageDiv.innerHTML = `
                <h3 class="color-code" style="color:${color.color}" >${color.color}</h3>
                <div class="color-info">
                <p class="color-year">${color.year}</p>
                <p class="color-name">${color.name}</p>
                </div>
                `;
                    data.appendChild(imageDiv);
                });
            });
    }

    document.getElementById("colours").addEventListener("click", () => {
        getColours();
    });

    function getUsers() {
        fetch("https://reqres.in/api/users")
            .then((res) => res.json())
            .then((res) => {
                const usersData = res.data;
                console.log("User Data", usersData);

                data.innerHTML = "";
                mainHeading.innerText = "User Data";
                flexibleField.innerHTML = `<button disabled class="delete-btn">Delete</button>`;
                displayLength.innerHTML = ``;
                //Converting Data to Table

                dataTable.classList.remove("not-visible");
                data.appendChild(dataTable);
                usersData.forEach((user) => {
                    let tr = document.createElement("tr");
                    console.log(tr);

                    tr.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${user.id}</td>
                    <td>${user.last_name}</td>
                    <td>${user.first_name}</td>
                    <td>${user.email}</td>
                    <td>${user.avatar}</td>
                    `;
                    dataTable.appendChild(tr);
                });
            });
        dataTable.innerHTML = "";
    }
    document.getElementById("users").addEventListener("click", () => {
        getUsers();
    });
});