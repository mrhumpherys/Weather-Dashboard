var inputEl = document.querySelector("#searchTerm");
var searchBtnEl = document.querySelector("#searchBtn");
var btnContainerEl = document.querySelector("#btn-box");
var currentEl = document.querySelector("#current");
var fiveTitleEl = document.querySelector("#fiveTitle");
var pTimeEl = document.querySelector("#pTime");
var tempEl = document.querySelector("#temp");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind");
var uvEl = document.querySelector("#uv");
var uvBtnEL = document.querySelector("#uvBtn");
var fiveDayEl = document.querySelectorAll("#fiveDay");


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
        errorFunc();
        pTimeEl.innerHTML = "Please enter a city.";
    }
}
var storeCity = function(city) {
    var storedCity = city;
    searchedCities.push(storedCity); 
    localStorage.setItem("city", JSON.stringify(searchedCities));
}

var errorFunc = function() {
    pTimeEl.innerText = "";
    pTimeEl.innerText = "Your search did not return a valid city. Please try again.";
    tempEl.innerText = "";
    humidityEl.innerText = "";
    windEl.innerText = "";
    uvEl.innerText = "";
    
    for ( var i = 0; i < fiveDayEl.length; i++) {
        fiveDayEl[i].innerHTML = "";
    };
}

var getWeather = function(searchCity) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=b7401d7f8ad6b97299577e666bd17a73"

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                
                
                
                var currentDate = new Date(data.dt*1000);
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();
                
                
                pTimeEl.innerText = data.name + " (" + month + "/" + day + "/" + year + ")";
                var iconEl = document.createElement("img");
                iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
                pTimeEl.appendChild(iconEl);
                tempEl.innerText = "Temperature: " + data.main.temp + "°F";
                humidityEl.innerText = "Humidity: " + data.main.humidity + "%";
                windEl.innerText = "Wind Speed: " + data.wind.speed + " MPH";
                //UV info fetch
                var latitute = data.coord.lat;
                var long = data.coord.lon;
                var apiUrl2 = "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&lat=" + latitute + "&lon=" + long + "&units=imperial&appid=b7401d7f8ad6b97299577e666bd17a73";
                fetch(apiUrl2).then(function(response2){
                    response2.json().then(function(data2) {
                        uvEl.innerText = "UV Index: "
                        var uvBtn = document.createElement("span");
                        uvBtn.innerText = data2[0].value;
                        var uvScale = data2[0].value;
                        if (uvScale < 3) {
                            uvBtn.classList = "btn btn-success"
                        }
                        else if (uvScale > 3 && uvScale < 6) {
                            uvBtn.classList = "btn btn-warning"
                        } else {
                        uvBtn.classList = "btn btn-danger";
                        }
                        uvEl.appendChild(uvBtn);
                    });
                });
                
                var apiUrl3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&appid=b7401d7f8ad6b97299577e666bd17a73";
                fetch(apiUrl3).then(function(response3) {
                    response3.json().then(function(data3) {
                        fiveTitleEl.innerText = "5-Day Forcast:"
                        
                        
                        for (var i=0; i < fiveDayEl.length; i++) {
                            fiveDayEl[i].innerHTML = "";
                            fiveDayEl[i].classList = "bg-primary col rounded text-white card ml-3 p-1"
                            var fiveDayIndex = i*8 +4;
                            var fiveDayDate = new Date(data3.list[fiveDayIndex].dt * 1000);
                            var fDay = fiveDayDate.getDate();
                            var fMonth = fiveDayDate.getMonth() + 1;
                            var fYear = fiveDayDate.getFullYear();
                            var fiveDateEl = document.createElement("h5");
                            fiveDateEl.classList = "card-title";
                            fiveDateEl.innerHTML = fMonth + "/" + fDay + "/" + fYear;
                            fiveDayEl[i].appendChild(fiveDateEl);
                            var fIcon = document.createElement("img");
                            fIcon.classList = "card-img";
                            fIcon.setAttribute("src", "https://openweathermap.org/img/w/" + data3.list[fiveDayIndex].weather[0].icon + ".png");
                            fiveDayEl[i].appendChild(fIcon);
                            fTemp = document.createElement("p");
                            fTemp.classList = "card-text";
                            fTemp.innerHTML = "Temp: " + data3.list[fiveDayIndex].main.temp + "°F";
                            fiveDayEl[i].appendChild(fTemp);
                            fHumidity = document.createElement("p");
                            fHumidity.classList = "card-text";
                            fHumidity.innerHTML = "Humidity: " + data3.list[fiveDayIndex].main.humidity + "%";
                            fiveDayEl[i].appendChild(fHumidity);
                        }
                    })
                })
            });
            if (searchedCities.includes(searchCity)) {
                return;
            } else {
                displayBtn(searchCity);
                storeCity(searchCity);
            }
        } else {
            errorFunc();
            
        }
    })
    .catch(function(error) {
        errorFunc();
        pTimeEl.innerText = "Unable to connect to OpenWeather. Please try again."
    });
}

var buttonClickHandler = function(event) {
    var city = event.target.getAttribute("data-city");

    if(city) {
    getWeather(city);
    };
}




recallCities(searchedCities);
searchBtnEl.addEventListener("click", getCity)
btnContainerEl.addEventListener("click", buttonClickHandler);