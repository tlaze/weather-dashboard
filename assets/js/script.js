function citySearch(){
    
    var userInput = $("#cityName").val();
    console.log(userInput);

    var cityObj = {
        city: userInput,
    }

    toLocalStorage(cityObj);
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

//create and display list of stored inputs
//get weather data when clicking previous inputs
//make header with bootstrap