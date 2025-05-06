const APIkey = "R7PGDNjZ"; // API-nyckel till SMAPI

let campingId;

function init() {
    showSpecificCamping();  // Anropa funktionen för att visa specifik camping

    
}

window.addEventListener("load", init);

// Funktion för att visa specifik camping
async function showSpecificCamping() {
    const specificCampingDiv = document.querySelector(".specificCampingDiv"); // Elementet där campinginformationen ska visas
    const urlParams = new URLSearchParams(window.location.search); // Hämtar query params från URL:en
    campingId = urlParams.get('id'); // Hämta id från URL

    console.log("campind id: ", campingId)
    
    

    // Anropa API för att hämta camping med ID
    let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getall&descriptions=camping&ids=" + campingId);

    

    
  
    const data = await response.json(); // Omvandla svaret till JSON

    console.log(data.payload)
    
    if (data.payload.length > 0) {
        const camping = data.payload[0]; // Hämta första (och enda) campingdata från svaret

        // Skapa och visa campinginformation på sidan
        specificCampingDiv.innerHTML = 
            "<h3 class='campingtext'>" + camping.name + "</h3>"+
            "<p class='campingtext'>" + camping.city + "</p>" +
            "<p class='campingtext'>" + camping.price_range + "</p>" +
        
            "<p class='campingtext'>" + camping.text + "</p>" +
            "<p class='campingtext'><a href='" + camping.website + "' target='_blank'>" + camping.website + "</a></p>";

            fetchReviews(campingId) // anrop av funktion för att hämta campingens recensioner
    } 

   
}
//slut showSpecificCamping



//funktion för att visa cmapingens recensioner
async function fetchReviews (cmapingId) {
console.log( "showreviews funktion")

let reviewsDiv = document.querySelector(".reviewsDiv");

 // Anropa API för att hämta recensioner
 let response = await fetch("https://smapi.lnu.se/api/?debug=true&api_key=" + APIkey + "&controller=establishment&method=getReviews&id=" + campingId);
 const reviewsData = await response.json(); // Omvandla svaret till JSON

console.log("cmapingidd", campingId)
}