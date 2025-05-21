const APIkey = "R7PGDNjZ"; // API-nyckel till SMAPI

let campingId;  //campingens id
let myMap; //objekt för kartan
//let addrMarkers = [];
let myMarkers = []; //markör för cmapingen
let restaurantMarkers = []; //sparar markörer för resturanger i närheter
let lat; //sparar lat
let lng; //sparar lng
let natureMarkers = []; //spara markörer för naturreservat
let golfMarkers = []; //sparaar markörer för golbanor



function init() {



  showSpecificCamping();  // Anropa funktionen för att visa specifik camping



}
window.addEventListener("load", init);
//Slut init
//_______________________________________________________________________________________________



// Funktion för att visa specifik camping
async function showSpecificCamping() {

  const specificCampingDiv = document.querySelector(".specificCampingDiv"); // Elementet där campinginformationen ska visas

  const reviewsDiv = document.querySelector(".reviewsDiv"); //element för recensioner och betyg

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
      "<p class='campingtext'> Campingen ligger i " + camping.city + ".</p>" +
      "<p class='campingtext'> Priset ligger runt " + camping.price_range + " kr.</p>" +
      "<p class='campingtext'>" + camping.text + "</p>" +
      "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>";

    //fetchReviews(campingId) // anrop av funktion för att hämta campingens recensioner

    reviewsDiv.innerHTML = "<p> Betyget för " + camping.name + " är " + parseFloat(camping.rating).toFixed(1) + " av 5</p>";
    


    console.log("campinglat: ", camping.lat, ", cmapinglng: ", camping.lng);

    lat = camping.lat; //latitud
    lng = camping.lng; //longitud

    initMap(camping.lat, camping.lng, camping.name); //anropar kartan och skickar med lat, lng och namn

    displayLoader()

    document.querySelector("#showRestaurantsBtn").addEventListener("click", function () {
      fetchRestaurants(camping.lat, camping.lng);
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på

    document.querySelector("#natureReserveBtn").addEventListener("click", function () {
      fetchNatureReserve(camping.county);
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på

    document.querySelector("#golfBtn").addEventListener("click", function () {
      fetchGolf(camping.city);
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på


    hideLoader();

    console.log(camping.county)



    fetchWeather(camping.lat, camping.lng, camping.city); //anropar funktion för att visa väderprognosen, skickar med lat och lng

    fetchReviews(camping.id, camping.name); // Anropa funktionen och skicka in campingens id


   
  }

 

}
//slut showSpecificCamping
// _______________________________________________________________________________________________


//kart funktion
function initMap(lat, lng, name) {

  const zoom = 7 //zoom för kartan

  myMap = L.map("map").setView([lat, lng], zoom); //skapar kartan i "map" elementet

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap); //ladar in kartbilden och lägger in den i kartan

  // Skapa markörer
  let marker = L.marker([lat, lng]).bindPopup(name);//skapar en markör för campingen, titeln visas vid hover visas vid

  myMarkers.push(marker);//sparar markören i en array
  marker.addTo(myMap); //lägger in markören på kartan




// Efter att kartan för campingen skapats
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showUserPosition, showError);
}

// Funktion som visar användarens position
function showUserPosition(pos) {
  const userLat = pos.coords.latitude;
  const userLng = pos.coords.longitude;

  L.marker([userLat, userLng])
    .addTo(myMap)
    .bindPopup("Du är här")
    .openPopup();
}

// Felhantering (valfritt men rekommenderas)
function showError(error) {
  console.warn("Fel vid hämtning av plats:", error);
}

}
//Slut initMap
//_______________________________________________________________________________________________



//funktion för att hämta resturanger i närheter
async function fetchRestaurants(lat, lng) {

  displayLoader()

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

    hideLoader()

  } catch (error) {
    console.error("Kunde inte hämta restauranger:", error);
  }
}
//Slut fetchRestaurants
//_______________________________________________________________________________________________

function hideLoader () {
  document.querySelector("#mapoverlay").style.visibility = "hidden"

  document.querySelector("#map").style.filter = "none"
}

function displayLoader () {
document.querySelector("#mapoverlay").style.visibility = "visible"

document.querySelector("#map").style.filter = "blur(3px)"
}


/*
//funktion för att hämta väder
async function fetchWeather(lat, lng, city) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto"; //api url för att hämta väder (Open-metero)

  try {
    const response = await fetch(url); //skickar förfrågan
    const data = await response.json(); //gör om svaret till json

    const dates = data.daily.time; //datum
    const tempsMax = data.daily.temperature_2m_max; //maxtemperatur
    const tempsMin = data.daily.temperature_2m_min; //min temperatur

    let html = 
   "<div class='weatherDiv'>";

    //loopar igenom vare dag i prognosen
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]); //gör om sträng till date objekt
      const day = date.toLocaleDateString("sv-SE", { day: 'numeric', month: 'numeric' }); // datum
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });              // veckdag
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);      // Gör om till stor bokstav

      html += "<p class='weatherbox'>" + day + " " + capitalizedWeekday + "<br>"  + tempsMin[i] + "°C – " + tempsMax[i] + "°C</p>";

 
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
*/

async function fetchWeather(lat, lng, city) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const dates = data.daily.time;
    const tempsMax = data.daily.temperature_2m_max;
    const tempsMin = data.daily.temperature_2m_min;

    let html = "<div class='weatherDiv'>";

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const day = date.toLocaleDateString("sv-SE", { day: 'numeric', month: 'numeric' });
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

      // Skapa URL till SMHI
      const smhiURL = "https://www.smhi.se/vader/prognoser-och-varningar/vaderprognos/q/" + encodeURIComponent(city);

      html += "<a href='"+smhiURL+"' target='_blank' class='weatherbox'>"+
          day + "<br>" + capitalizedWeekday + "<br>" + tempsMin[i] + "°C – " + tempsMax[i] + "°C</a>";
    }

    html += "</div>";
    document.querySelector(".weatherDiv").innerHTML = html;

  } catch (error) {
    console.error("Kunde inte hämta väderdata:", error);
    document.querySelector(".weatherDiv").innerHTML = "Kunde inte hämta väderdata.";
  }
}
//Slut fetchWeather
//---------------------------------------------------



