
const APIkey = "R7PGDNjZ" //api nyckel till SMAPI

let allCampings = []; //sparar alla cmapingar globalt

const positionIds = { //id för campingarna uppdelade i kategorier för olika lägen
  forest: [ //skog
    659, 658, 657, 656, 655, 616, 615, 614, 613, 612, 611, 610, 609, 607, 606, 605, 604, 603, 602, 601, 600, 307, 305, 608, 303, 201, 202, 301, 286, 285, 281, 280, 277, 275, 273, 246, 245, 244, 243, 242, 241, 216, 217, 218, 219, 220, 238, 237
  ],
  lake: [ //sjö
    659, 658, 657, 656, 655, 616, 615, 614, 613, 612, 611, 610, 609, 607, 606, 605, 604, 603, 602, 601, 600, 307, 305, 608, 303, 301, 286, 285, 281, 280, 275, 273, 246, 245, 244, 239
  ],
  sea: [ //hav
    170, 173, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 197, 198, 200, 201, 202, 205, 207, 209, 210, 211, 215, 277, 216, 243, 242, 241, 217, 218, 219, 220, 240, 238, 237, 236
  ],
  city: [ //stad
    616, 184, 189, 191, 192, 303, 301, 247, 239, 238
  ]
};



function init() {

  fetchSmapiCities() //funktion anrop: hämtar städer till stad filtrer

  showCampings(); //anropar fuunktion som visar alla campingar

  //document.querySelector("#selectedCity").addEventListener("change", filterCampings); //change lyssnare på stad filtrering
  document.querySelector("#selectedPrice").addEventListener("change", filterCampings); //change lyssnare på pris filtrering

  dropdown(); //dropdown för läge filtrering
  dropdownCity(); //dropdown för stad filtrering

  let positionCheckboxes = document.querySelectorAll("#dropdownContent input[type='checkbox']"); //hämtar alla checkboxar

  for (let i = 0; i < positionCheckboxes.length; i++) {
    let checkbox = positionCheckboxes[i];
    checkbox.addEventListener("change", filterCampings);
  } //loopar igenom checkboxarna och lägger till change eventlyssnare, anropar filter campings

  document.querySelector("#wifiSlider").addEventListener("change", filterCampings);
  document.querySelector("#fishingSlider").addEventListener("change", filterCampings);
  document.querySelector("#cafeSlider").addEventListener("change", filterCampings);
  document.querySelector("#laundrySlider").addEventListener("change", filterCampings);

}
window.addEventListener("load", init)
//Slut init
//-----------------------------------------------------------------------------------



//funktion för att hantera dropdown menyn med kryssruto för läge
function dropdown() {
  let dropdownBtn = document.querySelector("#dropdownBtn"); //knappen för läge

  let dropdownContent = document.querySelector("#dropdownContent"); //hämtas dropdownmenyn med lägen

  dropdownBtn.addEventListener("click", function (event) { //händelselyssnare på knappen för läge
    event.stopPropagation(); //förhindrar bubbla upp
    dropdownContent.classList.toggle("show"); //visar menun
  });

}
//Slut dropodown
//-----------------------------------------------------------------------------------



function dropdownCity() {
  let dropdownBtnCity = document.querySelector("#dropdownBtnCity");

  let dropdownContentCity = document.querySelector("#dropdownContentCity");

  dropdownBtnCity.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownContentCity.classList.toggle("show");
  }); //lägger klicklyssnare på knappen så att dropdownen visas

  // Stäng dropdown när man klickar utanför
  document.addEventListener("click", function () {
    dropdownContentCity.classList.remove("show");
  });

  dropdownContentCity.addEventListener("click", function (event) {
    event.stopPropagation(); // förhindrar att klick inuti dropdown stänger den
  });
}
//Slut dropodownCity
//-----------------------------------------------------------------------------------



//funktion för att visa alla campingar, hämtar alla cmapingar fårn smapi och sparar dem i "allCampings"
async function showCampings() {

  const campingDiv = document.querySelector("#campingsContainer"); //element för cmapingarna 

  let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping"); //anrop med fetch till Smapi, hämtar data

  const data = await response.json(); //omvandlar svaret till json objekt

  campingDiv.innerHTML = ""; //rensar

  allCampings = data.payload; //sparar alla campingar i allCampings

  displayCampings(allCampings); //antopar funktion som visar cmapingarna

}
//Slut showCampings
//-----------------------------------------------------------------------------------



//visar cmapingarna på sidan. 
function displayCampings(campings) {

  const campingDiv = document.querySelector("#campingsContainer"); //hämtar elementet där cmapingarna ligger

  campingDiv.innerHTML = ""; //rensar html

  if (campings.length === 0) { //om inga campingar med valda filter finns..
    campingDiv.innerHTML = "<p>Inga campingar med dina valda filter finns. Justera dina filter för att hitta campingar som passar dig. </p>";
    return; // Avbryt funktionen så att inga campingar visas
  }

  for (let i = 0; i < campings.length; i++) { //går igenom alla campingar :)
    const camping = campings[i]; //hämtad camping objekt

    let container = document.createElement("div");
    container.classList.add("campcontainer"); //skapar element för de olika cmapingarna

    // Skapa HTML för varje camping
    container.innerHTML +=
      "<h3 class='campingtext'>" + camping.name + "</h3>" +
      "<p class='campingtext'>" + camping.city + "</p>" +
      "<p class='campingtext'>" + camping.price_range + "</p>" +
      "<p class='campingtext'>" + camping.abstract + "</p>" +
      "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>"
    //skriver ut namn, stad, pris, beskrivning och länk till webbplatsen

    let button = document.createElement("button");
    button.classList.add("campingtext");
    button.textContent = "Läs mer"; //lägger till en "läs mer" knapp för de användare som inte fattar att man kan klicka på elementet...

    container.appendChild(button) //lägger till button elementet i containern

    container.addEventListener("click", function () {
      window.location.href = "specifikcamping.html?id=" + camping.id;
    }); //visar sidan för den camping som cklickats 

    button.addEventListener("click", function () {
      window.location.href = "specifikcamping.html?id=" + camping.id;
    }); //visar sidan för den camping som cklickats (knappen)

    campingDiv.appendChild(container); //lägger till container i campingDiv
  }

}
//Slut displayCampings
//-----------------------------------------------------------------------------------



