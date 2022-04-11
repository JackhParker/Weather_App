$(document).ready(function (){
    // getting search history from local storage
    var localCities = JSON.parse(localStorage.getItem("cities")) || []
    var cities = [];

    function cityAllStorage (){
        for (i=0; i<localCities.length; i++){
            $(".city-list").prepend("<button type='button' class='btn btn-light prev-city'>"+ localCities[i]+ "</button>");
        }
        
    }
    console.log(localStorage.getItem("cities"));
    cityAllStorage();

    // removing cities

    $(".remove").on("click", function (){
        localStorage.clear();
        $(".prev-city").remove();
    });

    var today = function timeStamp (){
        $('#currentDay').text(`${moment().format('MMMM Do YYYY, h:mm a')}`);
        };
        today();
        setInterval(today, 1000);

    // obtain current weather with search, with local storage
    $(".myClass").on('click', function (event){
        event.preventDefault();

        var city= $("#search").val().trim();
        cities = city.split(",");
        localCities.push(city)
        
        if (city != ''){
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=22ca8e5bb1651fa35328425ba2ff1549`,
                type: "GET",
                datatype: "jsonp",
                success: function(data){
                    var widget = show (data);
                    const lon = data.coord.lon;
                    const lat = data.coord.lat;
                    var uvIndexValue = uvIndexFunction(lat, lon);
                    $(".showUvResults").html(uvIndexValue)
                    $("#showResults").html(widget);
                    $("#search").val('')
                }  
            })
            localStorage.setItem("cities", JSON.stringify(localCities));
            $(".city-list").append("<button class='btn btn-light prev-city'>"+ cities + "</button>")
            fiveDayForecast (city);
        }else{
            $('#error').html (alert('Field cannot be empty'))
        }
    });

    //function and values classified by color warning
    function uvIndexFunction(lat, lon) {
        var queryURLData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exlclude={part}&APPID=22ca8e5bb1651fa35328425ba2ff1549`
        $.ajax({
            url: queryURLData,
            method: "GET"
        }).then(function (data) {
            var uvIndex = data.current.uvi;
            var $uvIndex = $("<button class= 'btn btnUvResults'>");
            $uvIndex.addClass("card-text uvIndex");
            $(".showUvResults").append($uvIndex);
            if (uvIndex > 0.01 & uvIndex < 3) { 
                $uvIndex.addClass('success-color').css('background-color', 'green').text('Low Danger');
            } else if (uvIndex > 3 & uvIndex < 6) {
                $uvIndex.addClass('yellow accent-1').css('background-color', 'yellow').text('Moderate to High Danger');
            } else if (uvIndex > 6 & uvIndex < 8) {
                $uvIndex.addClass('warning-color').css('background-color', 'orange').text('Moderate to High Danger');
            } else if (uvIndex > 8 & uvIndex < 11) {
                $uvIndex.addClass('danger-color').css('background-color', 'red').text('Very High to Extreme Danger');
            } else if (uvIndex > 11) {
                $uvIndex.addClass('secondary-color').text('UV Index: Very High to Extreme Danger');
            } else {
                $uvIndex.addClass('notAvailable-color').css('background-color', 'blue').text('No Data Available');
            }
            return uvIndex;
        });
    }
// weather container function to print to HTML
    function show(data) {
        return  "<div id='TodaysForecast'>" +"<h3 style= 'font-size: 20px; font-weight: bold;'>"+ data.name +"," + data.sys.country +"</h3>" +
                "<h3><img src=https://openweathermap.org/img/wn/"+ data.weather[0].icon+".png> "+ data.weather[0].description  +"</h3>" + 
                "<h3><strong>Weather</strong>: "+ data.weather[0].main  +"</h3>" +
                "<h4><strong>Temperature</strong>: "+ Math.floor(data.main.temp)  +"&deg;F</h4>" +
                "<h4><strong>Min. Temp</strong>: "+ Math.floor(data.main.temp_min)  +"&deg;F</h4>" +
                "<h4><strong>Max. Temp</strong>: "+ Math.floor(data.main.temp_max)  +"&deg;F</h4>" +
                "<h4><strong>Wind Speed</strong>: "+ Math.floor(data.wind.speed)  +" MPH" +"</h4>" +
                "<h4><strong>Humidity %</strong>: "+ data.main.humidity+"%" +"</h4>" + 
                "<h4 class='showUvResults'><strong>UV-Index</strong>: </h4>" + "</div>";
                
    }
    //setting up 5-day Forecast
    function fiveDayForecast (city) {
      $.ajax ({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=22ca8e5bb1651fa35328425ba2ff1549`,
        type: "GET",
        datatype: "jsonp",
        success: function getForecast(data){
            $("#FiveDayForecast").html("");
            console.log(data)
            for (i=0; i<data.list.length; i++) {
                if(data.list[i].dt_txt.indexOf("15:00:00")>0){
                    var weatherData= data.list[i]
                    var widgetFiveDay = showForecastData(weatherData);
                    $("#FiveDayForecast").append(widgetFiveDay);
                }
            }
        }  
    })

// five day forecast summary function pushed to HTML

    function showForecastData (data){
        
        return  "<div class='fiveDayFinal'> <h3 class='dateFive'>" + moment(data.dt_txt).format("LL")+ "</h3>" +
                "<h3><img src=http://openweathermap.org/img/wn/"+ data.weather[0].icon+".png id='img2'> "+ data.weather[0].description  +"</h3>" + 
                "<h3><strong>Weather</strong>: "+ data.weather[0].main  +"</h3>" +
                "<h3><strong>Temperature</strong>: "+ Math.floor(data.main.temp)  +"&deg;F</h3>" +
                "<h3><strong>Wind Speed</strong>: "+ Math.floor(data.wind.speed)  +" MPH" +"</h3>" +
                "<h3><strong>Humidity</strong>: "+ data.main.humidity+"%" +"</h3>"+ "</div>";
        };
        
    }
    
// clear search history upon clicking button using
$(document).on("click",".prev-city", function(){
    var city = $(this).text();
    $(".alreadySearched").val(city);
    $("#searchButton").click();
    $(this).remove();


});
})