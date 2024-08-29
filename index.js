const apiKey = "15d6248b612e7afdb2c51045491f1155";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const apiUrlNow = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const accessKeyUnsplash = "Ca4Sg-KlUVnuJL6gadTFlE1pRBKbfa-3NxlDXr75BcY";
const countryApiUrl = "https://restcountries.com/v3.1/alpha/";

const enterBox = document.querySelector(".Entercity");
const buttonBox = document.querySelector(".buttonChangeLocation");
const weatherIcon = document.querySelector('.weatherIcon');
async function func(city) {
    console.log("Fetching weather data for:", city);

    const responseNow = await fetch(`${apiUrlNow}${city}&appid=${apiKey}`);

        if (responseNow.status === 404)
            {
                    document.querySelector(".ErrorCityName").style.display = "block";
                    document.querySelector(".ErrorCityName").innerText = "Wrong city name: " + city;

                    document.querySelector(".city-info").style.display = "none";
                     document.querySelector(".main-content").style.display = "none";
                     document.querySelector(".footer").style.display = "none";
                     document.querySelector(".googleMap").style.display = "none";
            }
            else{

                    document.querySelector(".city-info").style.display = "block";
                     document.querySelector(".main-content").style.display = "block";
                     document.querySelector(".footer").style.display = "block";
                     document.querySelector(".googleMap").style.display = "block";
                         document.querySelector(".ErrorCityName").style.display = "none";
                        const dataNow = await responseNow.json();
                        console.log("Current weather data:", dataNow);

                        const countryCode = dataNow.sys.country;
                        const countryName = await getCountryName(countryCode);
                        console.log("Country name:", countryName);

                        // Correct Time Calculation
                        const timezoneOffset = dataNow.timezone; // offset in seconds
                        const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
                        const localTime = new Date(utcTime + timezoneOffset * 1000).toLocaleString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                        });
                        console.log("Local time:", localTime);

                        // Display current weather data
                        document.querySelector(".city").innerHTML = dataNow.name;
                        document.querySelector(".country").innerHTML = countryName;
                        document.querySelector(".date").innerHTML = localTime;
                        document.querySelector(".degre").innerHTML = Math.round(dataNow.main.temp) + "°C";
                        document.querySelector(".weatherCondition").innerHTML = dataNow.weather[0].main;

                        const iconURL = `https://openweathermap.org/img/wn/${dataNow.weather[0].icon}.png`;
                        weatherIcon.setAttribute('src', iconURL);

                        document.querySelector(".windSpeed").innerHTML = dataNow.wind.speed + " m/s";
                        document.querySelector(".pressure").innerHTML = dataNow.main.pressure + " hPa";

                        document.querySelector(".feels-like").innerHTML = Math.round(dataNow.main.feels_like) + "°C";
                        document.querySelector(".grnd-level").innerHTML = dataNow.main.grnd_level ? dataNow.main.grnd_level + " hPa" : "N/A";
                        document.querySelector(".humidity").innerHTML = dataNow.main.humidity + "%";
                        document.querySelector(".temp-max").innerHTML = Math.round(dataNow.main.temp_max) + "°C";
                        document.querySelector(".temp-min").innerHTML = Math.round(dataNow.main.temp_min) + "°C";

                        var lat = dataNow.coord.lat;
                        var lon = dataNow.coord.lon;

                            //google map
                        document.querySelector("gmp-map").setAttribute("center", `${lat},${lon}`);
                        document.querySelector("gmp-advanced-marker").setAttribute("position", `${lat},${lon}`);

                        searchImage(city);

                        
                    }
 
}




async function getCountryName(countryCode) {
    try {
        const response = await fetch(`${countryApiUrl}${countryCode}`);
        const data = await response.json();
        return data[0].name.common; // Returns the common name of the country
    } catch (error) {
        console.error("Error fetching country name:", error);
        return countryCode; // Fallback to country code if there's an error
    }
}

async function searchImage(city) {
    const url = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${accessKeyUnsplash}`;

    const responseUnsplash = await fetch(url);
    const dataUnsplash = await responseUnsplash.json();
    const results = dataUnsplash.results;

    if (results.length > 0) {
        document.body.style.backgroundImage = `url(${results[0].urls.regular})`;
    }
}

buttonBox.addEventListener("click", () => {
    const city = enterBox.value;
    func(city);
});

func("New York");
