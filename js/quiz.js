function init() {
    console.log("hej");
    goToPage();
}
window.addEventListener("load", init);

function goToPage() {
    const cityElement = document.querySelector("#goToStad");
    const campingElement = document.querySelector("#goToCampingQuiz");
    const attractionElement = document.querySelector("#goToAttraction");
    const activityElement = document.querySelector("#goToActivity");
    const barbequeElement = document.querySelector("#goToBarbeque");

    if (cityElement) {
        cityElement.addEventListener("click", function () {
            window.location.href = "specifikquizstad.html";
        });
    }

    if (campingElement) {
        campingElement.addEventListener("click", function () {
            window.location.href = "vilkenpassardig.html";
        });
    }

    if (attractionElement) {
        attractionElement.addEventListener("click", function () {
            window.location.href = "sevärdighet.html";
        });
    }

    if (activityElement) {
        activityElement.addEventListener("click", function () {
            window.location.href = "aktiviteter.html";
        });
    }

    if (barbequeElement) {
        barbequeElement.addEventListener("click", function () {
            window.location.href = "grilla.html";
        });
    }

    document.querySelector("#hamburger").addEventListener("click", function () {
        document.querySelector("#nav-links").classList.toggle("show");
    });



}