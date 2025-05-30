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
let attractionMarkers = []; //sparrar marköeerr för sevärdheter


let showRestaurants = false;
let showNature = false;
let showGolf = false;
let showAttractions = false;
// Flaggor som håller reda på om respektive kartmarkör är synlig eller ej

let loaderTimeout = null;
let loaderVisible = false;
// Variabler för att styra när loadern ska visas
// Loadern visas endast om laddningen tar längre än 1 sekund


function init() {




  showSpecificCamping();  // Anropa funktionen för att visa specifik camping


  document.querySelector("#hamburger").addEventListener("click", function () {
    document.querySelector("#nav-links").classList.toggle("show");
  }); //navigeringen

  const closeBtn = document.querySelector("#closeModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      const modal = document.querySelector("#infoModal");
      if (modal) modal.close();
    });
  } //stäng knapp till modalen



}
window.addEventListener("load", init);
//Slut init
//_______________________________________________________________________________________________



// Funktion för att visa specifik camping
async function showSpecificCamping() {

  

  const specificCampingDiv = document.querySelector(".specificCampingDiv"); // Elementet där campinginformationen ska visas

  // const reviewsDiv = document.querySelector(".reviewsDiv"); //element för recensioner och betyg

  const urlParams = new URLSearchParams(window.location.search); // Hämtar parameter fårn urlen

  campingId = urlParams.get('id'); // Hämta id från URL

  // Anropa API för att hämta camping med ID
  let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getall&descriptions=camping&ids=" + campingId);

  const data = await response.json(); // Omvandla svaret till JSON

  if (data.payload.length > 0) {
    camping = data.payload[0]; // Hämta första (och enda) campingdata från svaret

    // Skapa och visa campinginformation på sidan
    specificCampingDiv.innerHTML =
      "<h3 class='campingtext'>" + camping.name + "</h3>" +
      "<p class='campingtext'> Campingen ligger i " + camping.city + "-" + camping.address + ".</p>" +
      "<p class='campingtext'> Priset ligger runt " + camping.price_range + " kr.</p>" +
      "<p class='campingtext'>" + camping.text + "</p>" +
      "<p> Betyget för " + camping.name + " är " + parseFloat(camping.rating).toFixed(1) + " av 5</p>" +
      "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>";

    //fetchReviews(campingId) // anrop av funktion för att hämta campingens recensioner





   

    lat = camping.lat; //latitud
    lng = camping.lng; //longitud

    initMap(camping.lat, camping.lng, camping.name); //anropar kartan och skickar med lat, lng och namn



    const restaurantBtn = document.querySelector("#showRestaurantsBtn"); //kanppen för att visa resturanger på kartan


    // Eventlyssnare för restaurangknappen
    restaurantBtn.addEventListener("click", function () {
      if (showRestaurants) {
        // Om restauranger redan visas ta bort markörer från kartan
        for (let i = 0; i < restaurantMarkers.length; i++) {
          myMap.removeLayer(restaurantMarkers[i]);
        }

        restaurantMarkers = []; // Töm arrayen med markörer
        restaurantBtn.classList.remove("active"); //tar bort css klassen
        showRestaurants = false; //flagga uppdateras
      } else { //om resturanger inte visas

        myMap.setView([lat, lng]);
        // flyttar kartan til cmapingens plats
        fetchRestaurants(camping.lat, camping.lng); //hämtar resturangern via smapi, lägger til markörer på kartan
        restaurantBtn.classList.add("active"); //css klass aktiveras
        showRestaurants = true;
      }
    });





    const natureBtn = document.querySelector("#natureReserveBtn"); //knapp till naturreservaten på kartan
    //eventlyssnare för naturreservatknappen
    natureBtn.addEventListener("click", function () {
      if (showNature) {
        //mom naturreservat visas ta bort makrörer
        for (let i = 0; i < natureMarkers.length; i++) {
          myMap.removeLayer(natureMarkers[i]);
        }
        natureMarkers = [];
        natureBtn.classList.remove("active");
        showNature = false;
      } else {

        myMap.setView([lat, lng]);
        //hämta naturresreat beroende på region, eftersom det inte fanns några i smpai på öland o i jönköping
        if (camping.province === "Öland") {
          fetchJSONNatureReserves("oland");
        } else if (camping.county === "Jönköpings län") {
          fetchJSONNatureReserves("jonkoping");
        } else {
          fetchNatureReserve(camping.lat, camping.lng);
        }
        natureBtn.classList.add("active");
        showNature = true;
      }
    });



    //golfbanor knappen till kartan
    const golfBtn = document.querySelector("#golfBtn");

    golfBtn.addEventListener("click", function () {
      if (showGolf) {
        for (let i = 0; i < golfMarkers.length; i++) {
          myMap.removeLayer(golfMarkers[i]);
        }
        golfMarkers = [];
        golfBtn.classList.remove("active");
        showGolf = false; //^^tar bort markörer o css klassen om golfbanor redan visas
      } else {
        myMap.setView([lat, lng]);
        fetchGolf(camping.lat, camping.lng);
        golfBtn.classList.add("active");
        showGolf = true; //lägger till markörer till kartan och css klassen om golbanor inte visas
      }
    });


    //svärdheter
    const attractionBtn = document.querySelector("#attractionBtn");

    attractionBtn.addEventListener("click", function () {
      if (showAttractions) {
        for (let i = 0; i < attractionMarkers.length; i++) {
          myMap.removeLayer(attractionMarkers[i]);
        }
        attractionMarkers = [];
        attractionBtn.classList.remove("active");
        showAttractions = false;
        //ta bort markörer om de redan visas
      } else {
        myMap.setView([lat, lng]);
        fetchAttraction(camping.lat, camping.lng);
        attractionBtn.classList.add("active");
        showAttractions = true;
      } //lägg itll markörer om de inte redan visas
    });

   







    fetchWeather(camping.lat, camping.lng, camping.city); //anropar funktion för att visa väderprognosen, skickar med lat och lng


    
        fetchReviews(camping.id, camping.name); // Anropa funktionen och skicka in campingens id
      


  }
  
  //hideLoader();

}
//slut showSpecificCamping
// _______________________________________________________________________________________________


