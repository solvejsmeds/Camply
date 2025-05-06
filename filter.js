
const APIkey = "R7PGDNjZ" //api nyckel till SMAPI

let allCampings = []; //sparar alla cmapingar globalt

function init() {


fetchSmapiCities() //funktion anrop: hämtar städer till stad filtrer


showCampings(); //anropar fuunktion som visar alla campingar

document.querySelector("#selectedCity").addEventListener("change", filterCampings); //change lyssnare på stad filtrering
document.querySelector("#selectedPrice").addEventListener("change", filterCampings); //change lyssnare på pris filtrering

}
window.addEventListener("load", init)
//Slut init
//-----------------------------------------------------------------------------------

//funktion för att visa alla campingar, hämtar alla cmapingar fårn smapi och sparar dem i "allCampings"
async function showCampings() {
    const campingDiv = document.querySelector("#campingsContainer"); //element för cmapingarna 

    let response = await fetch ("https://smapi.lnu.se/api/?debug=true&api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping"); //anrop med fetch till Smapi, hämtar data

const data = await response.json(); //omvandlar svaret till json objekt



campingDiv.innerHTML = "";
 
allCampings = data.payload; //sparar alla campingar i allCampings
displayCampings(allCampings); //antopar funktion som visar cmapingarna

}
//Slut showCampings
//-----------------------------------------------------------------------------------


//visar cmapingarna på sidan. 
function displayCampings(campings) {

  const campingDiv = document.querySelector("#campingsContainer"); //hämtar elementet där cmapingarna ligger
  campingDiv.innerHTML = ""; //rensar html

 for (let i = 0; i < campings.length; i++) { 
    const camping = campings[i];

 

    let container = document.createElement("div");
    container.classList.add("campcontainer");

    // Skapa HTML för varje camping
    container.innerHTML += 
     "<h3 class='campingtext'>" + camping.name + "</h3>" +
        "<p class='campingtext'>" + camping.city + "</p>" +
        "<p class='campingtext'>" + camping.price_range + "</p>" +
        "<p class='campingtext'>" + camping.abstract + "</p>" + 
        "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>"+
        "<button class='campingtext'>Läs mer</button>"+
      "</div>";

      container.addEventListener("click", function() {
        window.location.href = "specifikcamping.html?id=" + camping.id;
      });

      campingDiv.appendChild(container);
  }


}
//Slut displayCampings
//-----------------------------------------------------------------------------------


//filtrerar cmapingarn
function filterCampings() {
  const selectedCity = document.querySelector("#selectedCity").value; //hämtar värdet från stad filtrer
  const selectedPrice = document.querySelector("#selectedPrice").value; //hämtar värdet från pris filter

  let filtered = allCampings;

  if (selectedCity !== "") { //filtrera på stad om stad är vald
    filtered = filtered.filter(camping => camping.city === selectedCity);
  }

  if (selectedPrice !=="") { //filtrera på prisklass om pris är valt.
    filtered = filtered.filter(camping => camping.price_range === selectedPrice);
  }


  displayCampings(filtered);
}
//slut filterCAmpingsByCity
//-----------------------------------------------------------------------------------





//funktion för att hämta städer från sampi
async function fetchSmapiCities(){ //(async = asyncron kod (kod som väntar på ett svar))

const citySelect = document.querySelector("#selectedCity") //elementet där städerna visas
let response = await fetch ("https://smapi.lnu.se/api/?debug=true&api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping"); //anrop med fetch till Smapi, hämtar data

const data = await response.json(); //omvandlar svaret till json objekt

//data.payload = arrayen som innehåller campingplatser

const uniqueCities = new Set(); //används för att undivka dubeltter

for (let i = 0; i < data.payload.length; i++) {
    const city = data.payload[i].city;
    if (city) {
      uniqueCities.add(city);
    }
  } //går igenom alla cmappngar och hämtar staden

  let sortedCities = Array.from(uniqueCities).sort(function(a, b) {
    return a.localeCompare(b);
  }); //sorterar städerna i alfabetisk ordning


for (let city of sortedCities) {
    citySelect.innerHTML += "<option>" + city + "</option>";
} //går igenom varje stad och skapar en option i rullistan för varje stad




} //Slut smapiCities
//---------------------------------------------