const temperature = document.querySelector(".temperature");
const condition = document.querySelector(".condition");
const weather = document.querySelector(".weather-icon");
const searchInput = document.querySelector(".search-input");
const locationElement = document.querySelector(".city");
const dateElement = document.querySelector(".date");
const humidity = document.querySelector(".humidity-value");
const wind = document.querySelector(".wind-speed");
const uvIndexElement = document.querySelector(".uv-index");
const feelsLikeElement = document.querySelector(".feels");
const pressureElement = document.querySelector(".pressure");
const visibilityElement = document.querySelector(".visible");
const forecastContainer = document.querySelector(".forecast")
const weatherDescriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snow Fall",
    73: "Moderate Snow Fall",
    75: "Heavy Snow Fall",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

const weatherIcons = {
    0: "sun",
    1: "sun-medium",
    2: "cloud-sun",
    3: "cloudy",
    45: "cloud-fog",
    48: "cloud-fog",
    51: "cloud-drizzle",
    53: "cloud-drizzle",
    55: "cloud-drizzle",
    56: "cloud-drizzle",
    57: "cloud-drizzle",
    61: "cloud-sun-rain",
    63: "cloud-moon-rain",
    65: "cloud-rain",
    66: "cloud-rain-wind",
    67: "cloud-rain-wind",
    71: "sun-snow",
    73: "cloud-snow",
    75: "snowflake",
    77: "snowflake",
    80: "cloud-rain",
    81: "cloud-rain",
    82: "cloud-rain-wind",
    85: "sun-snow",
    86: "cloud-snow",
    95: "cloud-lightning",
    96: "cloud-lightning",
    99: "cloud-lightning"
}



setTimeout(() => {
    temperature.classList.add("fade-out");
    condition.classList.add("fade-out");
    weather.classList.add("fade-out")
}, 2000);

// setTimeout(() => {
//     temperature.textContent = "31°C";
//     temperature.classList.remove("fade-out");
// }, 2500);


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);

} else {
    alert("Geolocation isn't supported by your browser");
}


function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    getLocationName(latitude, longitude);
    fetchWeather(latitude, longitude);
}

async function getLocationName (latitude, longitude) {
    try{
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        const locationName = 
            data.address.city ||
            data.address.county || 
            data.address.district ||
            data.address.road;
        const locationState = data.address.state;
        // console.log(locationName)
        locationElement.textContent = `${locationName}, ${locationState}`;
    } catch (error) {
        console.log(error);
        locationElement.textContent = "Unknown Location";
    }
}

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = searchInput.value.trim();
        if (city === "") {
            return;
        } 
        searchCity(city);
        searchInput.value = "";
    }
});

async function searchCity(city) {
    try{
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("Location not found");
            return;
        }
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        const cityName = data.results[0].name;
        locationElement.textContent = cityName;

        fetchWeather(latitude, longitude);
    } catch (error) {
        console.log(error);
        alert("Something went wrong. Please check your internet connection");
    }
}

async function fetchWeather(latitude,longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const humidityValue = data.current.relative_humidity_2m;
    humidity.textContent = `${humidityValue}%`;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    wind.textContent = `${windSpeed}Km/h`;
    const uvIndexValue = data.current.uv_index;
    uvIndexElement.textContent = `${uvIndexValue}`
    const pressureValue = Math.round(data.current.surface_pressure);
    pressureElement.textContent = `${pressureValue} hpa`;
    const feelsLikeValue = Math.round(data.current.apparent_temperature);
    feelsLikeElement.textContent = `${feelsLikeValue}°C`;
    const visibilityValue = data.current.visibility/1000;
    visibilityElement.textContent = `${visibilityValue} Km`;
    const currentDate = new Date(data.current.time);
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const dayName = days[currentDate.getDay()];
    const monthName = months[currentDate.getMonth()];
    const dayNumber = currentDate.getDate();
    const year = currentDate.getFullYear();
    dateElement.textContent = `${dayName}, ${monthName} ${dayNumber} ${year}`;

    updateWeatherUI(data)
}

function updateWeatherUI(data) {
    // console.log(data);
    const code = data.current.weather_code;
    const iconName = weatherIcons[code] || "cloud";
    setTimeout(() => {
        temperature.textContent = `${Math.round(data.current.temperature_2m)}°C`;
        temperature.classList.remove("fade-out");
        
        condition.textContent = weatherDescriptions[code] || "Unknown Condition";
        condition.classList.remove("fade-out");

        document.querySelector(".weather-icon").innerHTML =`<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
        weather.classList.remove("fade-out");
    }, 2500);

    forecastContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const date = new Date(data.daily.time[i]);
        
        const day = date.toLocaleDateString("en-US", {
            weekday: "short"
        });
        const forecastCode = data.daily.weather_code[i];
        const forecastIcon = weatherIcons[forecastCode] || "cloud";

        const maxTemp = Math.round(data.daily.temperature_2m_max[i]);

        forecastContainer.innerHTML += `
            <div class= "forecast-card">
                <h3>${day}</h3>
                <i data-lucide=${forecastIcon}></i>
                <p>${maxTemp}°</p>
            </div>
        `;
    }
    lucide.createIcons();
}