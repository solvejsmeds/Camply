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

  console.log("visa cmpingen")

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
      "<p> Betyget för " + camping.name + " är " + parseFloat(camping.rating).toFixed(1) + " av 5</p>" +
      "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>";

    //fetchReviews(campingId) // anrop av funktion för att hämta campingens recensioner





    console.log("campinglat: ", camping.lat, ", cmapinglng: ", camping.lng);

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
        // Töm arrayen och uppdatera flaggan
        restaurantMarkers = [];
        restaurantBtn.classList.remove("active");
        showRestaurants = false;
      } else {
        // Om restauranger inte visas hämta nya data och visa markörer
        fetchRestaurants(camping.lat, camping.lng);
        restaurantBtn.classList.add("active");
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
    

    const golfBtn = document.querySelector("#golfBtn");

golfBtn.addEventListener("click", function () {
  if (showGolf) {
    for (let i = 0; i < golfMarkers.length; i++) {
      myMap.removeLayer(golfMarkers[i]);
    }
    golfMarkers = [];
    golfBtn.classList.remove("active");
    showGolf = false;
  } else {
    fetchGolf(camping.lat, camping.lng);
    golfBtn.classList.add("active");
    showGolf = true;
  }
});
    
const attractionBtn = document.querySelector("#attractionBtn");

attractionBtn.addEventListener("click", function () {
  if (showAttractions) {
    for (let i = 0; i < attractionMarkers.length; i++) {
      myMap.removeLayer(attractionMarkers[i]);
    }
    attractionMarkers = [];
    attractionBtn.classList.remove("active");
    showAttractions = false;
  } else {
    fetchAttraction(camping.lat, camping.lng);
    attractionBtn.classList.add("active");
    showAttractions = true;
  }
});

/*
    document.querySelector("#natureReserveBtn").addEventListener("click", function () {
      if (camping.province === "Öland") {
        fetchJSONNatureReserves("oland");
      }
      else if (camping.county === "Jönköpings län") {
        fetchJSONNatureReserves("jonkoping")
      }
      else {
        fetchNatureReserve(camping.lat, camping.lng);
      }
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på

    document.querySelector("#golfBtn").addEventListener("click", function () {
      fetchGolf(camping.lat, camping.lng);
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på


    document.querySelector("#attractionBtn").addEventListener("click", function () {
      fetchAttraction(camping.lat, camping.lng);
    }); //anropar funktion för att hämta resturanger när resturang knappen klickas på

    */

    

    console.log(camping.county)



    fetchWeather(camping.lat, camping.lng, camping.city); //anropar funktion för att visa väderprognosen, skickar med lat och lng

   

    fetchReviews(camping.id, camping.name); // Anropa funktionen och skicka in campingens id
    


  }
console.log("visas cmapingen nu?")
  //hideLoader();

}
//slut showSpecificCamping
// _______________________________________________________________________________________________


