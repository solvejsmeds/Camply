
const APIkey = "R7PGDNjZ" //api nyckel till SMAPI

let allCampings = []; //sparar alla cmapingar globalt

const positionIds = { //id för campingarna uppdelade i kategorier för olika lägen

  lake: [ //sjö
    659, 658, 657, 656, 655, 616, 615, 614, 613, 612, 611, 610, 609, 607, 606, 605, 604, 603, 602, 601, 600, 307, 305, 608, 303, 301, 286, 285, 281, 280, 275, 273, 246, 245, 244, 239
  ],
  forest: [ //skog
    659, 658, 657, 656, 655, 616, 615, 614, 613, 612, 611, 610, 609, 607, 606, 605, 604, 603, 602, 601, 600, 307, 305, 608, 303, 201, 202, 301, 286, 285, 281, 280, 277, 275, 273, 246, 245, 244, 243, 242, 241, 216, 217, 218, 219, 220, 238, 237
  ],

  sea: [ //hav
    170, 173, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 197, 198, 200, 201, 202, 205, 207, 209, 210, 211, 215, 277, 216, 243, 242, 241, 217, 218, 219, 220, 240, 238, 237, 236
  ],
  city: [ //stad
    616, 184, 189, 191, 192, 303, 301, 247, 239, 238
  ]
};

const campingImages = {
  forest: ["skog1.jpg", "skog2.jpg", "skog3.jpg", "skog4.jpg"],
  lake: ["sjö1.jpg", "sjö3.jpg"],
  sea: ["hav1.jpg", "hav2.jpg", "hav3.jpg"],
  city: ["stad1.jpg"]
}


async function init() {

  

  await showCampings(); //anropar fuunktion som visar alla campingar

  fetchSmapiCities() //funktion anrop: hämtar städer till stad filtrer



  document.querySelector("#minPrice").addEventListener("change", function () {
    filterCampings();
    updateResetButtonState();
  }); //händelselyssnare för minimipris. 

document.querySelector("#maxPrice").addEventListener("change", function () {
  filterCampings() //filtrera utifårn pris
  updateResetButtonState(); //aktivera rensa filter knappen
}); //händelslyssnare för maxpris

  dropdown(); //dropdown för läge filtrering
  dropdownCity(); //dropdown för stad filtrering

  let positionCheckboxes = document.querySelectorAll("#dropdownContent input[type='checkbox']"); //hämtar alla checkboxar

  for (let i = 0; i < positionCheckboxes.length; i++) {
    let checkbox = positionCheckboxes[i];
    checkbox.addEventListener("change", function () {
      filterCampings()
      updateResetButtonState();
    });
    
  } //loopar igenom checkboxarna och lägger till change eventlyssnare, anropar filter campings

  //händelsyssnare för lsider filtrera (wifi, fiske, cafe och ttvättmaskin)
  document.querySelector("#wifiSlider").addEventListener("change", function () {
    filterCampings();
updateResetButtonState();
  });
  document.querySelector("#fishingSlider").addEventListener("change", function () {
    filterCampings();
updateResetButtonState();
  });
  document.querySelector("#cafeSlider").addEventListener("change", function () {
    filterCampings();
updateResetButtonState();
  });
  document.querySelector("#laundrySlider").addEventListener("change", function () {
    filterCampings();
updateResetButtonState();
  });





  document.querySelector("#hamburger").addEventListener("click", function () {
    document.querySelector("#nav-links").classList.toggle("show");
  }); //navigeringen

  
  document.querySelector("#resetFiltersBtn").addEventListener("click", function () {
    resetFilters();
    filterCampings();
    updateResetButtonState();
  }); //knappen för att återställa filter
  
  

}
window.addEventListener("load", init)
//Slut init
//-----------------------------------------------------------------------------------



//väljer den första kategorin där id:t hittas eftersom vissa id finns i flera kategorier, denna funktion är till för att hämta en bild baserat på campingens läge (kanske ändra? Är det dumt att bilderna ändras?)
function getCampingCategory(campingId) {
  for (let category in positionIds) {
    if (positionIds[category].includes(parseInt(campingId))) {
      return category;
    }
  }
  return null; // om ingen kategori hittas
}


//funktion för att hantera dropdown menyn med kryssruto för läge
function dropdown() {
  const dropdownBtn = document.querySelector("#dropdownBtn");
  const dropdownContent = document.querySelector("#dropdownContent");

  // När man klickar på knappen: stoppa propagation och toggla öppet/stängt
  dropdownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownContent.classList.toggle("show");
  });

  //  När man klickar var som helst  stäng dropdownen
  document.addEventListener("click", function () {
    dropdownContent.classList.remove("show");
  });

  // När man klickar inne i dropdown-content: stoppa propagation så att inte document-listenern stänger den
  dropdownContent.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}
