const temperature = document.querySelector(".temperature");
const condition = document.querySelector(".condition");
const weather = document.querySelector(".weather-icon");
const forecastContainer = document.querySelector(".forecast")
const weatherDescriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    80: "Rain Showers",
    95: "Thunderstorm"
};

const weatherIcons = {
    0: "sun",
    1: "sun-medium",
    2: "cloud-sun",
    3: "cloud",
    45: "cloud-fog",
    48: "cloud-fog",
    61: "cloud-drizzle",
    63: "cloud-rain",
    65: "cloud-rain",
    80: "cloud-rain",
    95: "cloud-lightning"
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
    fetchWeather(latitude, longitude);
}

async function fetchWeather(latitude,longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    updateWeatherUI(data)
}

function updateWeatherUI(data) {
    console.log(data);
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

    for (let i = 0; i <5; i++) {
        const date = new Date(data.daily.time[i]);
        
        const day = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const maxTemp = Math.round(data.daily.temperature_2m_max[i]);

        forecastContainer.innerHTML += `
            <div class= "forecast-card">
                <h3>${day}</h3>
                <i data-lucide="cloud"></i>
                <p>${maxTemp}°</p>
            </div>
        `;
    }
    lucide.createIcons();
}