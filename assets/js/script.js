var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();
// var searchedCities = [];

var cityArray = JSON.parse(localStorage.getItem("searchedCities"));
if (cityArray){
    searchedCities = cityArray;
  }else{
    var searchedCities = [];
}; 

var Sector = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];

for (let i = 1; i < 6; i++) {
document.querySelector("#Day"+i).textContent = moment().add(i, 'days').format('L');
};

loadCities();

var searchCityAction = function(){
  var searchStr = document.querySelector("#searchTerm").value;
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
      
// //save data as key,value: dayyear, array of tasks per hour
    var apiUrl = "https://api.geocod.io/v1.6/geocode?city=" + searchStr + "&api_key=3212807212bfb01b6636f32077439307032f440"
    fetch(apiUrl)
      .then(geoResponse => geoResponse.json())
      .then(geoResponse => {
        console.log(geoResponse.results[0])
        var divEl = document.querySelector("#response-container");

        let currentCity = geoResponse.results[0].formatted_address;
        var para = document.querySelector("#display-city"); 
        para.textContent = currentCity; 
        var api2Url = "https://api.openweathermap.org/data/2.5/onecall?lat="+geoResponse.results[0].location.lat+"&lon="+geoResponse.results[0].location.lng+"&exclude=minutely,hourly&appid=c6372f1324c78c2e38ccaa1ebef5b15c"
        fetch(api2Url)
        .then(response => response.json())
        .then(response => {
          document.querySelector("#current-temp").textContent = "Temp: " + (((response.current.temp-273.15) * (9/5)) + 32).toFixed(2);
          document.querySelector("#current-wind").textContent = "Wind: " + Sector[(Math.round(response.current.wind_deg / 22.5) + 1)] + " @ " + response.current.wind_speed + 'mph';
          document.querySelector("#current-hum").textContent = "Humidity: " + response.current.humidity;
          document.querySelector("#current-UVI").textContent = "UV Index: " + response.current.uvi;

          for (let i = 1; i < 6; i++) {
            document.querySelector("#Day"+i+"-temp").textContent = "Temp: " + (((response.daily[i].temp.max-273.15) * (9/5)) + 32).toFixed(2);
            document.querySelector("#Day"+i+"-wind").textContent = "Wind: " + Sector[(Math.round(response.daily[i].wind_deg / 22.5) + 1)] + "@" + response.daily[i].wind_speed.toFixed(0);
            document.querySelector("#Day"+i+"-hum").textContent = "Humidity: " + response.daily[i].humidity;
            document.querySelector("#Day"+i+"-icon").src="http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
          };
        }); 
      });
    loadCities();
  };    
};

function searchPastCity(){
  document.querySelector("#searchTerm").value = this.innerHTML;
  searchCityAction();  
};

function loadCities(){
  var searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  var answersEl = document.getElementById("city-list");
  while (answersEl.hasChildNodes()) {  
    answersEl.removeChild(answersEl.firstChild);
  };
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





