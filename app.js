// var lat = 35.00283;
// var lon = -76.75297;

// var map = L.map("map").setView([35.00283, -76.75297], 12);
// L.tileLayer(
//   "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ZRAVfv2fRr731UxpnfpZ",
//   {
//     tileSize: 512,
//     zoomOffset: -1,
//     minZoom: 2,
//     attribution:
//       '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
//     crossOrigin: true,
//   }
// ).addTo(map);

// async function getFoursquare(business) {
//   const options = {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: "fsq3JyIM4ovhOwIiLP0QFIfuPYjo6LMOuOibvJ6AlCjxZzg=",
//     },
//   };
//   let limit = 5;
//   let response = await fetch(
//     `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`,
//     options
//   );
//   let data = await response.text();
//   let parsedData = JSON.parse(data);
//   let businesses = parsedData.results;
//   return businesses;
// }

// var myMarker = L.marker([lat, lon], {
//   alt: "Your Location",
// })
//   .addTo(map)
//   .bindPopup("Your current location");

// console.log(getLocation());

const myMap = {
  coordinates: [],
  businesses: [],
  map: {},
  markers: {},

  // build leaflet map
  buildMap() {
    this.map = L.map("map", {
      center: this.coordinates,
      zoom: 10,
    });
    // add openstreetmap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: "5",
    }).addTo(this.map);
    // create and add geolocation marker
    const marker = L.marker(this.coordinates);
    marker
      .addTo(this.map)
      .bindPopup("<p1><b>You are here</b><br></p1>")
      .openPopup();
  },

  // add business markers
  addMarkers() {
    for (var i = 0; i < this.businesses.length; i++) {
      this.markers = L.marker([this.businesses[i].lat, this.businesses[i].long])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .addTo(this.map);
    }
  },
};

// get coordinates via geolocation api
async function getCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return [pos.coords.latitude, pos.coords.longitude];
}

// get foursquare businesses
async function getFoursquare(business) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8=",
    },
  };
  let limit = 50;
  let lat = myMap.coordinates[0];
  let lon = myMap.coordinates[1];
  let response = await fetch(
    `https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`,
    options
  );
  let data = await response.text();
  let parsedData = JSON.parse(data);
  let businesses = parsedData.results;
  return businesses;
}
// process foursquare array
function processBusinesses(data) {
  let businesses = data.map((element) => {
    let location = {
      name: element.name,
      lat: element.geocodes.main.latitude,
      long: element.geocodes.main.longitude,
    };
    return location;
  });
  return businesses;
}

// event handlers
// window load
window.onload = async () => {
  const coords = await getCoords();
  myMap.coordinates = coords;
  myMap.buildMap();
};

// business submit button
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let business = document.getElementById("business").value;
  let data = await getFoursquare(business);
  myMap.businesses = processBusinesses(data);
  myMap.addMarkers();
});
