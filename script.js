function initMap() {
  // init map
  var map = L.map("map").setView([51.505, -0.09], 13);
  // add tile layer
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);

  // add marker
  var circle = L.circle([51.508, -0.11], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
  }).addTo(map);
}

function handleTabsToggle() {
  //let cardBTN = document.getElementById("card-btn");
  //Both of these do the same thing but query selector is more modern; you can select classes instead of ids
  //query selector will select the first of a type, unless you say querySelectorAll e.g. .cardbox
  let cardsBTN = document.querySelector("#card-btn");
  let tableBTN = document.querySelector("#table-btn");
  let cardsSection = document.querySelector("#cards-section");
  let tableSection = document.querySelector("#table-section");

  cardsBTN.onclick = function () {
    let ifDisable = cardsBTN.classList.contains("disable-text");
    if (ifDisable) {
      cardsBTN.classList.remove("disable-text");
      tableBTN.classList.add("disable-text");
      cardsSection.classList.remove("hide");
      tableSection.classList.add("hide");
    }
  };

  tableBTN.onclick = function () {
    let ifDisable = tableBTN.classList.contains("disable-text");
    if (ifDisable) {
      tableBTN.classList.remove("disable-text");
      cardsBTN.classList.add("disable-text");
      tableSection.classList.remove("hide");
      cardsSection.classList.add("hide");
    }
  };
}

function startApp() {
  initMap();
  handleTabsToggle();
}

startApp();
