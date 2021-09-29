var openWeatherKey = "e3b4d1333323f6175037fc68166fb554";    //OpenWeather API Key

//Function gets called to initiate program
function init(){
    searchHistory();
    $("#forcastBox").hide();
    $("#clearStorage").click(clearStorage);
    $("#searchButton").click(citySearch);
}

//When user types a city into the search bar, their input is used to fetch data from Open Weather API
function citySearch(){

    var userInput = $("#cityName").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial" + "&appid=" + openWeatherKey;
    
    fetch(queryURL)
    .then(function (response) {
        if (response.status !== 200) {
            alert("Not A Valid City! Please Try Again.");
        }
        else{
            return response.json();
        }
    })

    //Follows these functions after retrieving data
    .then(function (data) {
        $("#cityName").val('');
        toLocalStorage(data);
        searchDisplay();
        displayDescription(data);
        getUVIndex(data);
        setForcast(data);
        $("#clearStorage").show();
        $("#pastSearchBox").show();
        $("#forcastBox").show();      
    })  
}

//Stores an object array of city names into local storage
function toLocalStorage(data){
    
    var storedCity;

    var cityArray = JSON.parse(localStorage.getItem('City'));

    if(cityArray == null){
        localStorage.setItem('City',JSON.stringify([]));
        toLocalStorage(data);
    }
    else{
        storedCity = data.name;
        var cityObj = {
            name: storedCity,
        }
        cityArray.push(cityObj);
        localStorage.setItem("City",JSON.stringify(cityArray));
    }
}

//Shows search history on page load if there are cities already stored in local storage
function searchHistory(){

    var cityList = JSON.parse(localStorage.getItem('City'));
    if(cityList == null){
        $("#clearStorage").hide();
        $("#pastSearchBox").hide();
        return
    }
    else{
        //Iterates through array of cities and creates a button for each city name. Adds class name/styling to buttons and sets an event listener on each button if they are clicked
        for(var i = 0; i < cityList.length; i++){
            var listItem = document.createElement("button");
            var listText = document.createTextNode(cityList[i].name);
            listItem.appendChild(listText);
            document.getElementById("pastSearchBox").appendChild(listItem).className ="newButtons btn btn-secondary btn-sm col-12";
            listItem.setAttribute("onclick", "searchButtonClicked(this)");
        }
    }
}

//Displays search history live while user is using application
function searchDisplay(){

    var cityList = JSON.parse(localStorage.getItem('City'));
    if(cityList == null){
        return
    }
    else{
        for(var i = 0; i < cityList.length; i++){
            var listItem = document.createElement("button");
            var listText = document.createTextNode(cityList[i].name);
            listItem.appendChild(listText);
        }
        document.getElementById("pastSearchBox").appendChild(listItem).className ="newButtons btn btn-secondary btn-sm col-12";
            listItem.setAttribute("onclick", "searchButtonClicked(this)");
    }
}

//Function for each button created for previous searches. Locates the city name of the button that is clicked. Adds that city name back to the API to retrieve data again.
function searchButtonClicked(event){
    var buttonPath = this.event.path[0].childNodes[0].data;
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + buttonPath + "&units=imperial" + "&appid=" + openWeatherKey;
    
    fetch(queryURL)
    .then(function (response) {
        if (response.status !== 200) {
            alert("Enter a Valid City");
        }
        else{
            return response.json();
        }
    })
    //Once fetched program continues with these functions to show data for clicked search history buttons
    .then(function (data) {
        displayDescription(data);
        getUVIndex(data);
        setForcast(data);
        $("#forcastBox").show();
        return;  
    })  
}

//Displays weather data from API
function displayDescription(data){

    $("#cityID").text(data.name + " | ");
    $("#dateID").text(moment().format("MMM Do YYYY") + " | ");
    var iconCode = data.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    $("#iconID").attr("src", iconURL);
    $("#tempID").text("Temp: " + data.main.temp + "\u00B0F");
    $("#windID").text("Wind: " + data.wind.speed + " MPH");
    $("#humidityID").text("Humidity: " + data.main.humidity + "%");
}

//Retrieves the data for UV Index by entering the latitude and longitude from previous API fetch.
function getUVIndex(data){
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    
    var oneCallQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherKey;
    
    fetch(oneCallQuery)
    .then(function (response) {
        return response.json();
    })
    //Displays color corresponding with UV Index Level
    .then(function (data) {
        if(data.current.uvi <= 3){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Low Levels Today");
            $("#uvID").css("background-color","#558B2F");
            $("#uvID").css("color","white");
        }
        else if(data.current.uvi > 3 && data.current.uvi < 6){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Moderate Levels Today");
            $("#uvID").css("background-color","#F9A825");
            $("#uvID").css("color","white");
        }
        else if(data.current.uvi >= 6 && data.current.uvi < 8){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- High Levels Today");
            $("#uvID").css("background-color","#EF6C00");
            $("#uvID").css("color","white");
        }
        else if(data.current.uvi >= 8  && data.current.uvi < 11){
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Very High Levels Today");
            $("#uvID").css("background-color","#B71C1C");
            $("#uvID").css("color","white");
        }
        else{
            $("#uvID").text("UV Index: " + data.current.uvi + "  --------- Extreme Levels Today!");
            $("#uvID").css("background-color","#6A1B9A");
            $("#uvID").css("color","white");
        }
    })     
}

//Retrieves data to display 5 day forcast
function setForcast(data){

    var cityName = data.name;
    var forcastQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + openWeatherKey;
 
    fetch(forcastQuery)
    .then(function (response) {
        return response.json();
    })
    //Weather data is stored every 3 hours. 8*3 = 24 hours. Loop iterates by 8 to display data for each day.
    .then(function (data) {
        for(var i = 0; i <= 32; i+=8){
            $("#dayIndex" + i).text(moment.unix(data.list[i].dt).format("MMM Do"));     //Gets data from moment.js to dislay the time
            //Displays the icon from the API data
            var iconCode = data.list[i].weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            $("#iconIndex" + i).attr("src", iconURL);
            $("#tempIndex" + i).text("Temp: " + data.list[i].main.temp + "\u00B0F");
            $("#windIndex" + i).text("Wind: " + data.list[i].wind.speed + " MPH");
            $("#humidityIndex" + i).text("Humidity: " + data.list[i].main.humidity + "%");     
        }
    })
}
//Clears local storage and alters display when clear history button is clicked
function clearStorage(){
    $("#clearStorage").hide();
    $("#forcastBox").hide();
    localStorage.clear();
    location.reload();
}
//Initiates program
init();