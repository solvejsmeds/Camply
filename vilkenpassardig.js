//javascript för att hantera resultaten från stadtestet.
let submitBtn; //knapp för att visa resulatt



function init() {
  console.log("init funktion")
  submitBtn = document.querySelector("#submitBtn");
  submitBtn.disabled = true;

  const choices = document.querySelectorAll(".elemchoice");

  for (let i = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", function () {

      console.log("val klcikat")

      const question = this.getAttribute("data-question");

      // Avmarkera alla val inom samma fråga
      for (let j = 0; j < choices.length; j++) {
        if (choices[j].getAttribute("data-question") === question) {
          choices[j].classList.remove("selected");
        }
      }

      // Markera den valda
      this.classList.add("selected");

      // Aktivera knappen om alla frågor är besvarade
      checkIfAllAnswered();
    });
  }

  submitBtn.addEventListener("click", findResult);
  document.querySelector("#redoBtn").addEventListener("click", resetTest);


 

   document.querySelector("#hamburger").addEventListener("click", function () {
    document.querySelector("#nav-links").classList.toggle("show");
    });


}

window.addEventListener("load", init);
//Slut init
//--------------------------------------------------------------------------



//kontrollerar att användaren svarat på alla frågor
function checkIfAllAnswered() {
    const allQuestions = document.querySelectorAll(".choice-container");
    let allAnswered = true;
  
    for (let i = 0; i < allQuestions.length; i++) {
      if (!allQuestions[i].querySelector(".selected")) {
        allAnswered = false;
        break;
      }
    }
  
    submitBtn.disabled = !allAnswered;
  }
//slut checkIfAllAnswered
//--------------------------------------------------------------------------------------


//funktion för att ge rätt resultat baserat på valen
function findResult() {
  const province = document.querySelector('.elemchoice.selected[data-question="province"]')?.dataset.value;
    const position = document.querySelector('.elemchoice.selected[data-question="position"]')?.dataset.value;
    const price = document.querySelector('.elemchoice.selected[data-question="price"]')?.dataset.value;
   


  
    if (!position || !price || !province) {
      document.querySelector(".result").innerText = "Du måste svara på alla frågor!";
      return;
    }
  
    let result = "";
  
    if (province === "oland") {
      if (position === "distand") {
        if (price === "250") result = "Färjestaden";
        else if (price === "500") result = "Borgholm";
        else if (price === "adventurous") result = "Byxelkrok";
        else if (price === "luxury") result = "Mörbylånga";
      } else if (position === "nature") {
        if (price === "relaxing") result = "Högby";
        else if (price === "cultural") result = "Degerhamn";
        else if (price === "adventurous") result = "Torsås";
        else if (price === "luxury") result = "Köpingsvik";
      }
    } else if (province === "smaland") {
      if (type === "city") {
        if (word === "relaxing") result = "Vetlanda";
        else if (word === "cultural") result = "Eksjö";
        else if (word === "adventurous") result = "Västervik";
        else if (word === "luxury") result = "Växjö";
      } else if (type === "nature") {
        if (word === "relaxing") result = "Lönashult";
        else if (word === "cultural") result = "Mariannelund";
        else if (word === "adventurous") result = "Hillerstorp";
        else if (word === "luxury") result = "Älmhult";
      }
    }
  
    document.querySelector(".result").innerHTML =   "<strong><h3>Du borde åka till " + result + "!</h3></strong><br>" + 
    (descriptions[result] || "");

    // Skapa eller uppdatera knappen
const showBtnContainer = document.querySelector("#showBtnContainer");
showBtnContainer.innerHTML = ""; // töm innehållet varje gång

const btn = document.createElement("button");
btn.textContent = "Visa campingar i " + result;
btn.classList.add("campingbtn"); // valfritt: din egen klass för styling
btn.addEventListener("click", function () {
  window.location.href = "filter.html?city=" + encodeURIComponent(result);
});

showBtnContainer.appendChild(btn);



  

  }
//slut findResult
//------------------------------------------------------------------------------------




function resetTest() {
    // Ta bort alla 'selected'-klasser
    const choices = document.querySelectorAll(".elemchoice");
    for (let i = 0; i < choices.length; i++) {
      choices[i].classList.remove("selected");
    }
  
    // Töm resultat
    document.querySelector(".result").innerText = "";

    document.querySelector("#showBtnContainer").innerHTML = "";
  
    // Inaktivera knappen igen
    submitBtn.disabled = true;
  }
