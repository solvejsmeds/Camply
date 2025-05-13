const APIkey = "R7PGDNjZ"; // API-nyckel till SMAPI

let campingId;  //campingens id
let myMap; //objekt för kartan
//let addrMarkers = [];
let myMarkers = []; //markör för cmapingen
let restaurantMarkers = []; //sparar markörer för resturanger i närheter
let lat; //sparar lat
let lng; //sparar lng



function init() {
  showSpecificCamping();  // Anropa funktionen för att visa specifik camping

}
window.addEventListener("load", init);
//Slut init
//_______________________________________________________________________________________________



// Funktion för att visa specifik camping
async function showSpecificCamping() {

  const specificCampingDiv = document.querySelector(".specificCampingDiv"); // Elementet där campinginformationen ska visas

  const urlParams = new URLSearchParams(window.location.search); // Hämtar query params från URL:en

  campingId = urlParams.get('id'); // Hämta id från URL

  // Anropa API för att hämta camping med ID
  let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getall&descriptions=camping&ids=" + campingId);

  const data = await response.json(); // Omvandla svaret till JSON

  if (data.payload.length > 0) {
    const camping = data.payload[0]; // Hämta första (och enda) campingdata från svaret

    // Skapa och visa campinginformation på sidan
    specificCampingDiv.innerHTML =
      "<h3 class='campingtext'>" + camping.name + "</h3>" +
      "<p class='campingtext'>" + camping.city + "</p>" +
      "<p class='campingtext'>" + camping.price_range + "</p>" +
      "<p class='campingtext'>" + camping.text + "</p>" +
      "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>";

    //fetchReviews(campingId) // anrop av funktion för att hämta campingens recensioner

    console.log("campinglat: ", camping.lat, ", cmapinglng: ", camping.lng);

    lat = camping.lat; //latitud
    lng = camping.lng; //longitud

    initMap(camping.lat, camping.lng, camping.name); //anropar kartan och skickar med lat, lng och namn

    document.querySelector("#showRestaurantsBtn").addEventListener("click", function () {
      fetchRestaurants(camping.lat, camping.lng);
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på

    fetchWeather(camping.lat, camping.lng); //anropar funktion för att visa väderprognosen, skickar med lat och lng
  }

}
//slut showSpecificCamping
//_______________________________________________________________________________________________


//kart funktion
function initMap(lat, lng, name) {

  const zoom = 12 //zoom för kartan

  myMap = L.map("map").setView([lat, lng], zoom); //skapar kartan i "map" elementet

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap); //ladar in kartbilden och lägger in den i kartan

  // Skapa markörer
  let marker = L.marker([lat, lng]).bindPopup(name);//skapar en markör för campingen, titeln visas vid hover visas vid

  myMarkers.push(marker);//sparar markören i en array
  marker.addTo(myMap); //lägger in markören på kartan

}
//Slut initMap
//_______________________________________________________________________________________________



//funktion för att hämta resturanger i närheter
async function fetchRestaurants(lat, lng) {

  console.log("resturang funktion")

 const url = "https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=food&method=getfromlatlng&lat=" + lat + "&lng=" + lng
 //"&sort_by=asc&order_by=distance_in_km";

 //länken till smapi, hämtar näsmaste resturanger utifrån lat och lang

  try {
    const response = await fetch(url); //anropar apiet och väntar på svar
    const data = await response.json(); //omvandlar svaret till ett json objekt

    for (let marker of restaurantMarkers) {
      myMap.removeLayer(marker); // Rensa gamla restaurangmarkörer från kartan
    }

    restaurantMarkers = []; //sparar marköererna i en lista

    console.log("Restaurang-data:", data);

    if (data.payload.length === 0) {
      alert("Inga restauranger hittades nära denna camping.");
      return; //om inga resturanger finns visas felmeddelande och funktion avbryts
    }

    // loopar igem alla resturanger
    for (let i = 0; i < data.payload.length; i++) {
      const rest = data.payload[i];

      //lägger till markör och popuptext
      const marker = L.marker([parseFloat(rest.lat), parseFloat(rest.lng)], {
        title: rest.name
      }).bindPopup(rest.name + "<br>" + rest.distance_in_km.toFixed(1) + " km bort");

      marker.addTo(myMap); //lägger till markör på kartan
      restaurantMarkers.push(marker) //sparar markör i listan
    }

  } catch (error) {
    console.error("Kunde inte hämta restauranger:", error);
  }
}
//Slut fetchRestaurants
//_______________________________________________________________________________________________



//funktion för att hämta väder
async function fetchWeather(lat, lng) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto"; //api url för att hämta väder (Open-metero)

  try {
    const response = await fetch(url); //skickar förfrågan
    const data = await response.json(); //gör om svaret till json

    const dates = data.daily.time; //datum
    const tempsMax = data.daily.temperature_2m_max; //maxtemperatur
    const tempsMin = data.daily.temperature_2m_min; //min temperatur

    let html = "<h4>Veckans väder prognos:</h4><div class='weatherDiv>";

    //loopar igenom vare dag i prognosen
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]); //gör om sträng till date objekt
      const day = date.toLocaleDateString("sv-SE", { day: 'numeric', month: 'numeric' }); // datum
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });              // veckdag
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);      // Gör om till stor bokstav

      html += "<p class='weatherbox'>" + day + " " + capitalizedWeekday + ": " + tempsMin[i] + "°C – " + tempsMax[i] + "°C</p>";
    }
    html += "</div>";
    document.querySelector(".weatherDiv").innerHTML = html; //visar vädret i rätt element

  } catch (error) {
    console.error("Kunde inte hämta väderdata:", error);
    document.querySelector(".weatherDiv").innerHTML = "Kunde inte hämta väderdata."; //loggar fel och visar felmedelande
  }
}
//Slut fetchWeatcher
//_______________________________________________________________________________________________



//funktion för att visa cmapingens recensioner
/*async function fetchReviews(campingId) {
    console.log("Hämtar recensioner för campingId:", campingId);
  
    let reviewsDiv = document.querySelector(".reviewsDiv"); //hämtar elemenet där recensionerna ska visas
  
    // Hämta recensioner från SMAPI
    let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getReviews&id=" + campingId); //anropar smapi o hämtar recensioner med urlen

   

  
    const reviewsData = await response.json(); // Konvertera till JSON objekt
  
    console.log("Recensioner:", reviewsData.payload);
  
    if (reviewsData.payload.length > 0) { //kollar om det finns recensioner
      // Visa alla recensioner
    reviewsDiv.innerHTML = "<h3>Recensioner:</h3>";
  
      for (let i = 0; i < reviewsData.payload.length; i++) {
        const review = reviewsData.payload[i];
  

        console.log("recension", reviewsData.payload[i])

        reviewsDiv.innerHTML += "<div class='review'>" +
          "<p>" + review.name + "</p>" +
          "<p>" + review.rating + "</p>" +
          "<p>" + review.comment + "</p>" +
          "</div><hr>";
      }
  
      
    } else {
      reviewsDiv.innerHTML = "<p>Inga recensioner hittades.</p>";
    }
  } */