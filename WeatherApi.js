async function getWeather(){
    const city = document.getElementById("city").value;
     
    const apiKey = "b9bc679c2c4fd77d435ef00c21c04eed";

    const url = `https://api.weatherstack.com/forecast?query=${city}&units=m&access_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("weather").innerHTML = `
    <h2>${data.location.name}</h2>
    <p>${data.location.country}</p>
    <p>${data.current.temperature}</p>
    `;
}