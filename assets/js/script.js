var openWeatherKey = "e3b4d1333323f6175037fc68166fb554";
localStorage.clear();
$("#searchButton").click(citySearch);

function citySearch(){

    var userInput = $("#cityName").val();
    
    var cityObj = {
        city: userInput,
    }
    
    toLocalStorage(cityObj);
    retrieveData(cityObj);
    $("#cityName").val('');
}

function toLocalStorage(newCity){

    var cityArray = JSON.parse(localStorage.getItem('City'));

    //save input to local storage
    if(cityArray == null){
        localStorage.setItem('City',JSON.stringify([]));
        toLocalStorage(newCity);
    }
    else{
        cityArray.push(newCity);
        localStorage.setItem('City', JSON.stringify(cityArray));
    }
}


function retrieveData(currentCity){
    var city = currentCity.city;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + openWeatherKey;
    
    
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        previousSearches(data);
    })   
}

function previousSearches(data){

    var displayedCities = JSON.parse(localStorage.getItem('City'));

    for(var i = 0; i < displayedCities.length; i++){
        var listItem = document.createElement("button");
        var listText = document.createTextNode(data.name);
        listItem.appendChild(listText);
    }
    document.getElementById("pastSearchBox").appendChild(listItem).className = "newButtons btn btn-secondary btn-sm col-12";
    displayDescription(data);
}

function displayDescription(data){
    console.log(data);
    $("#cityID").text(data.name + " | ");
    $("#dateID").text(moment().format("MMM Do YY") + " | ");
    var iconCode = data.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    $("#iconID").attr("src", iconURL);
    $("#tempID").text("Temp: " + data.main.temp + "\u00B0F");
    $("#windID").text("Wind: " + data.wind.speed + " MPH");
    $("#humidityID").text("Humidity: " + data.main.humidity + "%");
    
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    
    var oneCallQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherKey;
    
    fetch(oneCallQuery)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data.current.uvi)

        if(data.current.uvi <= 3){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Low Levels Today----------");
            $("#uvID").css("background-color","#558B2F");
            $("#uvID").css("color","white");
        }
        else if(data.current.uvi > 3 && data.current.uvi < 6){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Moderate Levels Today----------");
            $("#uvID").css("background-color","#F9A825");
            $("#uvID").css("color","white");
        }
        else if(data.current.uvi >= 6 && data.current.uvi < 8){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- High Levels Today----------");
            $("#uvID").css("background-color","#EF6C00");
            $("#uvID").css("color","white");
        }
        else if(data.current.uvi >= 8  && data.current.uvi < 11){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Very High Levels Today----------");
            $("#uvID").css("background-color","#B71C1C");
            $("#uvID").css("color","white");
        }
        else{
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Extreme Levels Today!----------");
            $("#uvID").css("background-color","#6A1B9A");
            $("#uvID").css("color","white");
        }
        console.log(data.current.uvi);



    })
    
    




}
