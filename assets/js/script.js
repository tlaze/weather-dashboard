var openWeatherKey = "e3b4d1333323f6175037fc68166fb554";
$("#clearStorage").click(clearStorage);

function init(){
    searchHistory();
    $("#forcastBox").hide();
    $("#searchButton").click(citySearch);
}

function citySearch(){

    var userInput = $("#cityName").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial" + "&appid=" + openWeatherKey;
    
    fetch(queryURL)
    .then(function (response) {
        if (response.status !== 200) {
            alert("Enter a Valid City");
        }
        else{
            return response.json();
        }
    })
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

//Shows search history if theres cities in local storage on start
function searchHistory(){

    var cityList = JSON.parse(localStorage.getItem('City'));
    if(cityList == null){
        $("#clearStorage").hide();
        $("#pastSearchBox").hide();
        return
    }
    else{
        for(var i = 0; i < cityList.length; i++){
            var listItem = document.createElement("button");
            var listText = document.createTextNode(cityList[i].name);
            listItem.appendChild(listText);
            document.getElementById("pastSearchBox").appendChild(listItem).className ="newButtons btn btn-secondary btn-sm col-12";
            listItem.setAttribute("onclick", "searchButtonClicked(this)");
        }
    }
}

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
    .then(function (data) {
        displayDescription(data);
        getUVIndex(data);
        setForcast(data);
        $("#forcastBox").show();
        return;  
    })  
}

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


function getUVIndex(data){
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    
    var oneCallQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherKey;
    
    fetch(oneCallQuery)
    .then(function (response) {
        return response.json();
    })
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

function setForcast(data){

    var cityName = data.name;
    var forcastQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + openWeatherKey;
 
    fetch(forcastQuery)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for(var i = 0; i <= 32; i+=8){
            $("#dayIndex" + i).text(moment.unix(data.list[i].dt).format("MMM Do"));
            var iconCode = data.list[i].weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            $("#iconIndex" + i).attr("src", iconURL);
            $("#tempIndex" + i).text("Temp: " + data.list[i].main.temp + "\u00B0F");
            $("#windIndex" + i).text("Wind: " + data.list[i].wind.speed + " MPH");
            $("#humidityIndex" + i).text("Humidity: " + data.list[i].main.humidity + "%");     
        }
    })
}

function clearStorage(){
    $("#clearStorage").hide();
    $("#forcastBox").hide();
    localStorage.clear();
    location.reload();
}
init();