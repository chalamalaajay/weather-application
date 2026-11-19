async function getData() {

    const cityInput = document.getElementById("textBox");
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter city name");
        return;
    }

    try {

        // ✅ Your API Gateway endpoint
        const awsApiUrl = "https://p6rkjk9hx4.execute-api.ap-south-1.amazonaws.com/ak/weather";

        // ✅ Send only city to backend
        const response = await axios.post(awsApiUrl, {
            city: city
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = JSON.parse(response.data.body);

        // ✅ Display weather returned from Lambda
        displayModernWeather(data);

        console.log("Weather fetched and saved to DynamoDB successfully!");

    } catch (error) {

        console.error("Full Error:", error);

        if (error.response) {
            alert("Server error: " + error.response.data.message);
        } else {
            alert("Network or CORS error. Check API Gateway CORS settings.");
        }
    }
}


function displayModernWeather(data) {

    const container = document.getElementById("weatherContainer");

    if (!data || !data.location || !data.current) {
        container.innerHTML = "<p class='text-danger'>Invalid weather data received.</p>";
        return;
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const weatherHTML = `
        <div class="weather-card text-white p-4">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h2>${data.location.name}</h2>
                    <h5>${today}</h5>
                    <p class="mt-4">
                        💧 ${data.current.humidity}% <br>
                        🌬 ${data.current.wind_kph} km/h <br>
                        🌡 ${data.current.pressure_mb} hPa
                    </p>
                </div>
                <div class="text-end">
                    <h1 style="font-size:60px;">${data.current.temp_c}°C</h1>
                    <img src="https:${data.current.condition.icon}" width="120">
                </div>
            </div>

            <div class="d-flex justify-content-between mt-5 flex-wrap">
                ${data.forecast.forecastday.map(day => `
                    <div class="forecast-day text-center m-2">
                        <p>${new Date(day.date).toLocaleDateString('en-US',{weekday:'short'})}</p>
                        <img src="https:${day.day.condition.icon}" width="50">
                        <p>${day.day.avgtemp_c}°C</p>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    container.innerHTML = weatherHTML;
}