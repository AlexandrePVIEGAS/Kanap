const characterRegex = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
const addressRegex = /^$|^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Z]+)+/;
const emailRegex = /^$|^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
const form = document.querySelector(".cart__order__form");
let totalQuantity = 0;
let totalPrice = 0;

/**
 * Création de balise <div> ou de balise <p>
 * 
 * @param { String } elType
 * @param { HTMLElement } parent
 * @param { String } classes[]
 * @param { String } innerHTML
 * @return { HTMLElement }
 */
 function createNewEl(elType, parent, classes = [], innerHTML = "") {
    const el = document.createElement(elType);
    parent.appendChild(el);
    classes.forEach(thisClass => {
        el.classList.add(thisClass);
    });
    if(innerHTML.length > 0) {
        el.innerHTML = innerHTML;
    }
    return el;
}

// Récupération des données du Local Storage
let cartData = JSON.parse(localStorage.getItem("cartData"));

/**
 * Récupréation des données des produits dans l'API qui sont en lien avec le contenu du panier
 * 
 * Appelé dans la fonction "displayCart()"
 * 
 * @param { i } idx
 * @return { Promise }
 */
async function getProducts(idx) {
    try {
        const resultApi = await fetch("http://localhost:3000/api/products/" + cartData[idx].id);
        return resultApi.json();
    } catch(error) {
        return false;
    }
}

/**
 * Affichage des élements du panier
 */
async function displayCart() {
    if(!cartData) {
        alert("Panier vide !");
    } else {
        for(let i in cartData) {
            const resultApi = await getProducts(i);
            if(!resultApi) {
                alert("Désolé nous rencontrons des soucis techniques...");
            } else {
                console.log("Données de l'API reçu :", resultApi);
                // Création de l'élément "article"
                const newEltArticle = document.createElement("article");
                document.getElementById("cart__items").appendChild(newEltArticle);
                newEltArticle.classList.add("cart__item");
                newEltArticle.setAttribute("data-id", cartData[i].id);
                newEltArticle.setAttribute("data-color", cartData[i].color);

                // Création de l'élément "div"
                const newEltDivImg = createNewEl("div", newEltArticle, ["cart__item__img"]);

                // Création de l'élément "img"
                const newEltImg = document.createElement("img");
                newEltDivImg.appendChild(newEltImg);
                newEltImg.src = resultApi.imageUrl;
                newEltImg.alt = resultApi.altTxt;

                // Création de l'élément "div"
                const newEltDivContent = createNewEl("div", newEltArticle, ["cart__item__content"]);

                // Création de l'élément "div"
                const newEltDivDescription = createNewEl("div", newEltDivContent, ["cart__item__content__description"]);

                // Création de l'élément "h2" qui affiche le nom du produit
                const newEltName = document.createElement("h2");
                newEltDivDescription.appendChild(newEltName);
                newEltName.innerHTML = resultApi.name;

                // Création de l'élément "p" qui affiche la couleur
                const newEltColor = createNewEl("p", newEltDivDescription, [], cartData[i].color);

                // Création de l'élément "p" qui affiche le prix
                const newEltPrice = createNewEl("p", newEltDivDescription, [], 
                    new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                    }).format(resultApi.price *= cartData[i].quantity)
                );
                
                // Création de l'élément "div"
                const newEltDivSettings = createNewEl("div", newEltDivContent, ["cart__item__content__settings"]);

                // Création de l'élément "div"
                const newEltDivQuantity = createNewEl("div", newEltDivSettings, ["cart__item__content__settings__quantity"]);

                // Création de l'élément "p"
                const newEltQuantity = createNewEl("p", newEltDivQuantity, [], "Qté : ");

                // Création de l'élément "input" pour modifier la quantité d'un produit
                const newEltInput = document.createElement("input");
                newEltDivQuantity.appendChild(newEltInput);
                newEltInput.setAttribute("type", "number");
                newEltInput.classList.add("itemQuantity");
                newEltInput.setAttribute("name", "itemQuantity");
                newEltInput.setAttribute("min", "1");
                newEltInput.setAttribute("max", "100");
                newEltInput.value = cartData[i].quantity;

                // Modification de la quantité d'un produit
                newEltInput.addEventListener("change", (e) => {
                    e.preventDefault();
                    // Si une quantité de 0 a été choisi ou bien + de 100
                    if(newEltInput.valueAsNumber == 0 || newEltInput.valueAsNumber > 100) {
                        alert("Minimum 1 article / Maximum 100 articles");
                    } else {
                        cartData[i].quantity = newEltInput.valueAsNumber;
                    }
                    localStorage.setItem("cartData", JSON.stringify(cartData));
                    location.reload();
                })

                // Création de l'élément "div"
                const newEltDivRemoveButton = createNewEl("div", newEltDivSettings, ["cart__item__content__settings__delete"]);

                // Création de l'élément "p" pour le bouton supprimer
                const newEltRemoveButton = createNewEl("p", newEltDivRemoveButton, ["deleteItem"], "Supprimer");

                // Suppression d'un produit
                newEltRemoveButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Récupération du produit à supprimer via son id et sa couleur
                    const productToRemove = cartData[i].id && cartData[i].color;
                    // Retrait du produit via son id et sa couleur
                    cartData = cartData.filter(el => el.id && el.color !== productToRemove);
                    localStorage.setItem("cartData", JSON.stringify(cartData));
                    if(cartData == 0) {
                        localStorage.clear();
                    }
                    location.reload();
                })

                document.getElementById("totalQuantity").innerHTML = totalQuantity += cartData[i].quantity;
                document.getElementById("totalPrice").innerHTML = new Intl.NumberFormat("fr-FR", {
                    maximumFractionDigits: 2, minimumFractionDigits: 2
                }).format(totalPrice += resultApi.price);
            }
        }
    }    
}

