const quantityOfProduct = document.getElementById("quantity");
const productColor = document.getElementById("colors");

// Récupération de l'id du produit via l'URL de la page
const params = new URL(window.location.href).searchParams.get("id");
console.log("ID du produit :", params);

/**
 * Récupération des données du produit dans l'API en lien avec son id récupérer au préalable
 *
 * Appelée dans la fonction "displayProduct()"
 *
 * @return { Promise }
 */
async function getProduct() {
  try {
    const resultApi = await fetch("http://localhost:3000/api/products/" + params);
    return resultApi.json();
  } catch (error) {
    return false;
  }
}

/**
 * Affichage du produit
 */
async function displayProduct() {
  const resultApi = await getProduct();
  if (!resultApi) {
    alert("Désolé nous rencontrons des soucis techniques...");
  } else {
    console.log("Données du produit reçu :", resultApi);
    // Création de l'élément "img"
    const newEltImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(newEltImg);
    newEltImg.src = resultApi.imageUrl;
    newEltImg.alt = resultApi.altTxt;

    // Ajout du nom
    document.getElementById("title").innerHTML = resultApi.name;

    // Ajout du prix
    document.getElementById("price").innerHTML =
      new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(resultApi.price) + " ";

    // Ajout de la description
    document.getElementById("description").innerHTML = resultApi.description;

    // Ajout des couleurs
    for (let i in resultApi.colors) {
      let colorOption = document.createElement("option");
      document.getElementById("colors").appendChild(colorOption);
      colorOption.innerHTML = resultApi.colors[i];
    }
  }
}

/**
 * Ajout d'un produit au panier
 */
function addToCart() {
  // Si une quantité n'a pas été choisi ou bien + de 100 et qu'une couleur n'a pas été choisi
  if ((quantityOfProduct.value == 0 || quantityOfProduct.value > 100) && productColor.value == 0) {
    alert("Veuillez choisir une couleur et une quantité comrpise entre 1 et 100.");
    // Sinon si une quantité n'a pas été choisi ou bien + de 100
  } else if (quantityOfProduct.value == 0 || quantityOfProduct.value > 100) {
    alert("Veuillez choisir une quantité comrpise entre 1 et 100.");
    // Sinon si une couleur n'a pas été choisi
  } else if (productColor.value == 0) {
    alert("Veuillez choisir une couleur.");
  } else {
    let userData = [];
    // S'il y a des données stockées dans le Local Storage "cartData"
    if (localStorage.getItem("cartData") !== null) {
      // Ajout de ces données dans le tableau crée au préalable
      userData = JSON.parse(localStorage.getItem("cartData"));
    }
    const addTheProduct = {
      id: params,
      color: productColor.value,
      quantity: quantityOfProduct.valueAsNumber,
    };
    console.log("Requête reçu :", addTheProduct);

    // Si le produit est déjà présent dans le tableau crée au préalable
    if (userData.find((product) => product._id === addTheProduct._id && product.color === addTheProduct.color)) {
      // Récupération du produit déjà présent dans le tableau via son id et sa couleur
      const productAdded = userData.filter((el) => el._id === addTheProduct._id && el.color === addTheProduct.color);
      // Récupération de l'index du produit dans le tableau
      const productPosition = userData.indexOf(productAdded[0]);
      if (productAdded[0].quantity + addTheProduct.quantity > 100) {
        alert("Vous ne pouvez pas avoir plus de 100 fois le même article dans le panier !");
      } else {
        productAdded[0].quantity += addTheProduct.quantity;
        // Modification du produit dans le tableau
        userData[productPosition] = productAdded[0];
        // Ajout du tableau final dans le Local Storage
        localStorage.setItem("cartData", JSON.stringify(userData));
        alert("Produit ajouté au panier !");
      }
    } else {
      // Sinon ajout des données de la requête dans le tableau
      userData.push(addTheProduct);
      // Ajout du tableau final dans le Local Storage
      localStorage.setItem("cartData", JSON.stringify(userData));
      alert("Produit ajouté au panier !");
    }
  }
}

window.addEventListener("load", () => {
  displayProduct();
  document.getElementById("addToCart").addEventListener("click", addToCart);
});
