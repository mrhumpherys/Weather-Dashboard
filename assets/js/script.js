var inputEl = document.querySelector("#searchTerm");
var searchBtnEl = document.querySelector("#searchBtn");
var btnContainerEl = document.querySelector("#btn-box");


let searchedCities = JSON.parse(localStorage.getItem("city")) || [];
var recallCities = function(searchedCities) {
    if (searchedCities) {
        for (var i = 0; i < searchedCities.length; i ++) {
            displayBtn(searchedCities[i]);
        }
    } else {
        return;
    }  
}

var displayBtn = function(city) {
        var btnEl = document.createElement("button")
        btnEl.innerText = city;
        btnEl.setAttribute("data-city", city)
        btnEl.classList = "list-group-item list-group-item-action"
        btnContainerEl.appendChild(btnEl);
}
var getCity = function() {
    var searchCity = inputEl.value;
    displayBtn(searchCity);
    storeCity(searchCity);
}
var storeCity = function(city) {
    var storedCity = city;
    searchedCities.push(storedCity); 
    localStorage.setItem("city", JSON.stringify(searchedCities));
}

recallCities(searchedCities);
searchBtnEl.addEventListener("click", getCity)