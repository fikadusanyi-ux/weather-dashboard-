# Weatherly — Weather Dashboard

A responsive weather dashboard built with HTML, CSS and vanilla JavaScript. It uses the free Open-Meteo geocoding and forecast APIs, so no API key is required.

## Features
- Search for a city
- Current temperature and weather conditions
- Humidity, wind speed and feels-like temperature
- Five-day forecast
- Celsius / Fahrenheit toggle
- Responsive layout for mobile and desktop

## Run locally
Because the app uses `fetch()`, run it with a local development server:

```bash
# Option 1: VS Code Live Server extension
# Right-click index.html → Open with Live Server

# Option 2: Python
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## API
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)

## GitHub
Create a repository named `weather-dashboard`, then:

```bash
git init
git add .
git commit -m "Build responsive weather dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/weather-dashboard.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.
