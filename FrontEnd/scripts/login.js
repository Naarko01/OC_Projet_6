const httpAdresse = "http://localhost:5678";
const mailInput = document.getElementById("loginMail");
const passwordInput = document.getElementById("loginPassword");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const userInput = {
        email: mailInput.value,
        password: passwordInput.value
    }
    const reqBody = JSON.stringify(userInput)
    loginRequest(reqBody);
});

function loginRequest(reqBody) {
    fetch(`${httpAdresse}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: reqBody
    }).then((async (response) => {
        console.log(response);
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message);
            error.status = response.status;
            throw error;
        }
        const data = await response.json();
        window.sessionStorage.setItem("loginToken", data.token);
        window.location.href = "index.html";
    })).catch(error => errorHandling(error.status));
}

function errorHandling(error) {
    const errorMessage = document.createElement("p");
    const errorDisplay = document.getElementById("errorDisplay");
    errorDisplay.innerHTML = "";
    switch (error) {
        case 401:
            errorMessage.innerText = "Mot de passe incorrect";
            passwordInput.classList.remove("inputError");
            passwordInput.classList.add("inputError");
            break;
        case 404:
            errorMessage.innerText = "Adresse mail inconnue";
            mailInput.classList.remove("inputError");
            mailInput.classList.add("inputError");
            break;
        default:
            errorMessage.innerText = "Échec de la connexion";
            mailInput.classList.remove("inputError");
            mailInput.classList.add("inputError");
            passwordInput.classList.remove("inputError");
            passwordInput.classList.add("inputError");
            break;
    }
    errorDisplay.appendChild(errorMessage);

    passwordInput.addEventListener("change", () => {
        passwordInput.classList.remove("inputError");
        errorDisplay.innerHTML = "";
    });
    mailInput.addEventListener("change", () => {
        mailInput.classList.remove("inputError");
        errorDisplay.innerHTML = "";
    })
}
