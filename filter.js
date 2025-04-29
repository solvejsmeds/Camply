
const APIkey = "R7PGDNjZ" //api nyckel till SMAPI

function init() {

console.log("hejsvejs")

console.log(APIkey)

fetchSmapiCities() //anropar smapiCities

}
window.addEventListener("load", init)
//Slut init
//-----------------------------------------------------------------------------------

//funktion för att hämta städer från sampi
async function fetchSmapiCities(){ 

const citySelect = document.querySelector("#selectedCity")
let response = await fetch ("https://smapi.lnu.se/api/?debug=true&api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping");

const data = await response.json();

const uniqueCities = new Set();

for (let i = 0; i < data.payload.length; i++) {
    const city = data.payload[i].city;
    if (city) {
      uniqueCities.add(city);
    }
  }

citySelect.innerHTML = ""; //rensar html koden


for (let city of uniqueCities) {
    citySelect.innerHTML += `<option>${city}</option>`;
}

citySelect.innerHTML +=
"<option>" + url.city + "</option>"



} //Slut smapiCities
//----------------------------------------------------------------------------------