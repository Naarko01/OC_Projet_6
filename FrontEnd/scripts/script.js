//récupération de works depuis l'API
const works = await fetch("http://localhost:5678/api/works").then(works => works.json());
//récupération des categories depuis l'API
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json());

//génération du contenu de la gallery avec la data de l'API
function generateGallery(works) {
    for (let i = 0; i < works.length; i++) {
        //récupération de chaque objet dans la liste donnée en argument
        const work = works[i];
        //récupération de l'élément parent du DOM
        const galleryDiv = document.querySelector(".gallery");
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

if (window.localStorage.getItem("loginToken") !== null) {
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
        window.localStorage.removeItem("loginToken");
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

//initialisation des variables utilisées pour la gestion de la modale
let workImgList;
let popupBtn;
let closeBtn;
let popupTitle;
const popupElement = document.querySelector(".popupBackground");

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
        <button id="popupBtn">Ajouter une photo</button>
    </div>`;
    popupElement.innerHTML = popupStruct;
    popupElement.classList.add("active");
}

//création et affichage de la structure de la seconde page du popup 
function createPopupUploadPage() {
    let popup = document.querySelector(".popup");
    const addImgForm = document.createElement("form");
    workImgList = document.querySelector(".imgListContainer");
    let formStruct = `
	<div class="fileUploadContainer">
		<img src="./assets/icons/picture-svgrepo-com1.png" alt="">
		<label for="fileUpload">+ Ajouter photo</label>
		<input type="file" id="fileUpload" name="fileUpload" accept=".jpg, .png">
		<p>jpg, png : 4mo max</p>
	</div>
	<label for="uploadTitle">Titre</label>
	<input type="text" name="uploadTitle" id="uploadTitle">
	<label for="categorieSelect">Catégorie</label>
	<select name="categories" id="categorieSelect" form="addImgForm"></select>`;
    popupTitle = document.querySelector(".popup h2");
    popupTitle.innerText = "Ajout photo";
    popupBtn.innerText = "Valider";
    addImgForm.setAttribute("id", "addImgForm");
    addImgForm.innerHTML = formStruct;
    popup.removeChild(workImgList);
    popup.insertBefore(addImgForm, popupBtn);
    popupBtn.removeEventListener("click", createPopupUploadPage);
}

//création de la liste d'image de la première page du popup
function createWorkList(parentElement, works) {
    for (let i = 0; i < works.length; i++) {
        const workArticle = document.createElement("article");
        workArticle.classList.add("workImg");
        let workImg = `
        <div class="deleteBtn">
            <i class="fa-solid fa-trash-can"></i>
		</div>
		<img src="${works[i].imageUrl}" alt="${works[i].title}">`;
        workArticle.innerHTML = workImg;
        parentElement.appendChild(workArticle);
    }
}

//affichage popup + listener pour la fermeture
function openPopup() {
    createPopup();
    workImgList = document.querySelector(".popupImgList");
    createWorkList(workImgList, works);

    popupElement.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    });

    closeBtn = document.querySelector(".closeBtn");
    closeBtn.addEventListener("click", () => {
        closePopup();
    });

    popupBtn = document.getElementById("popupBtn");
    popupBtn.addEventListener("click", createPopupUploadPage);
}

function closePopup() {
    popupElement.classList.remove("active");
    popupElement.removeEventListener("click", closePopup);
    closeBtn.removeEventListener("click", closePopup);
    popupElement.innerHTML = "";
}
