//kart funktion
function initMap(lat, lng, name) {
  const zoom = 7;

  // Skapa kartan
  myMap = L.map("map").setView([lat, lng], zoom);

  //OpenStreetMap tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap);

  // Campingikon
  const campingIcon = L.icon({
    iconUrl: "../img/tältikonkarta4.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // Lägg till campingmarkör med ikonem
  let marker = L.marker([lat, lng], { icon: campingIcon }).bindPopup(name);
  myMarkers.push(marker);
  marker.addTo(myMap);

  // Ikon för användarens plats
  const mypositionIcon = L.icon({
    iconUrl: "../img/myplacemap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showUserPosition, showError);
  }

  function showUserPosition(pos) {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    L.marker([userLat, userLng], { icon: mypositionIcon })
      .addTo(myMap)
      .bindPopup("Du är här")
      .openPopup();
  }

  function showError(error) {
    console.warn("Fel vid hämtning av plats:", error);
  }
}
//Slut initMap
//_______________________________________________________________________________________________



//funktion för att hämta resturanger i närheter
async function fetchRestaurants(lat, lng) {
  displayLoader();
  console.log("Restaurangfunktion startar...");

  async function requestRestaurantData(radius) {
    const url = "https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey +
      "&controller=establishment&method=getfromlatlng&lat=" + lat + "&lng=" + lng + "&radius=" + radius + "&descriptions=restaurang";
    const response = await fetch(url);
    return await response.json();
  }

  for (let i = 0; i < restaurantMarkers.length; i++) {
    myMap.removeLayer(restaurantMarkers[i]);
  }
  restaurantMarkers = [];

  let data = await requestRestaurantData(15);

  if (data.payload.length === 0) {
    console.log("Inga restauranger inom 15 km – försöker med 30 km...");
    data = await requestRestaurantData(30);

    if (data.payload.length === 0) {
      console.log("Inga restauranger inom 30 km – försöker med 50 km...");
      data = await requestRestaurantData(50);

      if (data.payload.length === 0) {
        alert("Inga restauranger hittades inom 50 km.");
        hideLoader();
        return;
      }
    }
  }

  let restaurantIcon = L.icon({
    iconUrl: "../img/restaurantsmap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  for (let i = 0; i < data.payload.length; i++) {
    let rest = data.payload[i];
    let btnId = "readMoreRestaurant_" + i;

    let popupContent = rest.name + "<br>" +
      rest.distance_in_km.toFixed(1) + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>";

    let marker = L.marker([parseFloat(rest.lat), parseFloat(rest.lng)], {
      title: rest.name,
      icon: restaurantIcon
    }).bindPopup(popupContent);

    marker.addTo(myMap);
    restaurantMarkers.push(marker);

    marker.on("popupopen", function () {
      setTimeout(function () {
        let btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: rest.name,
              rating: rest.rating,
              price: rest.price_range,
              website: rest.website
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
/*
function hideLoader() {
  document.querySelector("#mapoverlay").style.visibility = "hidden"

  document.querySelector("#map").style.filter = "none"
}

function displayLoader() {
  document.querySelector("#mapoverlay").style.visibility = "visible"

  document.querySelector("#map").style.filter = "blur(3px)"
}
  */

function displayLoader() {
  loaderTimeout = setTimeout(function () {
    document.querySelector("#mapoverlay").style.visibility = "visible";
    document.querySelector("#map").style.filter = "blur(2px)";
    loaderVisible = true;
  }, 500);
}

function hideLoader() {
  clearTimeout(loaderTimeout);
  if (loaderVisible) {
    document.querySelector("#mapoverlay").style.visibility = "hidden";
    document.querySelector("#map").style.filter = "none";
    loaderVisible = false;
  }
}


//funktion för att hämta golfbanor i staden som campingen ligger i 
async function fetchGolf(lat, lng) {
  console.log("Golf!! :)");
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
  }

  // Rensa gamla markörer
  for (let marker of golfMarkers) {
    myMap.removeLayer(marker);
  }
  golfMarkers = [];

  // Försök först med 15 km
  let data = await requestGolfData(15);

  // Om inga golfbanor hittas – försök igen med 30 km
  if (data.payload.length === 0) {
    console.log("Inga golfbanor inom 15 km – försöker med 30 km...");
    data = await requestGolfData(30);

    if (data.payload.length === 0) {
      console.log ("inga golfbanor inom 30km")
      data = await requestGolfData(50)
    }
    
    if (data.payload.length === 0) {
      alert("inga golfbanot inom 50 km hitades :(")
      return;
    }
    

  }

  console.log("golf", data);

  const golfIcon = L.icon({
    iconUrl: "../img/golfmap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  for (let i = 0; i < data.payload.length; i++) {
    const golf = data.payload[i];
    const name = golf.name
    const distance = golf.distance_in_km.toFixed(1)

    const btnId = "readMoreBtn_" + i;
    const popupContent = name + "<br>" + distance + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>";

    const marker = L.marker([parseFloat(golf.lat), parseFloat(golf.lng)], {
      title: golf.name,
      icon: golfIcon
    }).bindPopup(popupContent);

    marker.addTo(myMap);
    golfMarkers.push(marker);

    marker.on("popupopen", function () {
      setTimeout(function () {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: golf.name,
              website: golf.website,
              rating: golf.rating,
              price: golf.price_range
          }); // skicka datan direkt
          });
        }
      }, 0); // vänta tills popupen finns i DOM:en
    });
  }

  hideLoader();
}

async function fetchWeather(lat, lng, city) {

displayLoader();

  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lng + "&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const dates = data.daily.time;
    const tempsMax = data.daily.temperature_2m_max;
    const tempsMin = data.daily.temperature_2m_min;

    let html = "<div class='weatherDiv'>";

    const weatherCodes = data.daily.weathercode;

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const day = date.toLocaleDateString("sv-SE", { day: 'numeric', month: 'numeric' });
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

      const icon = getWeatherIcon(weatherCodes[i]);

      // Skapa URL till SMHI
      const smhiURL = "https://www.smhi.se/vader/prognoser-och-varningar/vaderprognos/q/" + encodeURIComponent(city);

      html += "<a href='" + smhiURL + "' target='_blank' class='weatherbox'>" +
        day + "<br>" + capitalizedWeekday + "<br>" +
        "<img src='" + icon.src + "' alt='" + icon.alt + "' class='weathericon'><br>" + tempsMin[i] + "°C – " + tempsMax[i] + "°C</a>";
    }

    html += "</div>";
    document.querySelector(".weatherDiv").innerHTML = html;

  } catch (error) {
    console.error("Kunde inte hämta väderdata:", error);
    document.querySelector(".weatherDiv").innerHTML = "Kunde inte hämta väderdata.";
  }

  hideLoader();
}
//Slut fetchWeather
//---------------------------------------------------


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
    return { src: "../img/camply.svg", alt: "Snöfall" };
  } else if (code >= 80 && code <= 82) {
    return { src: "../img/regnmolnigtanvändenna.svg", alt: "Regnskurar" };
  } else if (code >= 95 && code <= 99) {
    return { src: "../img/camply.svg", alt: "Åska" };
  } else {
    return { src: "../img/camply.svg", alt: "Okänt väder" };
  }
}



async function fetchNatureReserve(lat, lng) {

  displayLoader();
  console.log("Naturreservatfunktion startar...");

  async function requestNatureData(radius) {
    const url = "https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey +
      "&controller=establishment&method=getfromlatlng&lat=" + lat + "&lng=" + lng +
      "&descriptions=Naturreservat&radius=" + radius;
    const response = await fetch(url);
    return await response.json();
  }

  for (let i = 0; i < natureMarkers.length; i++) {
    myMap.removeLayer(natureMarkers[i]);
  }
  natureMarkers = [];

  let data = await requestNatureData(15);

  if (data.payload.length === 0) {
    console.log("Inga naturreservat inom 15 km – försöker med 30 km...");
    data = await requestNatureData(30);

    if (data.payload.length === 0) {
      console.log("Inga naturreservat inom 30 km – försöker med 50 km...");
      data = await requestNatureData(50);

      if (data.payload.length === 0) {
        alert("Inga naturreservat hittades inom 50 km.");
        hideLoader();
        return;
      }
    }
  }

  let naturereserveIcon = L.icon({
    iconUrl: "../img/naturemap.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  for (let i = 0; i < data.payload.length; i++) {
    let nature = data.payload[i];
    let btnId = "readMoreNature_" + i;

    let popupContent = nature.name + "<br>" +
      nature.distance_in_km.toFixed(1) + " km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>";

    let marker = L.marker([parseFloat(nature.lat), parseFloat(nature.lng)], {
      title: nature.name,
      icon: naturereserveIcon
    }).bindPopup(popupContent);

    marker.addTo(myMap);
    natureMarkers.push(marker);

    marker.on("popupopen", function () {
      setTimeout(function () {
        let btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: nature.name,
              website: nature.website,
              rating: nature.rating,
              price: nature.price_range
            });
          });
        }
      }, 0);
    });
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