//kart funktion
function initMap(lat, lng, name) { //lat lng och cmapingens namn
  const zoom = 7; //zoom

  // Skapa kartan
  myMap = L.map("map").setView([lat, lng], zoom); //centrerar kartan på cmapingens plats

  //OpenStreetMap tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap);

  // Campingikon
  const campingIcon = L.icon({
    iconUrl: "../img/tältikonkarta4.svg",
    iconSize: [40, 40], //markör stolek
    iconAnchor: [20, 40], //markör plats
    popupAnchor: [0, -40] //popuprutans plats (i förhållande till ikonen)
  });

  // Lägg till campingmarkör med ikonem
  let marker = L.marker([lat, lng], { icon: campingIcon }).bindPopup(name); //visas cmapingens namn
  myMarkers.push(marker); //lägger till markörern i arrayen
  marker.addTo(myMap); //lägger till markör på kartan

  // Ikon för användarens plats
  const mypositionIcon = L.icon({
    iconUrl: "../img/myplacemap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showUserPosition, showError);
  } //om användaren tillåder platsdelning

  function showUserPosition(pos) {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;
    //hämtar anvädnarens lat och lng

    //lägger till markören och popup
    L.marker([userLat, userLng], { icon: mypositionIcon })
      .addTo(myMap)
      .bindPopup("Du är här")
      .openPopup();
  }

  function showError(error) {
    console.warn("Fel vid hämtning av plats:", error);
  } //om plats ej kan hämtas..
}
//Slut initMap
//_______________________________________________________________________________________________



//funktion för att hämta resturanger i närheter
async function fetchRestaurants(lat, lng) {
  displayLoader(); //laddningsikon visas
  

  async function requestRestaurantData(radius) {
    const url = "https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey +
      "&controller=establishment&method=getfromlatlng&lat=" + lat + "&lng=" + lng + "&radius=" + radius + "&descriptions=restaurang";
    const response = await fetch(url);
    
    return await response.json(); //gör om till json
  } //hämtar smapi och söker resturanger inom raidus

  for (let i = 0; i < restaurantMarkers.length; i++) {
    myMap.removeLayer(restaurantMarkers[i]);
  } //rensar gammal markörer
  restaurantMarkers = []; //tömmer arrayen

  //hämtar resturanger med olika raidus och stoppar när den hittat resturander 
  let data = await tryFetchWithExpandingRadius(requestRestaurantData);
  if (data.payload.length === 0) {
    alert("Inga restauranger hittades inom 70 km.");
    hideLoader();
    return; //om ingen data hittas visas felmedelande
  }

  /*
  let filtered = filterByProvinceOrCity(data.payload);

  // Visa filtrerade om det finns, annars visa allt
  if (filtered.length > 0) {
    data.payload = filtered;
  } else {
    console.warn("Inga resultat efter filter – visar allt som hämtats istället.");
  }
    */

  let restaurantIcon = L.icon({
    iconUrl: "../img/restaurantsmap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }); //ikon för resturanger

  //lägger in resturanger på kartan
  for (let i = 0; i < data.payload.length; i++) {
    let rest = data.payload[i];
    let btnId = "readMoreRestaurant_" + i; //läs mer knapp

    let popupContent = rest.name + "<br>" +
      rest.distance_in_km.toFixed(1) + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>"; //visas namn och avstånd i ppopuprutan

    //lägger itll markörer på kartan
    let marker = L.marker([parseFloat(rest.lat), parseFloat(rest.lng)], {
      title: rest.name,
      icon: restaurantIcon
    }).bindPopup(popupContent);
    marker.addTo(myMap);
    restaurantMarkers.push(marker);  //soarar marköerer i resturantMArkers

    //öppnad modalrutan med mer info
    marker.on("popupopen", function () {
      setTimeout(function () {
        let btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: rest.name,
              rating: rest.rating,
              price: rest.price_range,
              website: rest.website,
              address: rest.address
            });
          });
        }
      }, 0);
    });
  }

  hideLoader();
}
//Slut fetchRestaurants
//_______________________________________________________________________________________________


