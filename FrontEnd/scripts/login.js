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
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: reqBody
    }).then((async (response) => {
        console.log(response);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message) || "Erreur inconnu lors de la connexion";
        }
        const data = await response.json();
        window.localStorage.setItem("loginToken", data.token);
        window.location.href = "index.html";
    })).catch(error => errorHandling(error.message));
}

function errorHandling(error) {
    const errorMessage = document.createElement("p");
    const errorDisplay = document.getElementById("errorDisplay");
    errorMessage.innerText = error;
    errorDisplay.innerHTML = "";
    errorDisplay.appendChild(errorMessage);
    mailInput.classList.remove("inputError");
    mailInput.classList.add("inputError");

}
