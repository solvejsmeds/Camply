//javascript för att hantera resultaten från stadtestet.
let submitBtn; //knapp för att visa resulatt


let result = "";
let id = null;
let description = "";
const APIkey = "R7PGDNjZ"; // API-nyckel till SMAPI

function init() {
 
  submitBtn = document.querySelector("#submitBtn");
  submitBtn.disabled = true;

  const choices = document.querySelectorAll(".elemchoice");

  for (let i = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", function () {

      

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
//gör om test




  document.querySelector("#closeModal").addEventListener("click", function () {
    document.querySelector("#activityModal").close();
  });
 //stänk modalen

}

window.addEventListener("load", init);
//Slut init
//--------------------------------------------------------------------------



//kontrollerar att användaren svarat på alla frågor
function checkIfAllAnswered() {
  const allQuestions = document.querySelectorAll(".choice-container");
  let allAnswered = true; //flagga för att hålla koll o´på om alla svar är ifyllda

  for (let i = 0; i < allQuestions.length; i++) {
    if (!allQuestions[i].querySelector(".selected")) {
      allAnswered = false;
      break; //om alla inte är svarade avbryt
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
  //hämtar värdena

  if (!place || !company || !category) {
    document.querySelector(".result").innerText = "Du måste svara på alla frågor!";
    return;
  }

  let activity = "";
  let description = "";

  if (place === "outside") {
    if (company === "smallkids") {
      if (category === "fun") {
        activity = "Geometriparken!";
        id = 836;
      } else if (category === "adventure") {
        activity = "Lådbilslandet!";
        id = 47;
      } else {
        activity = "Djurparken Traryds Skans!";
        id = 11;
      }
    } else if (company === "kids") {
      if (category === "fun") {
        activity = "High Chaparral!";
        id = 2;
      } else if (category === "adventure") {
        activity = "Little Rock Lake Zipline!";
        id = 40;
      } else {
        activity = "Leklandet Visingsö!";
        id = 98;
      }
    } else if (company === "friendgoup") {
      if (category === "fun") {
        activity = "Skateboardpark";
        id = 114;
      } else if (category === "adventure") {
        activity = "Glabo Gokart och Paintball!";
        id = 36;
      } else {
        activity = "Gränna Golfklubb";
        id = 62;
      }
    } else if (company === "alone") {
      if (category === "fun") {
        activity = "Hovs aktivitetspark!";
        id = 837;
      } else if (category === "adventure") {
        activity = "Glasrikets Golfklubb!";
        id = 61;
      } else {
        activity = "Åkerbobadet i Löttorp!";
        id = 29;
      }
    }
  } else if (place === "inside") {
    if (company === "smallkids") {
      if (category === "fun") {
        activity = "Leo's Lekland!";
        id = 93;
      } else if (category === "adventure") {
        activity = "Area äventyrsbad!";
        id = 16;
      } else {
        activity = "Kalmar Gamecenter!";
        id = 46;
      }
    } else if (company === "kids") {
      if (category === "fun") {
        activity = "Boda Borg";
        id = 41;
      } else if (category === "adventure") {
        activity = "Escape Room!";
        id = 42;
      } else {
        activity = "Medley Vattenpalatset Kaskad";
        id = 12;
      }
    } else if (company === "friendgoup") {
      if (category === "fun") {
        activity = "The Big Bang";
        id = 44;
      } else if (category === "adventure") {
        activity = "Äventyrsbadet i Kalmar!";
        id = 27;
      } else {
        activity = "Knock 'em Down bowlinghall";
        id = 99;
      }
    } else if (company === "alone") {
      if (category === "fun") {
        activity = "Nöjeshuset!";
        id = 43;
      } else if (category === "adventure") {
        activity = "Västerviks Klättercenter";
        id = 113;
      } else {
        activity = "Filmstaden i Växjö!";
        id = 851;
      }
    }
  }

  document.querySelector(".result").innerHTML = "<h3> Du borde testa: <strong>" + activity + "</strong>!</h3><p>" + description + "</p>";

  const showBtnContainer = document.querySelector("#showBtnContainer");
  showBtnContainer.innerHTML = "";

  if (activity) {
    const btn = document.createElement("button");
    btn.textContent = "Läs mer om " + activity;
    btn.classList.add("campingbtn");

    btn.addEventListener("click", async function () {
      try {
        const url = "https://smapi.lnu.se/api/?api_key=" + APIkey + "&controller=establishment&method=getall&ids=" + id;
        const response = await fetch(url);
        const data = await response.json();

        if (data.payload && data.payload.length > 0) {
          const info = data.payload[0];

          document.querySelector("#modalTitle").innerText = activity;

          let html = "";

          if (info.text) {
            html += "<p>" + info.text + "</p>";
          }
          else {
            html += "<p>" + info.abstract + "</p>";
          }



          html += "<p><strong>Adress:</strong> " + info.address + "</p>";


          html += "<p><strong>Stad:</strong> " + info.city + "</p>";


          html += "<p><strong>Pris:</strong> " + info.price_range + " kr</p>";


          html += "<p><a href='" + info.website + "' target='_blank'>Besök webbplats</a></p>";


          document.querySelector("#modalDescription").innerHTML = html;
        } else {
          document.querySelector("#modalTitle").innerText = "Fel";
          document.querySelector("#modalDescription").innerText = "Kunde inte hämta information om aktiviteten.";
        }

        document.querySelector("#activityModal").showModal();

      } catch (error) {
        console.error("Fel vid hämtning av aktivitet:", error);
        document.querySelector("#modalTitle").innerText = "Fel";
        document.querySelector("#modalDescription").innerText = "Något gick fel. Försök igen senare.";
        document.querySelector("#activityModal").showModal();
      }
    });

    showBtnContainer.appendChild(btn);
    document.querySelector(".result").scrollIntoView({ behavior: "smooth" });
  }
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
