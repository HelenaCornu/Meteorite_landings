// function initMap() {
//   // init map
//   var map = L.map("map").setView([0, 0], 2);
//   // add tile layer
//   L.tileLayer(
//     "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
//     {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//       subdomains: "abcd",
//       maxZoom: 20,
//     }
//   ).addTo(map);

//   //add marker
//   var circle = L.circle([51.508, -0.11], {
//     color: "red",
//     fillColor: "#f03",
//     fillOpacity: 0.5,
//     radius: 500,
//   }).addTo(map);
// }

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
    rawElements = rawElements.splice(0, 500);

    // init map
    var map = L.map("map").setView([0, 0], 2);
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

    let cardContent = "";
    let tableContent = "";

    //Adding in the data into the cards, and iterating to create as many cards as there are data points; same for the table
    //Note, the original data gives mass in grams; here it is modified to give the mass in tons for readability
    //The meteorite name links to its official page in the Meteoritical Society database
    let cardsContainer = document.querySelector("#cards-section");
    let tableContainer = document.querySelector("#table-rows");

    for (let i = 0; i < rawElements.length; i++) {
      let currentElement = rawElements[i];
      let cardTemplate = `<div class="cardbox"><a href="https://www.lpi.usra.edu/meteor/metbull.php?code=${
        currentElement.id
      }" target ="_blank">
      <h2>${currentElement.name}</h2>
      <h3>${currentElement.recclass} class</h3>
      <h3>${currentElement.mass / 1000000} tons</h3>
      <p class="alignleft">${currentElement.fall}</p>
      <p class="alignright">${currentElement.year.substr(6, 4)}</p>
      <div style="clear: both"></div></a>
  </div>`;

      let tableTemplate = `<tr>
      <td><a href="https://www.lpi.usra.edu/meteor/metbull.php?code=${
        currentElement.id
      }" target ="_blank">${currentElement.name}</a></td>
      <td>${currentElement.recclass}</td>
      <td>${currentElement.mass / 1000000}</td>
      <td>${currentElement.fall} ${currentElement.year.substr(6, 4)}</td>
    </tr>`;

      //add circles for each meteorite
      //radius is proportional to the mass
      //Colour depends on the fall status

      function getColour(f) {
        return f === "Fell" ? "#FC8D62" : f === "Found" ? "#8DA0CB" : "#4F4F4F";
      }

      var circle = L.circle([currentElement.reclat, currentElement.reclong], {
        color: getColour(currentElement.fall),
        fillcolor: getColour(currentElement.fall),
        fillOpacity: 0.5,
        radius: currentElement.mass * 0.008,
      }).addTo(map);

      circle.bindPopup(`<h2>${currentElement.name} 
       ${currentElement.reclat}, ${currentElement.reclong}</h2>`);

      cardContent = cardContent + cardTemplate;
      tableContent = tableContent + tableTemplate;
    }

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Legend</h4>";
      div.innerHTML +=
        '<span class="empty-circle"></span>&nbsp;&nbsp;<span class="legend-text">Mass (tons)*</span><br>';
      div.innerHTML +=
        '<span class="orange-square"></span>&nbsp;&nbsp;<span class="legend-text">Fell</span><br>';
      div.innerHTML +=
        '<span class="blue-square"></span>&nbsp;&nbsp;<span class="legend-text">Found</span><br>';
      div.innerHTML +=
        "<p>*due to map distortion, circles closer to the poles will appear larger</p>";

      return div;
    };

    legend.addTo(map);

    cardsContainer.innerHTML = cardContent;
    tableContainer.innerHTML = tableContent;
  });
}

//Once you have defined all the functions, you add all of them to one function, which is the only function executed within the script
function startApp() {
  // initMap();
  handleTabsToggle();
  loadData();
}

startApp();