function displayLoader() {
  loaderTimeout = setTimeout(function () {
    document.querySelector("#mapoverlay").style.visibility = "visible";
    document.querySelector("#map").style.filter = "blur(2px)";
    loaderVisible = true;
  }, 500);

  //väntar en hlav sekund innna n lodaern visas, visar på kartan, gör kartan suddig medanst loadern visas, flagga för att kotrollera att loadern visas
}

function hideLoader() {
  clearTimeout(loaderTimeout);
  if (loaderVisible) {
    document.querySelector("#mapoverlay").style.visibility = "hidden";
    document.querySelector("#map").style.filter = "none";
    loaderVisible = false;
  }

  //avbryter om displayloader inte visats, tar bort suddet, döljer spinnerns, uppdaterar flaggan..
}


//funktion för att hämta golfbanor i staden som campingen ligger i 
async function fetchGolf(lat, lng) {
  
  displayLoader();

  // Hjälpfunktion för att göra själva anropet
  async function requestGolfData(radius) {
    const url = "https://smapi.lnu.se/api/?api_key=" + APIkey +
      "&controller=establishment&method=getfromlatlng" +
      "&lat=" + lat + "&lng=" + lng +
      "&descriptions=golfbana&radius=" + radius;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } //skapar urlen och hämtar data, returenerar det som json

  // Rensa gamla markörer
  for (let marker of golfMarkers) {
    myMap.removeLayer(marker);
  }
  golfMarkers = [];

  // hämtar golfbanor me ökande radie om inget hittas
  let data = await tryFetchWithExpandingRadius(requestGolfData);
  if (data.payload.length === 0) {
    alert("Inga restauranger hittades inom" + radius + " km.");
    hideLoader();
    return;
  }
 


  const golfIcon = L.icon({
    iconUrl: "../img/golfmap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }); //ikonen


  //loopar igenom golfbanorna
  for (let i = 0; i < data.payload.length; i++) {
    const golf = data.payload[i];
    const name = golf.name
    const distance = golf.distance_in_km.toFixed(1)


    const btnId = "readMoreBtn_" + i;
    const popupContent = name + "<br>" + distance + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>"; //popupinnehåll

    const marker = L.marker([parseFloat(golf.lat), parseFloat(golf.lng)], {
      title: golf.name,
      icon: golfIcon
    }).bindPopup(popupContent); //lägger till

    marker.addTo(myMap); //lägger till på kartan
    golfMarkers.push(marker); //och in i listan


    //modalen
    marker.on("popupopen", function () {
      setTimeout(function () {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: golf.name,
              website: golf.website,
              rating: golf.rating,
              address: golf.address,
              price: golf.price_range

            }); // skicka datan direkt
          });
        }
      }, 0); // vänta tills popupen finns i DOM:en
    });
  }

  hideLoader();
}


