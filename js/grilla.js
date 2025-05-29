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
  
  document.querySelector("#hamburger").addEventListener("click", function () {
    document.querySelector("#nav-links").classList.toggle("show");
  });

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
          recipy = "https://www.ica.se/recept/vego-halloumiburgare-720380/"
        } else if (time === "middle") {
          result = "Grilla fyllda portabellosvampar!";
          recipy = "https://www.ica.se/recept/fylld-grillad-portabello-med-ortfarskost-729858/"
        } else if (time === "long") {
          result = "Grilla quinoabrugare med cheddar och sperskålsslaw"
          recipy = "https://www.ica.se/recept/grillad-quinoaburgare-med-cheddar-och-spetskalsslaw-725172/"
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Testa grillad kronärtskocka med salsa verde!";
          recipy = "https://www.ica.se/recept/grillade-kronartskockshjartan-med-salsa-verde-740454/"
        } else if (time === "middle") {
          result = "Grilla yakitori på svamp!";
          recipy = "https://www.ica.se/recept/yakitori-pa-svamp-740475/"
        } else if (time === "long") {
          result = "Grilla kålrot med ingefärspuré och krassemarinad!";
          recipy = "https://www.ica.se/recept/grillad-kalrot-med-ingefarspure-och-krassemarinad-1513/"
        }
      }
    }
    
    else if (type === "meat") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla hamburgare!";
          recipy = "https://www.ica.se/recept/klassiska-hamburgare-av-notfars-720381/"
        } else if (time === "middle") {
          result = "Grilla ryggbiff med bbq glaze!";
          recipy = "https://www.ica.se/recept/grillad-ryggbiff-med-kinesisk-bbq-glaze-723675/"
        } else if (time === "long") {
          result = "Grilla bbq T-bone med majskolv!";
          recipy = "https://www.ica.se/recept/bbq-t-bone-med-majskolv-718782/"
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Grilla melon med burrata och lufttorkad skinka!";
          recipy = "https://www.ica.se/recept/grillad-melon-med-burrata-och-lufttorkad-skinka-729128/"
        } else if (time === "middle") {
          result = "Salviagrillade kotlettracks med bacon och granatäpplerelish!";
          recipy = "https://www.ica.se/recept/salviagrillade-kotlettracks-med-bacon-och-granatapplerelish-720727/"
        } else if (time === "long") {
          result = "Texas grillribs med grillad sallad och bacon!";
          recipy = "https://www.ica.se/recept/texas-grillribs-med-grillad-sallad-och-bacon-718774/"
        }
      }
    }
    
    else if (type === "fish") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla torsk med linser, soltorkade tomater och basilika!";
          recipy = "https://www.ica.se/recept/torsk-i-folie-med-linser-soltorkade-tomater-och-basilika-724136/"
        } else if (time === "middle") {
          result = "Grilla lax och räkburgare!";
          recipy = "https://www.ica.se/recept/lax-och-rakburgare-720065/"
        } else if (time === "long") {
          result = "Grilla lax med gurkyoghurt!";
          recipy = "https://www.ica.se/recept/grillad-lax-med-gurkyoghurt-729690/"
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Grilla kokoslax med melonsalsa!";
          recipy = "https://www.ica.se/recept/kokoslax-med-melonsalsa-720647/"
        } else if (time === "middle") {
          result = "Vit tonfisk med tapanedepotatissallad!";
          recipy = "https://www.ica.se/recept/vit-tonfisk-med-tapenadepotatissallad-718864/"
        } else if (time === "long") {
          result = "Dill och rosepeppargravad gör med bakad purjolök och mandeldressing!";
          recipy = "https://www.ica.se/recept/dill-och-rosepeppargravad-gos-med-bakad-purjolok-och-mandeldressing-718800/"
        }
      }
    }

    
    
    else if (type === "chicken") {
      if (style === "classic") {
        if (time === "short") {
          result = "Grilla enkel kycklingburgare med yoghurt!";
          recipy = "https://www.ica.se/recept/enkel-kycklingburgare-med-yoghurt-723436/"
        } else if (time === "middle") {
          result = "Grillspett med kyckling!";
          recipy = "https://www.ica.se/recept/grillspett-med-kyckling-720550/"
        } else if (time === "long") {
          result = "Grilla Stephanies prisbelönta kyckling!";
          recipy = "https://www.ica.se/recept/stephanies-prisbelonta-kyckling-50324/"
        }
      } else if (style === "new") {
        if (time === "short") {
          result = "Kryddiga kycklingfärsspett med ajvaryoghurt!";
          recipy = "https://www.ica.se/recept/kryddiga-kycklingfarsspett-med-ajvaryoghurt-723942/"
        } else if (time === "middle") {
          result = "Kycklingtacos med grillad sparris och kryddig gräddfil!";
          recipy = "https://www.ica.se/recept/kycklingtacos-med-grillad-sparris-kryddig-graddfil-725806/"
        } else if (time === "long") {
          result = "Helgrillad kyckling med sommarprimörer och wasabimajonnäs!";
          recipy = "https://www.ica.se/recept/helgrillad-kyckling-med-sommarprimorer-och-wasabimajonnas-719087/"
        }
      }
    }
    
    document.querySelector(".result").innerHTML = "<h3><strong>" + result + "</strong></h3><br><a href='" + recipy + "' target='_blank'>Visa recept</a>"

    document.querySelector(".result").scrollIntoView({ behavior: "smooth" });
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
