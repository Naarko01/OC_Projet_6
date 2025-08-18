const httpAdresse = "http://localhost:5678";
//récupération de works depuis l'API
const works = await fetch(`${httpAdresse}/api/works`).then(res => res.json());
//récupération des categories depuis l'API
const categories = await fetch(`${httpAdresse}/api/categories`).then(res => res.json());

//génération du contenu de la gallery avec la data de l'API
function generateGallery(works) {
    //récupération de l'élément parent du DOM et nettoyage en cas d'actualisation
    const galleryDiv = document.querySelector(".gallery");
    galleryDiv.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        //récupération de chaque objet dans la liste donnée en argument
        const work = works[i];
        //création de l'élément qui contiendra les balises
        const workElement = document.createElement("figure");
        //création des balises
        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;

        //assemblage des balises
        galleryDiv.appendChild(workElement);
        workElement.appendChild(imgElement);
        workElement.appendChild(titleElement);
    }
}

generateGallery(works);

const logLink = document.querySelector(".loginLink");
const portfolioTitle = document.querySelector("#portfolio h2");
// variable pour tracker le statut login, initialisée à false
let isLoggedIn = false;
const loginToken = window.sessionStorage.getItem("loginToken");

if (loginToken !== null) {
    isLoggedIn = true;
    portfolioTitle.style.marginBottom = "92px";
    logLink.innerText = "logout"
    applyHeaderBanner();
    createModifyBtn();
}
else {
    createFilterBtn();
    applyFilter();
}

//event listener pour login/logout
logLink.addEventListener("click", () => {
    if (isLoggedIn) {
        window.sessionStorage.removeItem("loginToken");
        window.location.href = "index.html";
    } else {
        window.location.href = "login.html"
    }
});

//bouton d'ouverture du popup (présent uniquement si login)
if (isLoggedIn) {
    const modifyBtn = document.querySelector(".modifyBtn");
    modifyBtn.addEventListener("click", () => {
        openPopup();
    });
}

//création des bouton filtres
function createFilterBtn() {
    //récupération div parent
    const categoriesDiv = document.querySelector(".categories");
    for (let i = 0; i <= categories.length; i++) {
        const filterBtn = document.createElement("button");
        filterBtn.classList.add("filter-btn");
        if (i === 0) {
            filterBtn.innerText = "Tous";
            filterBtn.id = "filterAll"
            filterBtn.classList.add("btn-selected")
        }
        else {
            filterBtn.innerText = categories[i - 1].name;
            filterBtn.id = `filter${categories[i - 1].id}`;
        }
        categoriesDiv.appendChild(filterBtn);
    }
}

//ajout des event listener et de leur logique sur les bouton de filtre
function applyFilter() {
    const filterBtnArray = document.querySelectorAll(".filter-btn");
    for (let i = 0; i < filterBtnArray.length; i++) {
        filterBtnArray[i].addEventListener("click", () => {
            if (i === 0) {
                document.querySelector(".gallery").innerHTML = "";
                generateGallery(works);
                console.log(works);
            }
            else {
                const filteredWorks = works.filter(function (work) {
                    return work.categoryId === categories[i - 1].id;
                });
                document.querySelector(".gallery").innerHTML = "";
                generateGallery(filteredWorks);
                console.log(filteredWorks);
            }
            filterBtnArray.forEach(button => {
                button.classList.remove("btn-selected");
            });
            filterBtnArray[i].classList.add("btn-selected");
        });
    }
}

//bouton "modifier" pour ajouter ou supprimer des travaux de la gallery
function createModifyBtn() {
    const modifyBtn = document.createElement("div");
    modifyBtn.className = "modifyBtn";
    modifyBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i><p>modifier</p>';
    portfolioTitle.appendChild(modifyBtn);
}

//banière noir en en-tête indiquant le mode édition
function applyHeaderBanner() {
    const header = document.querySelector("header");
    const headerH1 = document.querySelector("header h1");
    const banner = document.createElement("div");
    banner.className = "banner";
    banner.innerHTML = '<i class="fa-solid fa-pen-to-square"></i><p>Mode édition</p>';
    header.insertBefore(banner, headerH1);
    header.style.marginTop = "97px";
}

//initialisation des variables utilisées pour la gestion de la modale
let workImgList;
let popupBtn;
let closeBtn;
let popupTitle;
let imgListContainer;
let addImgForm;
let previousBtn;
const popupElement = document.querySelector(".popupBackground");

