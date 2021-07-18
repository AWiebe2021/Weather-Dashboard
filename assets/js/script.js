var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();

var myFunction = function(){
    // Create a variable that will use `document.querySelector()` to target the `id` of the input 
    // Use `.value` to capture the value of the input and store it in the variable
  var searchStr = document.querySelector("#searchTerm").value;
    //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    //https://api.geocod.io/v1.6/3212807212bfb01b6636f32077439307032f440
    //curl "https://api.geocod.io/v1.6/geocode?q=1109+N+Highland+St%2c+Arlington+VA&api_key=3212807212bfb01b6636f32077439307032f440"
    //https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=c6372f1324c78c2e38ccaa1ebef5b15c
//http://openweathermap.org/img/wn/01d@2x.png 01-04,09-11,13,50
    //let latlon = position.coords.latitude + "," + position.coords.longitude
  // Kelvin to Farenheit is (K − 273.15) × 9/5 + 32;
    // Make a `fetch` request concatenating that variable to the query URL
    // Remember to add your API key at the end
    // var apiUrl = "https://api.giphy.com/v1/gifs/search?city=" + searchStr + "&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN";
    var apiUrl = "https://api.geocod.io/v1.6/geocode?city=" + searchStr + "&api_key=3212807212bfb01b6636f32077439307032f440"
    fetch(apiUrl)
      .then(geoResponse => geoResponse.json())
      .then(geoResponse => {
        console.log(geoResponse.results[0])
        var divEl = document.querySelector("#response-container");
        //
        // Empty out the <div> before we append a GIF to it
        // while (divEl.hasChildNodes()) {  
        //   divEl.removeChild(divEl.firstChild);
        // };
        let currentCity = geoResponse.results[0].formatted_address;
        var para = document.querySelector("#display-city"); 
        para.textContent = currentCity; 
        var api2Url = "https://api.openweathermap.org/data/2.5/onecall?lat="+geoResponse.results[0].location.lat+"&lon="+geoResponse.results[0].location.lng+"&exclude=minutely,hourly&appid=c6372f1324c78c2e38ccaa1ebef5b15c"
        fetch(api2Url)
        .then(response => response.json())
        .then(response => {
          // console.log(response.results[0])
        //   <ul id=current-weather>
        //   <li id=current-temp>Temp</li>
        //   <li id=current-wind>Wind</li>
        //   <li id=current-hum>Humidity</li>
        //   <li id=current-UVI>UV Index</li>
        // </ul>
          var ulEl = document.querySelector("#current-weather");
          var ilEl1 = document.querySelector("#current-temp");
          var ilEl2 = document.querySelector("#current-wind");
          var ilEl3 = document.querySelector("#current-hum");
          var ilEl4 = document.querySelector("#current-UVI");

          var tempFaren = (((response.current.temp-273.15) * (9/5)) + 32);

          ilEl1.textContent = "Temp: " + tempFaren;
          ilEl2.textContent = "Wind: " + response.current.wind_speed + 'mph @ ' + response.current.wind_deg;
          ilEl3.textContent = "Humidity: " + response.current.humidity;
          ilEl4.textContent = "UV Index: " + response.current.uvi;

          // let currentWeather = response.current.weather[0].description;
          // var para = document.createElement("P"); 
          // para.innerText = currentWeather; 
          // divEl.appendChild(para);

        //
        }) 
      })
  };

