const $ = (id) => document.getElementById(id);
let unit = "celsius";
let currentWeather = null;
let dailyWeather = null;

const weatherCodes = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Heavy drizzle", "🌧️"],
  61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "❄️"], 75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"], 81: ["Showers", "🌧️"], 82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm", "⛈️"], 99: ["Thunderstorm", "⛈️"]
};
const weatherInfo = (code) => weatherCodes[code] || ["Cloudy", "🌥️"];
const temp = (c) => unit === "celsius" ? Math.round(c) : Math.round(c * 9 / 5 + 32);
const degree = () => unit === "celsius" ? "°C" : "°F";
const showTemp = (value) => `${temp(value)}°`;

async function findCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not search for that city. Please try again.");
  const data = await response.json();
  if (!data.results?.length) throw new Error("City not found. Check the spelling and try again.");
  const city = data.results[0];
  await loadWeather(city.latitude, city.longitude, [city.name, city.admin1, city.country].filter(Boolean).join(", "));
}

async function loadWeather(lat, lon, label) {
  $("error").textContent = "";
  $("placeName").textContent = label;
  $("condition").textContent = "Loading weather…";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather data is unavailable right now. Please try again.");
  const data = await response.json();
  currentWeather = data.current;
  dailyWeather = data.daily;
  renderWeather();
}

function renderWeather() {
  const c = currentWeather, d = dailyWeather;
  const [description, icon] = weatherInfo(c.weather_code);
  $("currentIcon").textContent = icon;
  $("currentTemp").textContent = temp(c.temperature_2m);
  $("degree").textContent = degree();
  $("condition").textContent = description;
  $("feelsLike").textContent = showTemp(c.apparent_temperature);
  $("feelsDetail").textContent = showTemp(c.apparent_temperature);
  $("humidity").textContent = `${c.relative_humidity_2m}%`;
  $("wind").textContent = `${Math.round(c.wind_speed_10m)} km/h`;
  const todayUv = dataUv();
  $("uv").textContent = todayUv == null ? "—" : todayUv.toFixed(1);
  $("todayHigh").textContent = showTemp(d.temperature_2m_max[0]);
  $("todayLow").textContent = showTemp(d.temperature_2m_min[0]);
  $("dateLine").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  $("updated").textContent = `Updated ${new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}`;
  $("forecastGrid").innerHTML = d.time.map((date, i) => {
    const [desc, symbol] = weatherInfo(d.weather_code[i]);
    const day = i === 0 ? "Today" : new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
    return `<div class="forecast-day" title="${desc}">
      <div class="day">${day}</div><div class="icon">${symbol}</div>
      <div class="temps">${showTemp(d.temperature_2m_max[i])}<span>${showTemp(d.temperature_2m_min[i])}</span></div>
    </div>`;
  }).join("");
}
function dataUv() {
  // Open-Meteo hourly UV data is not requested as a separate global variable.
  // Use a dash if no hourly UV value is available in this response.
  return null;
}
function showError(error) {
  $("error").textContent = error.message || "Something went wrong. Please try again.";
}
$("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = $("cityInput").value.trim();
  if (!city) return;
  try { await findCity(city); } catch (error) { showError(error); }
});
$("unitToggle").addEventListener("click", () => {
  unit = unit === "celsius" ? "fahrenheit" : "celsius";
  $("unitToggle").innerHTML = unit === "celsius" ? "°C <span>/ °F</span>" : "°F <span>/ °C</span>";
  if (currentWeather) renderWeather();
});

(async function init() {
  try {
    // Default city keeps the dashboard useful without asking for location permission.
    await findCity("Jimma");
  } catch (error) {
    showError(error);
    $("placeName").textContent = "Weather unavailable";
    $("condition").textContent = "Search for a city to begin";
  }
})();
