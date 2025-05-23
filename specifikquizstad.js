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
    const type = document.querySelector('.elemchoice.selected[data-question="type"]')?.dataset.value;
    const word = document.querySelector('.elemchoice.selected[data-question="mood"]')?.dataset.value;

    const descriptions = {
      "Färjestaden": "Färjestaden bjuder på lugn småstadskänsla nära havet – perfekt för dig som vill koppla av med lite stadsliv på Öland.",
      "Borgholm": "Historiska Borgholm passar dig som älskar kultur – slott, museum och charmiga gränder väntar.",
      "Byxelkrok": "Äventyr väntar i Byxelkrok med kustnära läge, naturupplevelser och vackra solnedgångar.",
      "Mörbylånga": "Mörbylånga är ett exklusivt val med naturskön miljö och fina boenden, perfekt för dig som söker det lilla extra.",
      "Högby": "Lugna Högby på norra Öland är ett paradis för den som söker rofyllda naturupplevelser.",
      "Degerhamn": "Degerhamn bjuder på kulturarv i ett stillsamt format – ett riktigt smultronställe.",
      "Torsås": "I Torsås kan du ge dig ut på äventyr i naturen – paddla, vandra och upptäck nya vyer.",
      "Köpingsvik": "Köpingsvik har ett exklusivt strandläge och är ett perfekt val för dig som vill njuta av bekvämligheter och havsutsikt.",
      "Vetlanda": "Vetlanda är en trivsam småstad där du kan koppla av men ändå ha tillgång till bekvämligheter och service.",
      "Eksjö": "Eksjö är en av Sveriges bäst bevarade trästäder – ett måste för dig som uppskattar historia och arkitektur.",
      "Västervik": "Västervik erbjuder ett havsnära äventyr med klippor, skärgård och upplevelser både på land och till sjöss.",
      "Växjö": "Lyxiga Växjö kombinerar stadens puls med natur och hållbar livsstil – här finns det mesta.",
      "Lönashult": "I naturnära Lönashult får du tystnad, skogar och sjöar – ett perfekt val för återhämtning.",
      "Mariannelund": "Mariannelund bjuder på Astrid Lindgren-magi och kulturhistoria i småländsk idyll.",
      "Hillerstorp": "I Hillerstorp väntar äventyr i naturen – perfekt för dig som gillar att vara aktiv.",
      "Älmhult": "Älmhult är ett lyxigt val för den designintresserade – hemstad till IKEA och vackra miljöer."
    }; //motivation till resultaten
  
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
  
    document.querySelector(".result").innerHTML =   "<strong><h3>Du borde åka till " + result + "!</h3></strong><br>" + 
    (descriptions[result] || "");

    // Skapa eller uppdatera knappen
const showBtnContainer = document.querySelector("#showBtnContainer");
showBtnContainer.innerHTML = ""; // töm innehållet varje gång

const btn = document.createElement("button");
btn.textContent = "Visa campingar i " + result;
btn.classList.add("campingbtn");

console.log("resultat:", result)
btn.addEventListener("click", function () {
  window.location.href = "filter.html?city=" + encodeURIComponent(result);
}); ///????????????SKICKAR MED STADEN TILL FILTER:HMTL

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
