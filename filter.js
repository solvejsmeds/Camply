
const APIkey = "R7PGDNjZ" //api nyckel till SMAPI

function init() {


fetchSmapiCities() //anropar fetchSmapiCities


showCampings(); //anropar fuunktion som visar alla campingar

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
 const campings = data.payload;

 for (let i = 0; i < campings.length; i++) {
    const camping = campings[i];

    const name = camping.name;
    const city = camping.city;
    const price = camping.price + "<p>kr/natt</p>";
    const description = camping.description || "Ingen beskrivning tillgänglig";
    const website = camping.website ? `<a href="${camping.website}" target="_blank">Besök webbplats</a>` : "Ingen webbplats";

    // Skapa HTML för varje camping
    campingDiv.innerHTML += `
      <div class="camping-card">
        <h3>${name}</h3>
        <p><strong>Stad:</strong> ${city}</p>
        <p><strong>Pris:</strong> ${price}</p>
        <p><strong>Beskrivning:</strong> ${description}</p>
        <p><strong>Webbplats:</strong> ${website}</p>
      </div>
      <hr>
    `;
  }


}
//Slut showCampings
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