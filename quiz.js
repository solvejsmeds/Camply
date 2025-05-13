function init(){
    console.log ("hej") 
    goToPage();
}


function goToPage(){
    const element = document.getElementById("gotoStad");

element.addEventListener("click", function() {
window.location.href = "specifikquizstad.html";
    });
    element.appendChild(element)
}