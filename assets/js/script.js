$("#searchButton").click(citySearch);
var count = 0;
function citySearch(){

        
        console.log("clickled");
        
        var userInput = $("#cityName").val();
        
        var cityObj = {
            city: userInput,
        }
        
    toLocalStorage(cityObj);
    previousSearches();
}

function toLocalStorage(newCity){

    var cityArray = JSON.parse(localStorage.getItem('City'));
    console.log(cityArray);

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
    console.log(count);
    var displayedCities = JSON.parse(localStorage.getItem('City'));
    var listItem = document.createElement("button");
    var listText = document.createTextNode(displayedCities[count].city);
    listItem.appendChild(listText);
    document.getElementById("cityList").appendChild(listItem);
    count++;
}



//create and display list of stored inputs
//get weather data when clicking previous inputs
//make header with bootstrap