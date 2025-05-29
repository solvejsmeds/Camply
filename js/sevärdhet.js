let submitBtn;
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

      for (let j = 0; j < choices.length; j++) {
        if (choices[j].getAttribute("data-question") === question) {
          choices[j].classList.remove("selected");
        }
      }

      this.classList.add("selected");
      checkIfAllAnswered();
    });
  }

  submitBtn.addEventListener("click", findResult);
  document.querySelector("#redoBtn").addEventListener("click", resetTest);

  document.querySelector("#closeModal").addEventListener("click", function () {
    document.querySelector("#attractionmodal").close();
  });

  // Hamburger-meny
  document.querySelector("#hamburger").addEventListener("click", function () {
    document.querySelector("#nav-links").classList.toggle("show");
  });
}




window.addEventListener("load", init);

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



function findResult() {
  const category = document.querySelector('.elemchoice.selected[data-question="category"]')?.dataset.value;
  const type = document.querySelector('.elemchoice.selected[data-question="type"]')?.dataset.value;
  const company = document.querySelector('.elemchoice.selected[data-question="company"]')?.dataset.value;

  if (!category || !type || !company) {
    document.querySelector(".result").innerText = "Du måste svara på alla frågor!";
    return;
  }

  let result = "";
  let description = "";

 
//HISTORIA
  if (category === "history" && type === "beauty" && company === "kids") {
    result = "Kalmar Slott";
    id = 452; //
  } else if (category === "history" && type === "beauty" && company === "grownups") {
    result = "Kronobergs Slott";
    id = 633;//
  } else if (category === "history" && type === "unique" && company === "kids") {
    result = "Gemla leksaksmuseum";
    id = 474;//
  } else if (category === "history" && type === "unique" && company === "grownups") {
    result = "Grenna museum";
    id = 462; //
  } else if (category === "history" && type === "educative" && company === "kids") {
    result = "Älmhults skolmuseum";
    id = 517;//
  } else if (category === "history" && type === "educative" && company === "grownups") {
    result = "IKEA museum";
    id = 433;
  }




  //KONST
  else if (category === "art" && type === "beauty" && company === "kids") {
    result = "Vida Museum & Konsthall";
    id = 529 //inte för barn egentligen, fixa ny
  } else if (category === "art" && type === "beauty" && company === "grownups") {
    result = "Ljungbergmuseet";
    id = 525;//
  } else if (category === "art" && type === "unique" && company === "kids") {
    result = "Skallagrim Gert Schuld trädgårdsgalleri";
    id = 733; // !!!!!!!!!!!!!!!!!!!!!!!!!
  } else if (category === "art" && type === "unique" && company === "grownups") {
    result = "Tändsticksmuseet";
    id = 457 //
  } else if (category === "art" && type === "educative" && company === "kids") {
    result = "Virserums konsthall";
    id = 708 //!!!!!!!!!!!!!!!!!!!!!!!
  } else if (category === "art" && type === "educative" && company === "grownups") {
    result = "Vandalorum";
    id = 451 //
  }


  //NATUR
  else if (category === "nature" && type === "beauty" && company === "kids") {
    result = "Bullerbyn";
    id = 712 
  } else if (category === "nature" && type === "beauty" && company === "grownups") {
    result = "Långe Jan";
    id = 678;
  } else if (category === "nature" && type === "unique" && company === "kids") {
    result = "Arla-kon i väceklsång";
    id = 688
  } else if (category === "nature" && type === "unique" && company === "grownups") {
    result = "Bilkyrkogården Kyrkömosse";
    id = 619;
  } else if (category === "nature" && type === "educative" && company === "kids") {
    result = "Naturum Kronoberg";
    id = 478
  } else if (category === "nature" && type === "educative" && company === "grownups") {
    result = "Ismantorps Borg";
    id = 682;
  }





  // ------------------ SLUT KOMBINATIONSRESULTAT ------------------

  document.querySelector(".result").innerHTML =
    "<strong><h3>Du borde besöka " + result +"!</h3></strong><p class='resulttext'>"+description+"</p>";

  const showBtnContainer = document.querySelector("#showBtnContainer");
  showBtnContainer.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "Läs mer";
  btn.classList.add("campingbtn");

  btn.addEventListener("click", async function () {
    if (!id) return;
  
    const info = await fetchAttractionDetails(id);
    const modal = document.querySelector("#attractionmodal");
    const titleEl = document.querySelector("#modalTitle");
    const contentEl = document.querySelector("#modalContent");
  
    
      titleEl.textContent = result;
  
      let html = "";
  
      
        html += "<p><strong>Stad: </strong>"+info.city+"</p>";
        html += "<p><strong>Pris: </strong>"+info.price_range+"</p>";
   
        html += "<p>"+info.text+"</p>";
    
 
        html += "<p><a href="+info.website+" target='_blank'>Besök webbplats</a></p>";
     
  
      contentEl.innerHTML = html;
  
  
    modal.showModal();
  });

  showBtnContainer.appendChild(btn);


  document.querySelector(".result").scrollIntoView({ behavior: "smooth" });
}

function resetTest() {
  const choices = document.querySelectorAll(".elemchoice");
  for (let i = 0; i < choices.length; i++) {
    choices[i].classList.remove("selected");
  }

  document.querySelector(".result").innerText = "";
  document.querySelector("#showBtnContainer").innerHTML = "";
  submitBtn.disabled = true;
}


// Hämta sevärdhetens info från SMAPI
async function fetchAttractionDetails(id) {
  try {
    const searchUrl = "https://smapi.lnu.se/api/?api_key=" + APIkey +
      "&controller=establishment&method=getall&ids=" + id;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.payload && data.payload.length > 0) {
      return data.payload[0]; // Returnera första träffen
    }
  } catch (error) {
    console.error("Kunde inte hämta info från SMAPI:", error);
  }

  return null;
}






  