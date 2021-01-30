var inputEl = document.querySelector("#searchTerm");
var searchBtnEl = document.querySelector("#searchBtn");
var btnContainerEl = document.querySelector("#btn-box");
var currentEl = document.querySelector("#current");
var fiveDayEl = document.querySelector("#fiveDay");
var pTimeEl = document.querySelector("#pTime");
var tempEl = document.querySelector("#temp");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind");
var uvEl = document.querySelector("#uv");
var uvSpanEL = document.querySelector("#uvSpan");


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
    if (searchCity) {
        getWeather(searchCity)
        
    } else {
        
        pTimeEl.innerHTML = "Please enter a city.";
    }
}
var storeCity = function(city) {
    var storedCity = city;
    searchedCities.push(storedCity); 
    localStorage.setItem("city", JSON.stringify(searchedCities));
}


var getWeather = function(searchCity) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=b7401d7f8ad6b97299577e666bd17a73"

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayBtn(searchCity);
                storeCity(searchCity);
                var currentDate = new Date(data.dt*1000);
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();
                var weatherIcon = data.weather[0].icon;
                console.log(weatherIcon);
                pTimeEl.innerText = data.name + " (" + month + "/" + day + "/" + year + ")";
                var iconEl = document.createElement("img");
                iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + weatherIcon + ".png");
                pTimeEl.appendChild(iconEl);
                tempEl.innerText = "Temperature: " + data.main.temp + "F";
                humidityEl.innerText = "Humidity: " + data.main.humidity + "%";
                windEl.innerText = "Wind Speed: " + data.wind.speed + " MPH";
                //UV info fetch
                var latitute = data.coord.lat;
                var long = data.coord.lon;
                var apiUrl2 = "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&lat=" + latitute + "&lon=" + long + "&units=imperial&appid=b7401d7f8ad6b97299577e666bd17a73";
                fetch(apiUrl2).then(function(response2){
                    response2.json().then(function(data2) {
                        uvEl.innerText = "UV Index: "
                        var uvSpan = document.createElement("span");
                        uvSpan.innerText = data2[0].value;
                        var uvScale = data2[0].value;
                        if (uvScale < 3) {
                            uvSpan.classList = "btn-success"
                        }
                        else if (uvScale > 3 && uvScale < 6) {
                            uvSpan.classList = "btn-warning"
                        } else {
                        uvSpan.classList = "btn-danger";
                        }
                        uvEl.appendChild(uvSpan);
                    })
                })
            });
        } else {
            pTimeEl.innerText = "";
            pTimeEl.innerText = "Your search did not return a valid city. Please try again.";
        }
    })
}



recallCities(searchedCities);
searchBtnEl.addEventListener("click", getCity)