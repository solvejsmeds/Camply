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



  

    document.querySelector("#closeModal").addEventListener("click", function () {
      document.querySelector("#activityModal").close();
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
  const place = document.querySelector('.elemchoice.selected[data-question="place"]')?.dataset.value;
  const company = document.querySelector('.elemchoice.selected[data-question="company"]')?.dataset.value;
  const category = document.querySelector('.elemchoice.selected[data-question="category"]')?.dataset.value;

  if (!place || !company || !category) {
    document.querySelector(".result").innerText = "Du måste svara på alla frågor!";
    return;
  }

  let activity = "";
  let description = "";

  // NY if-struktur UTAN 'nature'-kategori
  if (place === "outside") {
    if (company === "smallkids") {
      if (category === "fun") {
        activity = "Lekplats";
        description = "Perfekt plats för de små att leka, springa och ha kul.";
      } else if (category === "adventure") {
        activity = "Lådbilslandet";
        description = "Barnen kör runt i små bilar på en miniatyrväg – superkul!";
      } else {
        activity = "Djurpark";
        description = "En lugn dag med roliga djurmöten i friska luften.";
      }
    } else if (company === "kids") {
      if (category === "fun") {
        activity = "High Chaparral";
        description = "Vilda västern-liknande nöjespark – perfekt för barn i skolåldern!";
      } else if (category === "adventure") {
        activity = "Zipline";
        description = "Fart och höjd bland träden – en riktig adrenalinkick!";
      } else {
        activity = "Minigolf";
        description = "Avkopplande, men ändå klurigt och socialt för barn.";
      }
    } else if (company === "friendgoup") {
      if (category === "fun") {
        activity = "Skateboardpark";
        description = "Häng, tricks och tempo tillsammans med kompisarna.";
      } else if (category === "adventure") {
        activity = "Paintball";
        description = "Teamwork och tävling i en spännande miljö.";
      } else {
        activity = "Golf";
        description = "Chill och social aktivitet för vuxna – med tävlingsnerv.";
      }
    } else if (company === "alone") {
      if (category === "fun") {
        activity = "Pumptrack eller skatepark";
        description = "Motion och nöje i eget tempo – ute!";
      } else if (category === "adventure") {
        activity = "Naturklättring";
        description = "Prova bouldering eller klättring på klippa – utmanande och stärkande.";
      } else {
        activity = "Promenad eller parkhäng";
        description = "Enkla, avkopplande stunder för dig själv.";
      }
    }
  } else if (place === "inside") {
    if (company === "smallkids") {
      if (category === "fun") {
        activity = "Lekland";
        description = "Bollhav, studsmattor och rutschkanor – barnens paradis!";
      } else if (category === "adventure") {
        activity = "Barnvänligt äventyrshus";
        description = "Ett miniformat av äventyrscenter anpassat för de små.";
      } else {
        activity = "Simhall";
        description = "Lekbassänger och lugn vattenlek – roligt och tryggt.";
      }
    } else if (company === "kids") {
      if (category === "fun") {
        activity = "Boda Borg";
        description = "Kreativa uppdrag i olika rum – hela familjen engageras!";
      } else if (category === "adventure") {
        activity = "Escape Room Junior";
        description = "Barnvänligt klurigt och spännande!";
      } else {
        activity = "Simhall";
        description = "Avkopplande vattenlek, rutschkanor och bubbelpooler.";
      }
    } else if (company === "friendgoup") {
      if (category === "fun") {
        activity = "The Big Bang eller Game Center";
        description = "Arkader, VR och socialt kaos – kul för alla!";
      } else if (category === "adventure") {
        activity = "Escape Room";
        description = "Pussla och samarbeta för att ta er ut i tid!";
      } else {
        activity = "Bowling";
        description = "Avslappnad och social tävling – alltid en klassiker.";
      }
    } else if (company === "alone") {
      if (category === "fun") {
        activity = "VR-spelhall";
        description = "Testa nya världar helt på egen hand!";
      } else if (category === "adventure") {
        activity = "Klättervägg";
        description = "Fysiskt och fokuserat – perfekt när du vill utmana dig själv.";
      } else {
        activity = "Biograf";
        description = "En filmstund helt för dig själv – bekvämt och njutbart.";
      }
    }
  }

  // Visa resultatet
  document.querySelector(".result").innerHTML = "<h3> Du borde testa: <strong>"+ activity +"</strong>!</h3><p>"+description+"</p>";

  // Visa knapp om du vill
  const showBtnContainer = document.querySelector("#showBtnContainer");
  showBtnContainer.innerHTML = "";

  if (activity) {
    const btn = document.createElement("button");
    btn.textContent = "Läs mer om " + activity;
    btn.classList.add("campingbtn");
    btn.addEventListener("click", function () {
     document.querySelector("#activityModal").showModal(); //visar dialog ruta med mer information om campingen.
    });
    showBtnContainer.appendChild(btn);

  
  }

  document.querySelector("#modalDescription").innerText = description + smapidescription;

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
