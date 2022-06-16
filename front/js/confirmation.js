// Récupération de l'orderId de la commande via l'URL de la page
const params = new URL(window.location.href).searchParams.get("orderId");
console.log("orderId de la commande reçu :", params);

document.getElementById("orderId").innerHTML = params;
localStorage.clear();
