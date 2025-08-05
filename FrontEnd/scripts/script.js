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