//Slut dropodown
//-----------------------------------------------------------------------------------


//funktion för att hantera dropdown menyn för stad alternativen
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
  const campingDiv = document.querySelector("#campingsContainer");
  campingDiv.innerHTML = "";

  if (campings.length === 0) {
    campingDiv.innerHTML = "<p>Det finns inga campingar med dina valda filter. Justera dina filter för att hitta campingar som passar dig.</p>";
    return;
  }

  for (let i = 0; i < campings.length; i++) {
    const camping = campings[i];

    // Skapa container
    let container = document.createElement("div");
    container.classList.add("campcontainer");

    //rubrik
    let title = document.createElement("h3");
title.classList.add("campingtitle");
title.textContent = camping.name;
container.appendChild(title);

// text + bild i två kolumner
let contentRow = document.createElement("div");
contentRow.classList.add("campingrow");

    // textdelen skapas
    let textDiv = document.createElement("div");
    textDiv.classList.add("campingtext-container");

    textDiv.innerHTML +=
     
      "<p class='campingtext'>" + camping.city + "</p>" +
      "<p class='campingtext'>" + camping.price_range + " kr</p>" +
      "<p class='campingtext'>" + camping.abstract + "</p>" ;
      

    // Skapa knapp
    let button = document.createElement("button");
    button.classList.add("campingtext");
    button.textContent = "Läs mer";
    textDiv.appendChild(button);

    // skapa bilden
    let img = document.createElement("img");

    // Bestäm kategori
const category = getCampingCategory(camping.id);
let selectedImage = "skog1.jpg"; // fallback eftersom alla cmapingar inte har id i läge kategorien

if (category && campingImages[category]) {
  const imgs = campingImages[category];
  const randomIndex = Math.floor(Math.random() * imgs.length);
  selectedImage = imgs[randomIndex]; //random bild utifrån kategorien
}

img.src = "img/" + selectedImage;

    img.alt = "bild på campingplatsen";
    img.classList.add("campingpic");

    // Lägg in i cnintainer n
    contentRow.appendChild(textDiv);
    contentRow.appendChild(img);

    // Lägg till rad i containern
container.appendChild(contentRow);

    // lägg till evensyssnare
    container.addEventListener("click", function () {
      window.location.href = "specifikcamping.html?id=" + camping.id;

      //spara valda filter i local storage så att de inte försvinner direkt 
      localStorage.setItem("selectedFilters", JSON.stringify({
        minPrice: document.querySelector("#minPrice").value, 
        maxPrice: document.querySelector("#maxPrice").value,
        selectedCities: (function () {
          let checkboxes = document.querySelectorAll("#dropdownContentCity input[type='checkbox']:checked");
          let cities = [];
          for (let i = 0; i < checkboxes.length; i++) {
            cities.push(checkboxes[i].value);
          }
          return cities;
        })(),
        selectedPositions: (function () {
          let checkboxes = document.querySelectorAll("#dropdownContent input[type='checkbox']:checked");
          let positions = [];
          for (let i = 0; i < checkboxes.length; i++) {
            positions.push(checkboxes[i].value);
          }
          return positions;
        })(),
        wifi: document.querySelector("#wifiSlider").checked,
        fishing: document.querySelector("#fishingSlider").checked,
        cafe: document.querySelector("#cafeSlider").checked,
        laundry: document.querySelector("#laundrySlider").checked
      }));

    });

    button.addEventListener("click", function (e) {
      e.stopPropagation(); // så inte hela kortet triggas
      window.location.href = "specifikcamping.html?id=" + camping.id;
    });

    // Lägg in på sidan
    campingDiv.appendChild(container);
  }
}
//Slut displayCampings
//-----------------------------------------------------------------------------------



//filtrerar cmapingarn utifrån pris, stad och läge
function filterCampings() {

  let filtered = allCampings; // Startar med alla campingar – filtreras stegvis utan att påverka originaldatan

  const minPrice = parseInt(document.querySelector("#minPrice").value) || 0; //hämtar valt min pris och gör om det till siffra (eller 0 om inget är valt) 
  const maxPrice = parseInt(document.querySelector("#maxPrice").value) || 1250; //hämtas valt max pris och gör om till siffra (eller 1250 om inget är valt)
  
  filtered = filtered.filter(function (camping) { //filtrera bort campingar osm inte matchar valt pris
   // if (!camping.price_range) return false; 
  
   
    const priceParts = camping.price_range.split("-").map(function (p) { 
      return parseInt(p.trim());
    }); // delar upp priseintervallet från smapi till två siffor men trim och parseint för att få tal
  
    if (priceParts.length !== 2 || isNaN(priceParts[0]) || isNaN(priceParts[1])) return false; //säkerhetskontroll
  
    const campingMin = priceParts[0]; 
    const campingMax = priceParts[1];
    //sparar min och max från intervallet
  
    //jämför användarens valda pris med campingens pris. vi
    return campingMax >= minPrice && campingMin <= maxPrice;
  });
  

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



//funktion för att rensa filter som sparats i local storage
function updateResetButtonState() {
  let btn = document.querySelector("#resetFiltersBtn"); //knapp för att rensa filter
  let isActive = false;

  // Samma kontroll som tidigare...
  if (document.querySelector("#minPrice").value || document.querySelector("#maxPrice").value) isActive = true;

  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      isActive = true;
      break;
    }
  }

  if (
    document.querySelector("#wifiSlider").checked ||
    document.querySelector("#fishingSlider").checked ||
    document.querySelector("#cafeSlider").checked ||
    document.querySelector("#laundrySlider").checked
  ) {
    isActive = true;
  }

  btn.disabled = !isActive; // gör den inaktiv om inget filter är valt
}
//slut resetFilters
//----------------------------------------------------