async function fetchNatureReserve(county) {

  displayLoader();

  console.log("natureReservefunction");

  const url = "https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getall&descriptions=naturreservat&counties="+ county;

  try {
    const response = await fetch(url);
    const data = await response.json();

    for (let marker of natureMarkers) {
      myMap.removeLayer(marker); // Rensa ev. gamla markörer
    }

    for (let marker of natureMarkers) {
      myMap.removeLayer(marker); // Rensa gamla naturreservat
    }

    natureMarkers = [];

    console.log("naturreservat:", data);

    if (data.payload.length === 0) {
      alert("Inga naturreservat hittades.");
      return;
    }

    for (let i = 0; i < data.payload.length; i++) {
      const nature = data.payload[i];

      const name = nature.name
      const website = nature.website

      let popupContent = "<p>" + name + "</p>";

        // Om länk finns, lägg till klickbar länk
  if (website) {
    popupContent += "<a href='" + website + "' target='_blank'>Läs mer</a>";
  }

      const marker = L.marker([parseFloat(nature.lat), parseFloat(nature.lng)], {
        title: nature.name

      }).bindPopup(popupContent);

      marker.addTo(myMap);
      natureMarkers.push(marker);
    }

    hideLoader();

  } catch (error) {
    console.error("Kunde inte hämta naturreservat:", error);
  }


}
//Slut fetchNatureReserve
//------------------------------------------


//funktion för att hämta golfbanor i staden som campingen ligger i 
async function fetchGolf(city) {

  
  console.log("Golf!! :)");

  console.log("stad: ", city)

  const url = "https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getall&descriptions=golfbana&cities="+city;

  try {
    const response = await fetch(url);
    const data = await response.json();

    for (let marker of golfMarkers) {
      myMap.removeLayer(marker); // Rensa ev. gamla markörer
    }

    for (let marker of golfMarkers) {
      myMap.removeLayer(marker); // Rensa gamla naturreservat
    }

    golfMarkers = [];

    console.log("golf", data);

    if (data.payload.length === 0) {
      alert("Inga golfbanor hittades.");
      return;
    }

    for (let i = 0; i < data.payload.length; i++) {
      const golf = data.payload[i];

      const marker = L.marker([parseFloat(golf.lat), parseFloat(golf.lng)], {
        title: golf.name
      }).bindPopup(golf.name);

      marker.addTo(myMap);
      golfMarkers.push(marker);
    }

  } catch (error) {
    console.error("Kunde inte hämta golfbanor:", error);
  }
}


//funktion för att visa cmapingens recensioner
async function fetchReviews(campingId, name) {
    console.log("Hämtar recensioner för campingId:", campingId);
  
    let reviewsDiv = document.querySelector(".reviewsDiv"); //hämtar elemenet där recensionerna ska visas
  
    // Hämta recensioner från SMAPI
    let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getReviews&id=" + campingId); //anropar smapi o hämtar recensioner med urlen

   

  
    const reviewsData = await response.json(); // Konvertera till JSON objekt
  
    console.log("Recensioner:", reviewsData.payload);
  
    if (reviewsData.payload.length > 0) { //kollar om det finns recensioner
      // Visa alla recensioner
    reviewsDiv.innerHTML += "<h3>Recensioner:</h3>";
  
      for (let i = 0; i < reviewsData.payload.length; i++) {
        const review = reviewsData.payload[i];
  

        console.log("recension", reviewsData.payload[i])

        reviewsDiv.innerHTML += "<div class='review'>" +
        
          "<p> - " + review.comment + "</p>" +
          "</div><hr>";
      }
  
      
    } else {
      reviewsDiv.innerHTML += "<p>Det finns inga recensioner för " + name + " </p>";
    }
  } 