var openWeatherKey = "e3b4d1333323f6175037fc68166fb554";
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
    console.log(city);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherKey;
    
    
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
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
    console.log(data.weather[0].icon);
    $("#cityID").text(data.name);
    $("#dateID").text(moment().format("MMM Do YY"));
    var iconCode = data.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    $("#iconID").attr("src", iconURL);
}
