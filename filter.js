
const APIkey = "R7PGDNjZ" //api nyckel till SMAPI

let allCampings = []; //sparar alla cmapingar globalt

function init() {


fetchSmapiCities() //anropar fetchSmapiCities


showCampings(); //anropar fuunktion som visar alla campingar

document.querySelector("#selectedCity").addEventListener("change", filterCampingsByCity); //change lyssnare på stad filtrering

}
window.addEventListener("load", init)
//Slut init
//-----------------------------------------------------------------------------------

//funktion för att visa alla campingar
async function showCampings() {
    const campingDiv = document.querySelector("#campingsContainer"); //element för cmapingarna 

    let response = await fetch ("https://smapi.lnu.se/api/?debug=true&api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping"); //anrop med fetch till Smapi, hämtar data

const data = await response.json(); //omvandlar svaret till json objekt



campingDiv.innerHTML = "";
 // Gå igenom alla campingar och lägg till dem i sidan
allCampings = data.payload;
displayCampings(allCampings); //antopar funktion som visar cmapingarna

}
//Slut showCampings
//-----------------------------------------------------------------------------------

function displayCampings(campings) {

  const campingDiv = document.querySelector("#campingsContainer");
  campingDiv.innerHTML = "";

 for (let i = 0; i < campings.length; i++) {
    const camping = campings[i];

    const name = camping.name; //namn
    const city = camping.city; //stad
    const price = camping.price_range; //pris
    const description = camping.abstract; //texten
    const website = camping.website; //länk till campingens webbsida

    // Skapa HTML för varje camping
    campingDiv.innerHTML += 
    "<div class='campcontainer'>"+
        "<h3>" + name + "</h3>" +
        "<p>" + city + "</p>" +
        "<p>" + price + "</p>" +
        "<p>" + description + "</p>" + 
        "<p><a href='" + website + "' target='_blank'>" + website + "</a></p>"+
        "<button>Läs mer</button>"+
      "</div>";
  }


}
//Slut showCampings
//-----------------------------------------------------------------------------------

function filterCampingsByCity() {
  const selectedCity = document.querySelector("#selectedCity").value;

  const filtered = allCampings.filter(camping => camping.city === selectedCity);

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

citySelect.innerHTML = ""; //rensar html koden


for (let city of uniqueCities) {
    citySelect.innerHTML += "<option>" + city + "</option>";
} //går igenom varje stad och skapar en option i rullistan för varje stad




} //Slut smapiCities
//---------------------------------------------