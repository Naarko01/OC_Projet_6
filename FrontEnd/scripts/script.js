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
    //si login
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

logLink.addEventListener("click", () => {
    if (isLoggedIn) {
        window.localStorage.removeItem("loginToken");
        window.location.href = "index.html";
    } else {
        window.location.href = "login.html"
    }
});

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


