//filtrerar cmapingarn utifrån pris, stad och läge
function filterCampings() {

  const selectedPrice = document.querySelector("#selectedPrice").value; //hämtar värdet från pris filter

  let filtered = allCampings; // Startar med alla campingar – filtreras stegvis utan att påverka originaldatan

  if (selectedPrice !== "") { // Filtrera på prisklass om något valts
    filtered = filtered.filter(function (camping) {
      return camping.price_range === selectedPrice; // Behåll campingar med matchande pris
    });
  }

  // Hämtar alla stad-checkboxar som är ibockade
  const selectedCheckboxesCity = document.querySelectorAll("#dropdownContentCity input[type='checkbox']:checked");
  let selectedCities = Array.from(selectedCheckboxesCity).map(function (cb) {
    return cb.value;
  }); // Skapar en lista med valda stadnamn

  //filtrerar campingar minst en stad är vald
  if (selectedCities.length > 0) {
    filtered = filtered.filter(function (camping) {
      //behåll campingar där cmapingens stad finns med i listan av valda städer
      return selectedCities.includes(camping.city);
    });
  }

  const selectedCheckboxes = document.querySelectorAll("#dropdownContent input[type='checkbox']:checked"); // Hämtar alla läge-checkboxar som är ibockade (skog, sjö, hav, stad)
  let selectedPositions = Array.from(selectedCheckboxes).map(function (cb) {
    return cb.value
  }); // Skapar lista med valda lägen

  //filrerar vampingar om minst ett läge är valt
  if (selectedPositions.length > 0) {
    filtered = filtered.filter(function (camping) {
      //behåll cmapingar där camoingens id  finns i minst en av de valda läge listorna
      return selectedPositions.some(function (position) {
        return positionIds[position].includes(parseInt(camping.id));
      });
    });
  }

  // Filtrering: endast campingar med WiFi om slidern är aktiverad
  const wifiChecked = document.querySelector("#wifiSlider").checked;

  if (wifiChecked) {
    filtered = filtered.filter(function (camping) {
      const text = camping.text ? camping.text.toLowerCase() : "";
      return text.includes("wifi") || text.includes("internet") || text.includes("surfzon");
    });
  }

  // Filtrering: endast campingar med fiske om slidern är aktiverad
  const fishingChecked = document.querySelector("#fishingSlider").checked;

  if (fishingChecked) {
    filtered = filtered.filter(function (camping) {
      const text = camping.text ? camping.text.toLowerCase() : "";
      return text.includes("fisk");
    });
  }



    // Filtrering: endast campingar med cafe om slidern är aktiverad
    const cafeChecked = document.querySelector("#cafeSlider").checked;

    if (cafeChecked) {
      filtered = filtered.filter(function (camping) {
        const text = camping.text ? camping.text.toLowerCase() : "";
        return text.includes("café") || text.includes("kiosk");
      });
    }

   

     // Filtrering: endast campingar med tävttmaskin eller tvättstuga om slidern är aktiverad
     const laundryChecked = document.querySelector("#laundrySlider").checked;

     if (laundryChecked) {
      console.log("tvättmaskin valt")
      filtered = filtered.filter(function (camping) {
        const text = camping.text ? camping.text.toLowerCase() : "";
        return text.includes("tvätt");
      });
    }

  


  displayCampings(filtered);// Visa de campingar som matchar filtren

}
//slut filterCAmpingsByCity
//-----------------------------------------------------------------------------------



//funktion för att hämta städer från sampi
async function fetchSmapiCities() {
  const cityContainer = document.querySelector("#dropdownContentCity"); //hämtar elementet där checkboxarna för städer ska ligga

  let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping"); //api antop till smpai, hämtar cmapingarna
  const data = await response.json(); //tolkar svaret, sparar det i data

  const uniqueCities = new Set(); //används för att det inte ska bli flera av samma stad, lista där varje värde är unikt

  for (let i = 0; i < data.payload.length; i++) {
    const city = data.payload[i].city;
    if (city) {
      uniqueCities.add(city);
    }
  } //loopar igenom alla campingar och hämtar namn och lägger in dom i uniqueCities listan

  let sortedCities = Array.from(uniqueCities).sort(function (a, b) {
    return a.localeCompare(b, 'sv');
  }); //gör om till en array och sorterar i alfabetisk ordning

  for (let city of sortedCities) {
    cityContainer.innerHTML += "<label><input type='checkbox' value='" + city + "'>" + city + "</label><br>";
  } //skapar checkbox för varje stad och lägger in i html

  let cityCheckboxes = document.querySelectorAll("#dropdownContentCity input[type='checkbox']"); //hämtar alla checkboxar som skapats

  for (let i = 0; i < cityCheckboxes.length; i++) {
    let checkboxCity = cityCheckboxes[i];
    checkboxCity.addEventListener("change", filterCampings);
  } //loopar igenom checkboxarna och lägger till change eventlyssnare, anropar filter campings

} //Slut smapiCities
//---------------------------------------------