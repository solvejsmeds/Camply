//startsida, navigering till wuiz och filtersida

function init() {
    
    goToPage();
}
window.addEventListener("load", init);

function goToPage() {
    const filterElement = document.querySelector("#goToFilterPage");

    const quizElement = document.querySelector("#goToQuizPage");



    if (filterElement) {
        filterElement.addEventListener("click", function () {
            window.location.href = "filter.html";
        });
    }

    if (quizElement) {
        quizElement.addEventListener("click", function () {
            window.location.href = "quiz.html";
        });
    }



}