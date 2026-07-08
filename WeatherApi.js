const temperature = document.querySelector(".temperature");
const condition = document.querySelector(".condition");

setTimeout(() => {
    temperature.classList.add("fade-out");
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
    setTimeout(() => {
        temperature.textContent = `${Math.round(data.current.temperature_2m)}°C`;
        temperature.classList.remove("fade-out");
    }, 2500);

    const code = data.current.weather_code;

    let iconName = "cloud"

    if(code === 0) {
        iconName = "sun";
    } else if(code === 1) {
        iconName = "sun-medium";
    } else if(code === 2) {
        iconName = "cloud-sun";
    } else if(code === 3) {
        iconName = "cloud"
    }else if(code === 80) {
        iconName = " cloud-rain"
    } else if(code === 95) {
        iconName = "cloud-lightning";
    }

    document.querySelector(".weather-icon").innerHTML =`<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();

    if(code === 0) {
        condition.textContent = "Clear Sky";
    } else if (code === 1) {
        condition.textContent = "Mainly Clear";
    } else if (code === 2) {
        condition.textContent = "Partly cloudy";
    } else if (code === 3) {
        condition.textContent = "Overcast";
    } else if (code === 80) {
        condition.textContent = "Rain showers";
    } else {
        condition.textContent = "Unknown weather";
    }

}