//hämtar väder
async function fetchWeather(lat, lng, city) { //stadens namn används för att länka till smhi

  displayLoader();

  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng + "&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"; //api anrop till open meteo

  try {
    const response = await fetch(url);
    const data = await response.json();
    //hämtar och omvandlar till json

    const dates = data.daily.time;
    const tempsMax = data.daily.temperature_2m_max;
    const tempsMin = data.daily.temperature_2m_min;
    let html = "<div class='weatherDiv'>"; //gär ska innehållet liga
    const weatherCodes = data.daily.weathercode;
    //hämtar daturm, max temp, min temp coch väderkoder

    //loopar igenom dagarna 
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const day = date.toLocaleDateString("sv-SE", { day: 'numeric', month: 'numeric' });
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      //omvandlar daturmet till veckodag dag/månad

      const icon = getWeatherIcon(weatherCodes[i]); //hämta ikon baserat på äderkoden

      // Skapa URL till SMHI
      const smhiURL = "https://www.smhi.se/vader/prognoser-och-varningar/vaderprognos/q/" + encodeURIComponent(city); //länk til smhi för att läsa mer om vädret

      html += "<a href='" + smhiURL + "' target='_blank' class='weatherbox'>" +
        day + "<br>" + capitalizedWeekday + "<br>" +
        "<img src='" + icon.src + "' alt='" + icon.alt + "' class='weathericon'><br>" + tempsMin[i] + "°C – " + tempsMax[i] + "°C</a>";
    } //lägger in i html för varje dag

    html += "</div>";
    document.querySelector(".weatherDiv").innerHTML = html;
    //lägger in i divven

  } catch (error) {
    console.error("Kunde inte hämta väderdata:", error);
    document.querySelector(".weatherDiv").innerHTML = "Kunde inte hämta väderdata.";
  } //om apiet inte funkar

  hideLoader();
}
//Slut fetchWeather
//---------------------------------------------------


//väder koder för att visa rätt bild
function getWeatherIcon(code) {
  if (code === 0) {
    return { src: "../img/solvej.svg", alt: "Soligt" };
  } else if (code >= 1 && code <= 3) {
    return { src: "../img/Solmolnanvända.svg", alt: "Delvis molnigt" };
  } else if (code === 45 || code === 48) {
    return { src: "../img/dimma.svg", alt: "Dimma" };
  } else if (code >= 51 && code <= 67) {
    return { src: "../img/literegn.svg", alt: "Regnigt" };
  } else if (code >= 71 && code <= 77) {
    return { src: "../img/snö.svg", alt: "Snöfall" };
  } else if (code >= 80 && code <= 82) {
    return { src: "../img/regnmolnigtanvändenna.svg", alt: "Regnskurar" };
  } else if (code >= 95 && code <= 99) {
    return { src: "../img/åskamoln.svg", alt: "Åska" };
  } else {
    return { src: "../img/molnigtljusmoln.svg", alt: "Okänt väder" };
  }
}



async function fetchNatureReserve(lat, lng) {
  
  displayLoader();

  // inre hjälpfunktion för att göra själva API-anropet
  async function requestNatureData(radius) {
    const url = "https://smapi.lnu.se/api/?api_key=" + APIkey +
      "&controller=establishment&method=getfromlatlng" +
      "&lat=" + lat + "&lng=" + lng +
      "&descriptions=naturreservat&radius=" + radius;

    const response = await fetch(url);


    
    return await response.json();


  } //hämtar från smapi och returnerar som json

  // Rensa gamla markörer
  for (let marker of natureMarkers) {
    myMap.removeLayer(marker);
  }
  natureMarkers = [];

  // Försök med växande radier
  let data = await tryFetchWithExpandingRadius(requestNatureData);
  if (data.payload.length === 0) {
    alert("Inga naturreservat hittades inom 100 km.");
    hideLoader();
    return; //om inget hittas
  }

  const natureIcon = L.icon({
    iconUrl: "../img/naturemap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  }); //ikon

  //loopar igenom alla restervat
  for (let i = 0; i < data.payload.length; i++) {
    const reserve = data.payload[i];
    const btnId = "readMoreNature_" + i;

    const popupContent = reserve.name + "<br>" +
      reserve.distance_in_km.toFixed(1) + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>";

    const marker = L.marker([parseFloat(reserve.lat), parseFloat(reserve.lng)], {
      title: reserve.name,
      icon: natureIcon
    }).bindPopup(popupContent);

    marker.addTo(myMap);
    natureMarkers.push(marker);


    //modalen
    marker.on("popupopen", function () {
      setTimeout(function () {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: reserve.name,
              rating: reserve.rating,
              price: reserve.price_range,
              website: reserve.website,
              address: reserve.address,
              abstract: reserve.abstract
            });
          });
        }
      }, 0);
    });
  }

  hideLoader();
}