//création de la structure du popup
function createPopup() {
    const popupStruct = `
    <div class="popup">
        <i class="closeBtn fa-solid fa-xmark"></i>
        <h2>Galerie photo</h2>
        <div class="imgListContainer">
            <div class="popupImgList">
            </div>
        </div>
        <form id="addImgForm">
        <i class="previousBtn fa-solid fa-arrow-left"></i>
	    <div class="fileUploadContainer">
	    	<img id="previewImg" src="./assets/icons/picture-svgrepo-com1.png" alt="">
	    	<label for="fileUpload">+ Ajouter photo</label>
	    	<input type="file" id="fileUpload" name="image" accept=".jpg, .png">
	    	<p>jpg, png : 4mo max</p>
	    </div>
	    <label for="uploadTitle">Titre</label>
	    <input type="text" name="title" id="uploadTitle" required>
	    <label for="categorieSelect">Catégorie</label>
	    <select name="category" id="categorieSelect" form="addImgForm" required>
            <option value="" selected></option>
        </select>
        </form>
        <button id="popupBtn">Ajouter une photo</button>
    </div>`;
    popupElement.innerHTML = popupStruct;
    popupElement.classList.add("active");

    createFormSelect();
    addInputFilePreview();

    imgListContainer = document.querySelector(".imgListContainer");
    addImgForm = document.getElementById("addImgForm");
    popupTitle = document.querySelector(".popup h2");
    closeBtn = document.querySelector(".closeBtn");
    previousBtn = document.querySelector(".previousBtn");
    popupBtn = document.getElementById("popupBtn");
    workImgList = document.querySelector(".popupImgList");
}

//création des options de l'inpu select du formulaire
function createFormSelect() {
    const categorieSelect = document.getElementById("categorieSelect");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorieSelect.appendChild(option);
    });
}

//ajout de la prévisualisation de l'image sélectionnée pour l'upload 
function addInputFilePreview() {
    const fileInput = document.getElementById("fileUpload");
    const previewImg = document.getElementById("previewImg");
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewImg.src = "./assets/icons/picture-svgrepo-com1.png";
        }
    });
}

//création de la liste d'image de la première page du popup
function createWorkList(parentElement, works) {
    for (let i = 0; i < works.length; i++) {
        const workArticle = document.createElement("article");
        workArticle.classList.add("workImg");
        let workImg = `
        <div class="deleteBtn" data-id="${works[i].id}">
            <i class="fa-solid fa-trash-can"></i>
		</div>
		<img src="${works[i].imageUrl}" alt="${works[i].title}">`;
        workArticle.innerHTML = workImg;
        parentElement.appendChild(workArticle);
    }

    const deleteBtnList = document.querySelectorAll(".deleteBtn");
    deleteBtnList.forEach(btn => {
        btn.addEventListener("click", () => {
            const workId = btn.getAttribute("data-id");
            deleteWork(workId);
        });
    });
}

async function deleteWork(workId) {
    const response = await fetch(`${httpAdresse}/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    if (response.ok) {
        const updatedWorks = await fetch(`${httpAdresse}/api/works`).then(res => res.json());
        workImgList.innerHTML = "";
        createWorkList(workImgList, updatedWorks);
        generateGallery(updatedWorks);
    }
    else {
        alert("Erreur lors de la suppression");
    }
}

//affichage popup + listener pour la fermeture
function openPopup() {
    createPopup();
    createWorkList(workImgList, works);

    popupElement.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    });
    closeBtn.addEventListener("click", closePopup);
    previousBtn.addEventListener("click", previousPopup);
    popupBtn.addEventListener("click", nextPopup);
    addImgForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });

}

//update du titre et du bouton de validation lors du changement de popup
function updatePopup() {
    if (addImgForm.classList.contains("active")) {
        popupTitle.innerText = "Ajout photo";
        popupBtn.innerText = "Valider";
        popupBtn.removeEventListener("click", nextPopup);
        popupBtn.addEventListener("click", handleUploadForm);
    }
    else {
        popupTitle.innerText = "Galerie photo";
        popupBtn.innerText = "Ajouter une photo";
        popupBtn.addEventListener("click", handleUploadForm);
        popupBtn.addEventListener("click", nextPopup);
    }
}

async function handleUploadForm() {
    const response = await fetch(`${httpAdresse}/api/works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        body: new FormData(addImgForm)
    });
    switch (response.status) {
        case 201:
            const titleInput = document.getElementById("uploadTitle");
            titleInput.textContent = "";
            document.getElementById("categorieSelect").value = "";
            document.getElementById("fileUpload").value = "";
            break;
        case 401:

            break;
        default:

            break;
    }
}

//modifications pour passage du premier au second popup
function nextPopup() {
    imgListContainer.setAttribute("hidden", "true");
    addImgForm.classList.add("active");
    updatePopup();
}

function previousPopup() {
    imgListContainer.removeAttribute("hidden");
    addImgForm.classList.remove("active");
    updatePopup();
}

function closePopup() {
    popupElement.classList.remove("active");
    popupElement.removeEventListener("click", closePopup);
    closeBtn.removeEventListener("click", closePopup);
    popupElement.innerHTML = "";
}


