//funktion för att hämta naturreservat från json filen med naturreservat på öland
async function fetchJSONNatureReserves(regionKey) {
  console.log("Visar naturreservat inom 15 km för:", regionKey);

  try {
    const response = await fetch("../json/naturereserve.json");
    const data = await response.json();

    if (!data[regionKey]) {
      console.warn("Ingen data hittades för:", regionKey);
      return;
    }

    let reserves = data[regionKey];
    let nearbyReserves = [];

    // Filtrera ut reservat som ligger inom 15 km
    for (let i = 0; i < reserves.length; i++) {
      let reserve = reserves[i];
      let distance = getDistanceFromLatLng(lat, lng, reserve.lat, reserve.lng);
      if (distance <= 30) {
        reserve.distance = distance;
        nearbyReserves.push(reserve);
      }
    }

    if (nearbyReserves.length === 0) {
      alert("Inga naturreservat inom 30 km.");
      return;
    }

    // Rensa gamla markörer
    for (let marker of natureMarkers) {
      myMap.removeLayer(marker);
    }
    natureMarkers = [];

    let customIcon = L.icon({
      iconUrl: "../img/naturemap.svg",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Lägg till nya markörer för närliggande reservat
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
}





//funktion för att hämta golfbanor i staden som campingen ligger i 
async function fetchAttraction(lat, lng) {
  console.log("Hämtar sevärdheter...");

  displayLoader();

  // 1. Hämta sevärdheter från "attraction"-API:t
  async function requestAttractionData(radius) {
    const url = "https://smapi.lnu.se/api/?api_key=" + APIkey +
      "&controller=attraction&method=getfromlatlng" +
      "&lat=" + lat + "&lng=" + lng +
      "&descriptions=museum,slott,sevärdhet&radius=" + radius;

    const response = await fetch(url);
    return await response.json();
  }

  // 2. Hämta website + abstract från "establishment"-API:t
  async function fetchAttractionExtraData(ids) {
    const url = "https://smapi.lnu.se/api/?api_key=" + APIkey +
      "&controller=establishment&method=getall&ids=" + ids.join(",");

    const response = await fetch(url);
    const data = await response.json();

    let result = {};
    for (let i = 0; i < data.payload.length; i++) {
      let item = data.payload[i];
      result[item.id] = {
        website: item.website,
        abstract: item.abstract,
        

      };
    }

    return result;
  }

  // Rensa gamla markörer
  for (let j = 0; j < attractionMarkers.length; j++) {
    myMap.removeLayer(attractionMarkers[j]);
  }
  attractionMarkers = [];

  // Försök först med 15 km, sedan 30 och 50 km om inget hittas
  let data = await requestAttractionData(15);
  if (data.payload.length === 0) {
    data = await requestAttractionData(30);
    if (data.payload.length === 0) {
      data = await requestAttractionData(50);
      if (data.payload.length === 0) {
        alert("Inga sevärdheter hittades inom 50 km.");
        return;
      }
    }
  }

  // Hämta extra info (website och abstract)
  let ids = [];
  for (let i = 0; i < data.payload.length; i++) {
    ids.push(data.payload[i].id);
  }
  let extraInfo = await fetchAttractionExtraData(ids);

  // Gå igenom varje sevärdhet
  for (let i = 0; i < data.payload.length; i++) {
    let attraction = data.payload[i];
    let name = attraction.name;
    let description = attraction.description.toLowerCase();
    let distance = attraction.distance_in_km.toFixed(1);
    let btnId = "readMoreAttraction_" + i;

    let info = extraInfo[attraction.id] || {};
    let website = info.website || null;
    let abstract = info.abstract || null;

    // Välj ikon baserat på typ
    let iconUrl = "../img/användbinocuallrs4.svg"; // default: sevärdhet
    if (description.includes("museum")) {
      iconUrl = "../img/museumkarta.svg";
    } else if (description.includes("slott")) {
      iconUrl = "../img/slottkarta.svg";
    }

    let customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    let popupContent = name + "<br>" + distance + "km från campingen<br>" +
      "<button id='" + btnId + "'>Läs mer</button>";

    let marker = L.marker([parseFloat(attraction.lat), parseFloat(attraction.lng)], {
      title: name,
      icon: customIcon
    }).bindPopup(popupContent);

    marker.addTo(myMap);
    attractionMarkers.push(marker);

    // Klick på "Läs mer"
    marker.on("popupopen", function () {
      setTimeout(function () {
        let btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener("click", function () {
            openInfoModal({
              name: name,
              rating: attraction.rating,
              website: website,
              abstract: abstract,
              price: info.price
            });
          });
        }
      }, 0);
    });
  }

  hideLoader()
}





//funktion för att vis amer information till kartmarkörerna
function openInfoModal(data) {
  const modal = document.querySelector("#infoModal");
  const titleEl = document.querySelector("#modalTitle");
  const contentEl = document.querySelector("#modalContent");

  titleEl.textContent = data.name || "Namn saknas";

  let infoText = "Mer information om " + (data.name || "detta ställe") + ": <br>";

  if (data.rating) {
    infoText += " Betyg: " + parseFloat(data.rating).toFixed(1) + " av 5. <br>";
  }
  /*
  if (data.dinnerprice) {
    infoText += "Priset för middag ligger runt " + data.dinnerprice + " kr. <br>"
  }
  if (data.lunchprice) {
    infoText += "Priset för lunch ligger runt " + data.lunchprice + " kr. <br>"
  }*/
if (data.price) {
   infoText += "Priset ligger runt " + data.price + " kr. <br>"
}

if (data.abstract) {
  infoText +=  data.abstract + "<br>"
}


  if (data.website) {
    
    infoText += "<a href='" + data.website +"' target='_blank'>Besök webbplats</a><br>";
  }

  contentEl.innerHTML = infoText;

  modal.showModal();
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