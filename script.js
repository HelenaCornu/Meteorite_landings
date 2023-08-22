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

function loadData() {
  //This lets us import the data from the local json file using axios -- you can't link like you would an html file -- and then manipulating it
  //You can only use .then with the Axios command -- so everything to do with the data is included in this function, to ensure that the data is loaded before the script proceeds (otherwise it throws an error)
  axios.get("./Meteorite_Landings_dataset.json").then(function (response) {
    //Since we present the data sorted by size, we first sort the data, using the .sort function (the compare function sorts descending and ensures that sort produces correct results even if the numbers are strings)
    let rawElements = response.data.sort(function (a, b) {
      return b.mass - a.mass;
    });
    //You then extract only part of the data because otherwise the dataset is way too big. Carlos' rule = 10,000 max
    rawElements = rawElements.splice(0, 100);
    let content = "";

    //Adding in the data into the cards, and iterating to create as many cards as there are data points
    //Note, the original data gives mass in grams; here it is modified to give the mass in tons for readability
    let cardsContainer = document.querySelector("#cards-section");

    for (let i = 0; i < rawElements.length; i++) {
      let currentElement = rawElements[i];
      let cardTemplate = `<div class="cardbox">
      <h2>${currentElement.name}</h2>
      <h3>${currentElement.recclass} class</h3>
      <h3>${currentElement.mass / 1000000} tons</h3>
      <p class="alignleft">Fell</p>
      <p class="alignright">${currentElement.year.substr(6, 4)}</p>
      <div style="clear: both"></div>
  </div>`;

      content = content + cardTemplate;
    }
    cardsContainer.innerHTML = content;
  });
}

//Once you have defined all the functions, you add all of them to one function, which is the only function executed within the script
function startApp() {
  initMap();
  handleTabsToggle();
  loadData();
}

startApp();
