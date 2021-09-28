var openWeatherKey = "e3b4d1333323f6175037fc68166fb554";
$("#searchButton").click(citySearch);

function citySearch(){

    var userInput = $("#cityName").val();
    
    var cityObj = {
        city: userInput,
    }
    
    toLocalStorage(cityObj);
    previousSearches();
    retrieveData(cityObj);
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

function previousSearches(){
;
    var displayedCities = JSON.parse(localStorage.getItem('City'));

    for(var i = 0; i < displayedCities.length; i++){
        var listItem = document.createElement("button");
        var listText = document.createTextNode(displayedCities[i].city);
        listItem.appendChild(listText);
        document.getElementById("pastSearchBox").appendChild(listItem).className = "newButtons btn btn-primary btn-sm col-12";
    }
}

function retrieveData(currentCity){
    var city = currentCity.city;
    console.log(city);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + openWeatherKey;

    fetch(queryURL);
}

//create and display list of stored inputs
//get weather data when clicking previous inputs
//make header with bootstrap