//hämtar naturreservaten i json filen, refion key är öland eller jönkloubg
async function fetchJSONNatureReserves(regionKey) {


  try {
    const response = await fetch("../json/naturereserve.json"); //hämtar
    const data = await response.json(); //json

    if (!data[regionKey]) {
      console.warn("Ingen data hittades för:", regionKey);
      return; //kollar om regionen finns
    }

    //loopar med olika radier för att hitta ett reservat nära
    const reserves = data[regionKey];
    const searchRadii = [15, 30, 50, 70, 100]; // växande radier
    let nearbyReserves = [];

    for (let r = 0; r < searchRadii.length; r++) {
      const radius = searchRadii[r];
      nearbyReserves = []; // nollställ innan varje försök

      for (let i = 0; i < reserves.length; i++) {
        const res = reserves[i];
        const distance = getDistanceFromLatLng(lat, lng, res.lat, res.lng);
        if (distance <= radius) {
          res.distance = distance;
          nearbyReserves.push(res);
        }
      }

      if (nearbyReserves.length > 0) {
       
        break; // Avbryt loopen om vi har resultat
      }
    }

    if (nearbyReserves.length === 0) {
      alert("Inga naturreservat hittades inom 100 km.");
      hideLoader();
      return; //om inga hittas
    }


    


    // Rensa gamla markörer
    for (let i = 0; i < natureMarkers.length; i++) {
      myMap.removeLayer(natureMarkers[i]);
    }
    natureMarkers = [];

    const customIcon = L.icon({
      iconUrl: "../img/naturemap.svg",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }); //ikonen

    //lägger till markörer på kartan
    for (let i = 0; i < nearbyReserves.length; i++) {
      const r = nearbyReserves[i];
      const btnId = "readMoreNatureJson_" + i;

      const popupText = "<p>" + r.name + "</p>" +
        "<p>" + r.distance.toFixed(1) + " km från campingen</p>" +
        "<button id='" + btnId + "'>Läs mer</button>";

      const marker = L.marker([r.lat, r.lng], {
        icon: customIcon,
        title: r.name
      }).bindPopup(popupText);

      marker.addTo(myMap);
      natureMarkers.push(marker);

      //popupens läs mer knapp (öppnar modal=)
      marker.on("popupopen", function () {
        setTimeout(function () {
          const btn = document.getElementById(btnId);
          if (btn) {
            btn.addEventListener("click", function () {
              openInfoModal({
                name: r.name,
                rating: r.rating,
                price: r.price,
                website: r.website
              });
            });
          }
        }, 0);
      });
    }

  } catch (error) {
    console.error("Kunde inte hämta lokala naturreservat från JSON:", error);
  }

  hideLoader();
}
//Slut fetchNatureReserve
//------------------------------------------



//functioner för att räkna ut asvåndet fårn campingen till ntaurreservaten som finns i json
function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
  const R = 6371; // jordens radie i km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * Math.PI / 180;
}



// testa flera radier tills data hittas så att det alltid finns nått
async function tryFetchWithExpandingRadius(fetchFunction) {

  const radies = [15, 20, 30, 40, 50, 70, 100]; //lista med raider som ska testas 

  //gpr ifnom varje radie i listan till nått hittas
  for (let i = 0; i < radies.length; i++) {
    const radie = radies[i];
    const resultat = await fetchFunction(radie); //skickr med radien, anropar fetchFunktion, alltså den funktion som hämtar kartgrejen
    

    if (resultat.payload.length > 0) {
     
      return resultat;  //avbryt när något hittas
    }
  }

  return { payload: [] }; //om inget hitas
}








