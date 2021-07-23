//global vars
var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();
var Sector = ["N","NNE","NNE","NE","NE","ENE","ENE","E","E","ESE","ESE","SE","SE","SSE","SSE","S","S","SSW","SSW","SW","SW","WSW","WSW","W","W","WNW","WNW","NW","NW","NNW","NNW","N"];

//if cities exist in storage set array or setup blank array
var cityArray = JSON.parse(localStorage.getItem("searchedCities"));
if (cityArray){
    searchedCities = cityArray;
  }else{
    var searchedCities = [];
}; 

//Setup 5 Day cards
for (let i = 1; i < 6; i++) {
document.querySelector("#Day"+i).textContent = moment().add(i, 'days').format('L');
};

//Setup city buttons
loadCities();

//Main function
var searchCityAction = function(){
  //reset error catch
  if(document.querySelector("#submit-search").textContent == "City Not Found"){
    resetSubmitButton(); 
  };
  var searchStr = document.querySelector("#searchTerm").value;
  //capitalize each word before storing it
  if (searchStr){
    const arr = searchStr.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    searchStr = arr.join(" ");
    if (!(searchedCities.includes(searchStr))){
      searchedCities[searchedCities.length] = searchStr;
      localStorage.setItem("searchedCities" , JSON.stringify(searchedCities));
    };
      
    //first fetch
    var apiUrl = "https://api.geocod.io/v1.6/geocode?city=" + searchStr + "&api_key=3212807212bfb01b6636f32077439307032f440"
    fetch(apiUrl)
      .then(geoResponse => geoResponse.json())
      .then(geoResponse => {
        console.log(geoResponse.results[0])
        // var divEl = document.querySelector("#response-container");

        let currentCity = geoResponse.results[0].address_components.city + ", " + geoResponse.results[0].address_components.state;
        var para = document.querySelector("#display-city"); 
        para.textContent = currentCity + " for " + moment().format('LL'); 
        //second fetch (nested) 
        var api2Url = "https://api.openweathermap.org/data/2.5/onecall?lat="+geoResponse.results[0].location.lat+"&lon="+geoResponse.results[0].location.lng+"&exclude=minutely,hourly&appid=c6372f1324c78c2e38ccaa1ebef5b15c"
        fetch(api2Url)
        .then(response => response.json())
        .then(response => {
          // current conditions - temp connverted from Kelvin, wind converted to sector
          document.querySelector("#current-temp").textContent = "Temp: " + (((response.current.temp-273.15) * (9/5)) + 32).toFixed(2);
          document.querySelector("#current-wind").textContent = "Wind: " + Sector[(Math.round(response.current.wind_deg / 11.25))] + " @ " + response.current.wind_speed + 'mph';
          document.querySelector("#current-hum").textContent = "Humidity: " + response.current.humidity;
          document.querySelector("#current-UVI").textContent = "UV Index: " + response.current.uvi;
          //UV Index color coding per the EPA (low, moderate, high, very high, extreme)
          switch(Math.floor(response.current.uvi)) {
            case 0:
            case 1:
            case 2:
              document.querySelector("#current-UVI").style.backgroundColor = "green"
              document.querySelector("#current-UVI").style.color = "black";
            break;
            case 3:
            case 4:
            case 5:
              document.querySelector("#current-UVI").style.backgroundColor = "yellow"
              document.querySelector("#current-UVI").style.color = "black";
            break;
            case 6:
            case 7:
              document.querySelector("#current-UVI").style.backgroundColor = "orange"
              document.querySelector("#current-UVI").style.color = "black";
            break;
            case 8:
            case 9:
            case 10:
              document.querySelector("#current-UVI").style.backgroundColor = "red"
              document.querySelector("#current-UVI").style.color = "white";
            break;
            case 11:
              document.querySelector("#current-UVI").style.backgroundColor = "purple"
              document.querySelector("#current-UVI").style.color = "white";
            break;
            default:
              document.querySelector("#current-UVI").style.backgroundColor = "purple"
              document.querySelector("#current-UVI").style.color = "white";
          } 
          
          //setting current weather icon and wind bearing
          document.querySelector("#current-icon").src="http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
          document.querySelector("#current-wind-bearing").src="./assets/images/arrow-icon-transparent-background-24.jpg";
          document.querySelector("#current-wind-bearing").style.transform = "rotate(" + response.current.wind_deg + "deg)";

          //setting 5 day forcast
          for (let i = 1; i < 6; i++) {
            document.querySelector("#Day"+i+"-temp").textContent = "Hi Temp: " + (((response.daily[i].temp.max-273.15) * (9/5)) + 32).toFixed(2);
            document.querySelector("#Day"+i+"-wind").textContent = "Wind: " + Sector[(Math.round(response.daily[i].wind_deg / 11.25))] + "@" + response.daily[i].wind_speed.toFixed(0);
            document.querySelector("#Day"+i+"-hum").textContent = "Humidity: " + response.daily[i].humidity;
            document.querySelector("#Day"+i+"-icon").src="http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
          };
        }); 
      })
      //Error catch and warning
      .catch(function() {
        searchStr = '';
        document.querySelector("#searchTerm").value = "";
        searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
        let popped = searchedCities.pop();
        localStorage.setItem("searchedCities" , JSON.stringify(searchedCities));
        console.log("error");
        document.querySelector("#submit-search").textContent = "City Not Found";
        document.querySelector("#submit-search").style.backgroundColor = "red";
        loadCities();
        window.setTimeout(resetSubmitButton, 3000); 
      });
    loadCities();
  };
};

function resetSubmitButton(){
  document.querySelector("#submit-search").textContent = "Submit";
  document.querySelector("#submit-search").style.backgroundColor = "#06AED5"; 
};

function searchPastCity(){
  document.querySelector("#searchTerm").value = this.innerHTML;
  searchCityAction();  
};

function loadCities(){
  var searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  //erase existing buttons
  var citiesEl = document.getElementById("city-list");
  while (citiesEl.hasChildNodes()) {  
    citiesEl.removeChild(citiesEl.firstChild);
  };
  //Setup a button for each city
  if (searchedCities){
   for (let i = 0; i < searchedCities.length; i++) {
     var cityText = searchedCities[i];
     var listItemEl = document.createElement("li");
     var button = document.createElement("button");
     button.className = "btn";
     button.innerHTML = cityText;
     button.addEventListener('click', searchPastCity, false);
     listItemEl.appendChild(button);
     document.getElementById("city-list").appendChild(listItemEl);
   };
 };
};    





