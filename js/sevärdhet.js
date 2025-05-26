let submitBtn;

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

  // ------------------ 24 KOMBINATIONSRESULTAT ------------------

  if (category === "history" && type === "beauty" && company === "kids") {
    result = "Kalmar Slott";
    description = "Ett pampigt slott med historia och spännande miljöer som även barn kan uppskatta.";
  } else if (category === "history" && type === "beauty" && company === "grownups") {
    result = "Kronobergs Slott";
    description = "En vacker slottsruin med sjöutsikt och historiska vingslag – perfekt för vuxna.";
  } else if (category === "history" && type === "unique" && company === "kids") {
    result = "Sagomuseet";
    description = "Berättelser och myter från förr – roligt och lärorikt för hela familjen.";
  } else if (category === "history" && type === "unique" && company === "grownups") {
    result = "Eksjöhovgårds Slottsruin";
    description = "En udda historisk plats med vacker natur omkring – en dold pärla.";
  } else if (category === "history" && type === "educative" && company === "kids") {
    result = "Tändsticksmuseet";
    description = "Ett unikt museum där barn kan lära sig om hur tändstickor förändrade världen.";
  } else if (category === "history" && type === "educative" && company === "grownups") {
    result = "Utställningen Rätt & Slätt";
    description = "En spännande och lärorik utställning om rättssystemets historia.";
  }

  else if (category === "art" && type === "beauty" && company === "kids") {
    result = "Vida Museum & Konsthall";
    description = "Färgsprakande konst i vacker miljö – inspirerande även för yngre.";
  } else if (category === "art" && type === "beauty" && company === "grownups") {
    result = "Ljungbergmuseet";
    description = "Ett elegant konstmuseum för dig som uppskattar svensk bildkonst.";
  } else if (category === "art" && type === "unique" && company === "kids") {
    result = "Gemla Leksaksmuseum";
    description = "En färgglad och nostalgisk plats full av gamla träleksaker.";
  } else if (category === "art" && type === "unique" && company === "grownups") {
    result = "Vandalorum";
    description = "En samtida konsthall i häftig arkitektur – unik och inspirerande.";
  } else if (category === "art" && type === "educative" && company === "kids") {
    result = "MX World Collection";
    description = "Ett annorlunda museum med motocross och motorcyklar som fascinerar stora som små.";
  } else if (category === "art" && type === "educative" && company === "grownups") {
    result = "Jönköpings Länsmuseum";
    description = "För dig som vill lära dig om konstnären John Bauer och Smålands historia.";
  }

  else if (category === "nature" && type === "beauty" && company === "kids") {
    result = "Bullerbyn";
    description = "Följ med in i Astrid Lindgrens värld – magiskt och vackert för barn.";
  } else if (category === "nature" && type === "beauty" && company === "grownups") {
    result = "Långe Jan";
    description = "Sveriges högsta fyr med utsikt över Östersjön och fågelliv – vacker och fridfull.";
  } else if (category === "nature" && type === "unique" && company === "kids") {
    result = "Lasse-Maja Grottan";
    description = "Ett litet äventyr för barn – in i skogens gömda grotta!";
  } else if (category === "nature" && type === "unique" && company === "grownups") {
    result = "Bilkyrkogården Kyrkömosse";
    description = "En märklig plats där natur och nostalgi möts – perfekt för nyfikna vuxna.";
  } else if (category === "nature" && type === "educative" && company === "kids") {
    result = "Naturum Kronoberg";
    description = "Upptäck naturen inomhus – barnvänligt och lärorikt.";
  } else if (category === "nature" && type === "educative" && company === "grownups") {
    result = "Ismantorps Borg";
    description = "En spännande ringborg från järnåldern – perfekt för historieintresserade naturälskare.";
  }

  else if (category === "tech" && type === "beauty" && company === "kids") {
    result = "Bruno Mathsson Center";
    description = "Design och form som tilltalar både barn och vuxna med sin lekfullhet.";
  } else if (category === "tech" && type === "beauty" && company === "grownups") {
    result = "Teleborgs Slott";
    description = "En sagolik byggnad i teknisk symbios med modern historia.";
  } else if (category === "tech" && type === "unique" && company === "kids") {
    result = "James Bond 007 Museum";
    description = "Spiontema, prylar och coola fordon – barnvänligt och unikt.";
  } else if (category === "tech" && type === "unique" && company === "grownups") {
    result = "Hylténs Industrimuseum";
    description = "Ett ovanligt museum om maskiner, smide och svensk industrihistoria.";
  } else if (category === "tech" && type === "educative" && company === "kids") {
    result = "IKEA Museum";
    description = "Lär dig om möbler, design och smarta lösningar – på barnens nivå.";
  } else if (category === "tech" && type === "educative" && company === "grownups") {
    result = "Husqvarna Museum";
    description = "Teknisk utveckling och innovation från vapen till symaskiner – fascinerande och lärorikt.";

  }

  // ------------------ SLUT KOMBINATIONSRESULTAT ------------------

  document.querySelector(".result").innerHTML =
    `<strong><h3>Du borde besöka ${result}!</h3></strong><p>${description}</p>`;

  const showBtnContainer = document.querySelector("#showBtnContainer");
  showBtnContainer.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "Läs mer om " + result;
  btn.classList.add("campingbtn");

  btn.addEventListener("click", function () {
    alert("Här kan du länka vidare till mer information om " + result);
  });

  showBtnContainer.appendChild(btn);
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








  