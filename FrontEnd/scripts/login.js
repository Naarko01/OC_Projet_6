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
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: reqBody
    }).then((async (response) => {
        const data = await response.json();
        window.localStorage.setItem("loginToken", data.token);
    }))

});

