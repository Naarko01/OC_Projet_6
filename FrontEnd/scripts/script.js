//tentative de récupération depuis le local storage
let works = window.localStorage.getItem("works");
if (works === null) {
    //si pas de data dans le local storage, récupération depuis l'api et création dans le local storage
    const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();
    const worksValue = JSON.stringify(works);
    window.localStorage.setItem("works", worksValue);
}
else {
    //si disponible dans le local storage, récupération en JSON
    works = JSON.parse(works);
}

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

//const categoryArray = Array.from(new Set(works.map(work => work.category.name)));
//map des categories à partir du tableau works
const categoriesMap = works.map(work => work.category);
//création d'un nouveau tableau ne contenant que les catégories uniques
//pour chaques élément de categoryMap, 
//si il n'existe pas déjà dans categoryArray, il y est ajouté
const categoriesArray = [];
categoriesMap.forEach(category => {
    if (!categoriesArray.find(categoryCopy => categoryCopy.id === category.id)) {
        categoriesArray.push(category);
    }
});

function createFilterBtn() {
    //récupération div parent
    const categoriesDiv = document.querySelector(".categories");
    for (let i = 0; i <= categoriesArray.length; i++) {
        const filterBtn = document.createElement("button");
        filterBtn.classList.add("filter-btn");
        if (i === 0) {
            filterBtn.innerText = "Tous";
            filterBtn.id = "filterAll"
            filterBtn.classList.add("btn-selected")
        }
        else {
            filterBtn.innerText = categoriesArray[i - 1].name;
            filterBtn.id = `filter${categoriesArray[i - 1].id}`;
        }
        categoriesDiv.appendChild(filterBtn);
    }
}

createFilterBtn();

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
                    return work.categoryId === categoriesArray[i - 1].id;
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

applyFilter();














