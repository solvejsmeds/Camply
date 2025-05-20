//javascript för att hantera resultaten från grilllningstestet.
let submitBtn //knapp för att visa resulatt



function init () { //init
  submitBtn = document.querySelector("#submitBtn");
  submitBtn.disabled = true;

  const choices = document.querySelectorAll(".elemchoice");

  for (let i = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", function () {
      // Ta bort 'selected' från syskon i samma fråga
      const parent = choices[i].parentElement;
      const siblings = parent.querySelectorAll(".elemchoice");
      for (let j = 0; j < siblings.length; j++) {
        siblings[j].classList.remove("selected");
      }

      // Lägg till 'selected' på den valda
      choices[i].classList.add("selected");

      // Aktivera knappen om alla tre frågor är besvarade
      checkIfAllAnswered();
    });
  }

  submitBtn.addEventListener("click", findResult);
  document.querySelector("#redoBtn").addEventListener("click", resetTest);
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
function findResult () {

    const containers = document.querySelectorAll(".choice-container");

    const type = containers[0].querySelector(".selected")?.id;
    const style = containers[1].querySelector(".selected")?.id;
    const time = containers[2].querySelector(".selected")?.id;
  
    let result = "";
  
    if (!type || !style || !time) {
      document.querySelector(".result").innerText = "Du måste svara på alla frågor!";
      return;
    }
  

    if (type === "vegetarian") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla halloumiburgare med grönsaker!";
        } else if (time === "middle") {
          result = "Grilla fyllda portabellosvampar!";
        } else if (time === "long") {
          result = "Grilla hela auberginer med långlagad tomatsås!";
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Testa grillad tofu med asiatisk glaze!";
        } else if (time === "middle") {
          result = "Grilla veganska spett med mango och chili!";
        } else if (time === "long") {
          result = "Helgrillad blomkål med tahinisås!";
        }
      }
    }
    
    else if (type === "meat") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla hamburgare!";
        } else if (time === "middle") {
          result = "Grilla entrecôte med vitlökssmör!";
        } else if (time === "long") {
          result = "Grilla pulled pork i flera timmar!";
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Grilla koreanska bulgogispett!";
        } else if (time === "middle") {
          result = "Prova lammfärsbiffar med mynta!";
        } else if (time === "long") {
          result = "Slowcookad brisket på grillen!";
        }
      }
    }
    
    else if (type === "fish") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla laxfilé med citron!";
        } else if (time === "middle") {
          result = "Grilla fiskspett med paprika och lök!";
        } else if (time === "long") {
          result = "Helgrilla en hel fisk med örter och citron!";
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Grilla tonfisk med sesam och soja!";
        } else if (time === "middle") {
          result = "Fisk-tacos med mango och koriander!";
        } else if (time === "long") {
          result = "Grilla bläckfisk eller experimentera med ceviche på grillen!";
        }
      }
    }
    
    else if (type === "chicken") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla kycklingfilé med BBQ-sås!";
        } else if (time === "middle") {
          result = "Grilla kycklingspett med paprika och lök!";
        } else if (time === "long") {
          result = "Grilla en hel kyckling med glaze under lock!";
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Testa jerk-kyckling med lime och chili!";
        } else if (time === "middle") {
          result = "Grilla kycklinglår med honung och senap!";
        } else if (time === "long") {
          result = "Helgrillad marinerad kyckling med exotiska kryddor!";
        }
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