//funktion för att hämta sevärdheter i närheten av campingen 
async function fetchAttraction(lat, lng) {
  
  displayLoader();

  //inre hjälpfunktion för api anropet
  async function requestAttractionData(radius) {
    const url = "https://smapi.lnu.se/api/?api_key=" + APIkey +
      "&controller=establishment&method=getfromlatlng&lat=" + lat + "&lng=" + lng +
      "&radius=" + radius + "&descriptions=museum,slott,sevärdhet,ateljé,konsthall,konstgalleri,kyrka";
    const response = await fetch(url);
    return await response.json();
    //hämtar spit och gör til json objekt
  }

  // Rensa gamla markörer
  for (let marker of attractionMarkers) {
    myMap.removeLayer(marker);
  }
  attractionMarkers = [];

  //testar med ökande radier
  let data = await tryFetchWithExpandingRadius(requestAttractionData);
  if (data.payload.length === 0) {
    alert("Inga sevärdheter hittades inom 70 km.");
    hideLoader();
    return;
  }
 

  //loopar igenom alla sevärdheter som hämtats
  for (let i = 0; i < data.payload.length; i++) {
    let attraction = data.payload[i];
    let btnId = "readMoreAttraction_" + i; //läsmerknapp
   
    let iconUrl = "../img/användbinocuallrs4.svg"; // standardikon för sevärdhet
    const desc = attraction.description.toLowerCase();

    if (desc.includes("museum")) {
      iconUrl = "../img/museumkarta.svg";
    } else if (desc.includes("slott")) {
      iconUrl = "../img/slottkarta.svg";
    }
    else if (desc.includes("kyrka")) {
      iconUrl = "../img/churchmap.svg"
    }
    else if (
      desc.includes("atelje") ||
      desc.includes("ateljé") || // med accent
      desc.includes("konsthall") ||
      desc.includes("konstgalleri")
    ) {
      iconUrl = "../img/artmap.svg";
    }

    let customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }); //ikonen

    let popupContent = attraction.name + "<br>" +
      attraction.distance_in_km.toFixed(1) + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>"; //popup info

    //skapra markörer och popupen
    let marker = L.marker([parseFloat(attraction.lat), parseFloat(attraction.lng)], {
      title: attraction.name,
      icon: customIcon
    }).bindPopup(popupContent);

    //ägger oiin på kartan och i arraien 
    marker.addTo(myMap);
    attractionMarkers.push(marker);


    //modalen
    marker.on("popupopen", function () {
      setTimeout(function () {
        let btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: attraction.name,
              rating: attraction.rating,
              price: attraction.price_range,
              website: attraction.website,
              address: attraction.address,
              abstract: attraction.abstract
            });
          });
        }
      }, 0);
    });
  }

  hideLoader();
}





//funktion för att vis amer information till kartmarkörerna
function openInfoModal(data) {
  const modal = document.querySelector("#infoModal"); //modalen
  const titleEl = document.querySelector("#modalTitle"); //titeln
  const contentEl = document.querySelector("#modalContent"); //innehållet

  titleEl.textContent = data.name || "Namn saknas";

  let infoText = "Mer information om " + data.name + ": <br>";

  if (data.rating) {
    infoText += " Betyg: " + parseFloat(data.rating).toFixed(1) + " av 5. <br>"; //lägger in betyget om de finns
  }

  if (data.price) {
    infoText += "Priset ligger runt " + data.price + " kr. <br>" //lägger in pris om de finns
  }

  if (data.address) {
    infoText += "Adressen är " + data.address + "<br>"
  } //adress

  if (data.abstract) {
    infoText += data.abstract + "<br>"
  } //abstract



  if (data.website) {

    infoText += "<a href='" + data.website + "' target='_blank'>Besök webbplats</a><br>";
  } //websiada

  contentEl.innerHTML = infoText; ///lägger in infin

  modal.showModal();
}








//funktion för att visa cmapingens recensioner
async function fetchReviews(campingId, name) {
 

  let reviewsDiv = document.querySelector(".reviewsDiv"); //hämtar elemenet där recensionerna ska visas

  // Hämta recensioner från SMAPI
  let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getReviews&id=" + campingId); //anropar smapi o hämtar recensioner med urlen




  const reviewsData = await response.json(); // Konvertera till JSON objekt

  

  if (reviewsData.payload.length > 0) { //kollar om det finns recensioner
    // Visa alla recensioner
    reviewsDiv.innerHTML += "<h3>Recensioner:</h3>";

    for (let i = 0; i < reviewsData.payload.length; i++) {
      const review = reviewsData.payload[i];


      

      reviewsDiv.innerHTML += "<div class='review'>" +

        "<p> - " + review.comment + "</p>" +
        "</div><hr>";
    }


  } else {
    reviewsDiv.innerHTML += "<p>Det finns inga recensioner för " + name + " </p>";
  }
} 