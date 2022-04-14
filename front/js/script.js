/**
 * Récupération des données de tous les produits dans l'API
 * 
 * Appelée dans la fonction "displayProducts()"
 * 
 * @return { Promise }
 */
async function getProducts() {
    try {
        const resultApi = await fetch("http://localhost:3000/api/products");
        return resultApi.json();
    } catch(error) {
        return false;
    }
}

/**
 * Affichage des produits
 */
async function displayProducts() {
    const resultApi = await getProducts();
    if(!resultApi) {
        alert("Désolés nous rencontrons des soucis techniques...");
    } else {
        console.log("Données reçues :", resultApi);   
        for(let i in resultApi) {
            // Création de l'élément "a"
            const newEltLink = document.createElement("a");
            document.getElementById("items").appendChild(newEltLink);
            newEltLink.href="product.html?id=" + resultApi[i]._id;

            // Création de l'élément "article"
            const newEltArticle = document.createElement("article");
            newEltLink.appendChild(newEltArticle);

            // Création de l'élément "img"
            const newEltImg = document.createElement("img");
            newEltArticle.appendChild(newEltImg);
            newEltImg.src = resultApi[i].imageUrl;
            newEltImg.alt = resultApi[i].altTxt;

            // Création de l'élément "h3"
            const newEltName = document.createElement("h3");
            newEltArticle.appendChild(newEltName);
            newEltName.classList.add("productName");
            newEltName.innerHTML = resultApi[i].name;
            
            // Création de l'élément "p"
            const newEltDescription = document.createElement("p");
            newEltArticle.appendChild(newEltDescription);
            newEltDescription.classList.add("productDescription");
            newEltDescription.innerHTML = resultApi[i].description;
        }
    }
}

window.addEventListener("load", () => {
    displayProducts();
});