//funktion för att hämta städer från SMAPI och förinställa filtren
async function fetchSmapiCities() {
  const cityContainer = document.querySelector("#dropdownContentCity");

  // 1) Hämta alla campingar från SMAPI
  const response = await fetch(
    "https://smapi.lnu.se/api/?api_key=R7PGDNjZ&controller=establishment&method=getall&descriptions=camping"
  );
  const data = await response.json();

  // 2) Bygg en unik lista av städer
  const uniqueCities = new Set();
  for (let i = 0; i < data.payload.length; i++) {
    const city = data.payload[i].city;
    if (city) uniqueCities.add(city);
  }

  // 3) Sortera alfabetiskt och skapa checkboxar
  const sortedCities = Array.from(uniqueCities).sort(function(a, b) {
    return a.localeCompare(b, "sv");
  });
  for (let i = 0; i < sortedCities.length; i++) {
    const c = sortedCities[i];
    cityContainer.innerHTML +=
      "<label><input type='checkbox' value='" + c + "'> " + c + "</label><br>";
  }

  // 4) Hämta checkbox-elementen
  const cityCheckboxes = document.querySelectorAll(
    "#dropdownContentCity input[type='checkbox']"
  );

  // 5) Lägg på change-lyssnare på varje stad-checkbox
  for (let i = 0; i < cityCheckboxes.length; i++) {
    cityCheckboxes[i].addEventListener("change", function() {
      filterCampings();
      updateResetButtonState();
    });
  }

  // 6) Läs in tidigare sparade filter (om några)
  const saved = localStorage.getItem("selectedFilters");
  if (saved) {
    const filters = JSON.parse(saved);

    // priser
    document.querySelector("#minPrice").value = filters.minPrice;
    document.querySelector("#maxPrice").value = filters.maxPrice;

    // stads-checkboxar
    for (let i = 0; i < cityCheckboxes.length; i++) {
      cityCheckboxes[i].checked =
        filters.selectedCities.indexOf(cityCheckboxes[i].value) !== -1;
    }

    // läges-checkboxar
    const posCheckboxes = document.querySelectorAll(
      "#dropdownContent input[type='checkbox']"
    );
    for (let i = 0; i < posCheckboxes.length; i++) {
      posCheckboxes[i].checked =
        filters.selectedPositions.indexOf(posCheckboxes[i].value) !== -1;
    }

    // sliders
    document.querySelector("#wifiSlider").checked = filters.wifi;
    document.querySelector("#fishingSlider").checked = filters.fishing;
    document.querySelector("#cafeSlider").checked = filters.cafe;
    document.querySelector("#laundrySlider").checked = filters.laundry;

    filterCampings();
    updateResetButtonState();
  }

  //om man fått city från quizet !!!!!!!!!!!!!!!!!!!!!!!
  const urlParams = new URLSearchParams(window.location.search);
  const cityFromQuiz = urlParams.get("city");
  if (cityFromQuiz) {

    // hjälpfunktion för att ta bort specialrtecken och jämföra
    function normalize(str) {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    }
    const normCity = normalize(cityFromQuiz);
    for (let i = 0; i < cityCheckboxes.length; i++) {
      if (normalize(cityCheckboxes[i].value) === normCity) {
        cityCheckboxes[i].checked = true;
        break;
      }
    }
    filterCampings(); 
    updateResetButtonState(); 
  }
}


//funktion för att återställa filter
function resetFilters() {
  // Rensa priser
  document.querySelector("#minPrice").value = "";
  document.querySelector("#maxPrice").value = "";

  // Avmarkera alla checkboxar
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }

  // Nollställ sliders
  document.querySelector("#wifiSlider").checked = false;
  document.querySelector("#fishingSlider").checked = false;
  document.querySelector("#cafeSlider").checked = false;
  document.querySelector("#laundrySlider").checked = false;

  // Radera från localStorage
  localStorage.removeItem("selectedFilters");
}