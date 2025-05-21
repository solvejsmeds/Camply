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


  const showBtn = document.querySelector("#showcampingsforcity");
  if (showBtn) {
    showBtn.addEventListener("click", function () {
      const cityName = document.querySelector(".result").innerText.trim();
      if (cityName) {
        window.location.href = "filter.html?city=" + encodeURIComponent(cityName);
      }
    });
  }

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
    const type = document.querySelector('.elemchoice.selected[data-question="type"]')?.dataset.value;
    const word = document.querySelector('.elemchoice.selected[data-question="mood"]')?.dataset.value;
  
    if (!province || !type || !word) {
      document.querySelector(".result").innerText = "Du måste svara på alla frågor!";
      return;
    }
  
    let result = "";
  
    if (province === "oland") {
      if (type === "city") {
        if (word === "relaxing") result = "Färjestaden";
        else if (word === "cultural") result = "Borgholm";
        else if (word === "adventurous") result = "Byxelkrok";
        else if (word === "luxury") result = "Mörbylånga";
      } else if (type === "nature") {
        if (word === "relaxing") result = "Högby";
        else if (word === "cultural") result = "Degerhamn";
        else if (word === "adventurous") result = "Torsås";
        else if (word === "luxury") result = "Köpingsvik";
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
  
    document.querySelector(".result").innerText = result;

  

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
  
    // Inaktivera knappen igen
    submitBtn.disabled = true;
  }