/**
 * Apparition d'un message d'erreur si l'information demandée est mal renseignée sinon suppression de celui-ci si ensuite il a bien été rempli
 * 
 * Appelé dans la fonction "checkQuestion()"
 * 
 * @param { Boolean } isValid
 * @param { String } input
 */
const errorMsg = (isValid, input) => {
    const inputs = {
        firstName: "Le prénom",
        lastName: "Le nom",
        address: "L'adresse",
        city: "La ville",
        email: "L'email"
    };
    for(let key in inputs) {
        const val = inputs[key];
        if(input === key) {
            if(!isValid) {
                document.getElementById(key + "ErrorMsg").innerHTML = val + " n'est pas valide !";
            }
            else {
                document.getElementById(key + "ErrorMsg").innerHTML = "";
            }
        }
    }
}

/**
 * Vérification de la bonne saisie de l'information demandé
 * 
 * Appelé dans la fonction "ListenQuestion()"
 * 
 * @param { RegExp } regex 
 * @param { HTMLElement } inputValue 
 * @param { String } input 
 * @return { Boolean }
 */
const checkQuestion = (regex, inputValue, input) => {
    let isValid = true;
    if(!regex.test(inputValue) || inputValue.length > 0 && inputValue.length < 3) {
        isValid = false;
    }
    errorMsg(isValid, input);
    return isValid;
}

/**
 * EventListener pour la fonction "checkQuestion()"
 */
const listenQuestion = () => {
    formArr = [
        {input: "firstName", cb: () => checkQuestion(characterRegex, form.firstName.value, "firstName")},
        {input: "lastName", cb: () => checkQuestion(characterRegex, form.lastName.value, "lastName")},
        {input: "address", cb: () => checkQuestion(addressRegex, form.address.value, "address")},
        {input: "city", cb: () => checkQuestion(characterRegex, form.city.value, "city")},
        {input: "email", cb: () => checkQuestion(emailRegex, form.email.value, "email")}
    ];
    formArr.forEach(formObj => {
        form[formObj.input].addEventListener("change", () => {
            formObj.cb();
        })
    });
}

/**
 * Vérification de la bonne saisie de toutes les informations demandées
 * 
 * Appelée dans la fonction "colectData()"
 * 
 * @return { Boolean }
 */
function checkAll() {
    const inputs = ["firstName", "lastName", "address", "city", "email"];
    let isValid = true;
    for(let i in inputs) {
        const input = inputs[i];
        // Tous les champs ne sont pas vides et les messages d'erreur ne sont pas présents
        isValid = form[input].value != "" && document.getElementById(input + "ErrorMsg").innerHTML == "";
        if(!isValid) {
            return isValid;
        }
    }
    return isValid;
}

/**
 * Envoi des données au Back
 * 
 * Appelée dans la fonction "coletctData()"
 * 
 * @param { Object } requestBody 
 * @return { Promise }
 */
async function sendToBack(requestBody) {
    try {
        const postBack = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        return postBack.json().then(data => {
            window.location.href = "confirmation.html?orderId=" + data.orderId;
        });
    } catch(error) {
        return false
    }
}

/**
 * Collecte des données à envoyer + envoie au Back avec la fonction "sendToBack()"
 */
async function colectData() {
    if(!cartData) {
        alert("Veuillez ajouter des produits au panier pour passer commande !");
    } else if(!checkAll()) {
        alert("Veuillez bien remplir tous les champs demandés !");
    } else {
        const contact = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value
        }
        let products = [];
        for(let i in cartData) {
            products.push(cartData[i].id);
        }
        const requestBody = {
            contact,
            products
        }
        await sendToBack(requestBody);
    }
}

window.addEventListener("load", () => {
    displayCart();
    listenQuestion();
    document.getElementById("order").addEventListener("click", colectData);
});