import "./style.css";

document.querySelector("#app").innerHTML = `
<main class="app">

  <div class="background-glow"></div>

  <div id="weatherEffects" class="weather-effects"></div>

  <section class="weather-card">
    <div class="top">

      <div>
        <h1>Aurum Weather</h1>
        <span>Premium Forecast</span>
      </div>

      <button
        id="locationBtn"
        class="location-btn"
        aria-label="Use my current location"
        title="Use my current location"
      >
        📍
      </button>

    </div>

    <div class="search">

      <input
        id="cityInput"
        type="text"
        placeholder="Search city..."
        autocomplete="off"
        aria-label="Search city"
      />

      <button
        id="searchBtn"
        aria-label="Search"
        title="Search"
      >
        🔍
      </button>

    </div>

    <div id="errorMessage" class="error-message hidden"></div>

    <div id="loader" class="loader hidden"></div>

    <div class="current-weather">

      <div id="weatherIcon" class="weather-icon">
        ☀️
      </div>

      <h2 id="temperature">--°</h2>

      <h3 id="cityName">Dublin</h3>

      <p id="weatherDescription">
        Search for a city
      </p>

    </div>

    <div class="info-grid">

      <div class="info">
        <span>💧</span>
        <small>Humidity</small>
        <strong id="humidity">--%</strong>
      </div>

      <div class="info">
        <span>🌬️</span>
        <small>Wind</small>
        <strong id="wind">-- km/h</strong>
      </div>

      <div class="info">
        <span>🌡️</span>
        <small>Feels Like</small>
        <strong id="feelsLike">--°</strong>
      </div>

      <div class="info">
        <span>☀️</span>
        <small>UV Index</small>
        <strong id="uvIndex">--</strong>
      </div>

    </div>

    <div class="forecast-section">

      <h3>Next 5 Days</h3>

      <div id="forecast" class="forecast"></div>

    </div>

  </section>

</main>
`;

/* =========================================================
   CONFIG
========================================================= */

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WEATHER_API =
  "https://api.openweathermap.org/data/2.5";

const METEO_API =
  "https://api.open-meteo.com/v1/forecast";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const glow = document.querySelector(".background-glow");
const weatherEffects = document.getElementById("weatherEffects");

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const temperature = document.getElementById("temperature");
const cityName = document.getElementById("cityName");
const weatherDescription =
  document.getElementById("weatherDescription");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const uvIndex = document.getElementById("uvIndex");

const weatherIcon = document.getElementById("weatherIcon");

const loader = document.getElementById("loader");
const errorMessage =
  document.getElementById("errorMessage");

const forecast =
  document.getElementById("forecast");

/* =========================================================
   STATE
========================================================= */

let currentCity = null;

/* =========================================================
   LOADER
========================================================= */

function showLoader() {

  loader.classList.remove("hidden");

  searchBtn.disabled = true;
  locationBtn.disabled = true;
}

function hideLoader() {

  loader.classList.add("hidden");

  searchBtn.disabled = false;
  locationBtn.disabled = false;
}

/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(message) {

  errorMessage.textContent = message;

  errorMessage.classList.remove("hidden");
}

function hideError() {

  errorMessage.textContent = "";

  errorMessage.classList.add("hidden");
}

/* =========================================================
   WEATHER ICONS
========================================================= */

function getWeatherIcon(iconCode) {

  const icons = {

    "01d": "☀️",
    "01n": "🌙",

    "02d": "🌤️",
    "02n": "☁️",

    "03d": "☁️",
    "03n": "☁️",

    "04d": "☁️",
    "04n": "☁️",

    "09d": "🌧️",
    "09n": "🌧️",

    "10d": "🌦️",
    "10n": "🌧️",

    "11d": "⛈️",
    "11n": "⛈️",

    "13d": "❄️",
    "13n": "❄️",

    "50d": "🌫️",
    "50n": "🌫️"

  };

  return icons[iconCode] || "🌤️";
}

/* =========================================================
   WEATHER EFFECTS
========================================================= */

function createWeatherEffect(type) {

  weatherEffects.innerHTML = "";

  let amount = 0;
  let symbol = "";

  switch (type) {

    case "Rain":

      amount = 80;
      symbol = "│";

      break;

    case "Storm":

      amount = 120;
      symbol = "│";

      break;

    case "Snow":

      amount = 50;
      symbol = "❄";

      break;

    case "night":

      amount = 90;
      symbol = "✦";

      break;

    default:

      return;
  }

  for (let i = 0; i < amount; i++) {

    const particle =
      document.createElement("span");

    const particleClass =
      type === "night"
        ? "star"
        : type === "Storm"
          ? "rain"
          : type.toLowerCase();

    particle.className =
      `particle ${particleClass}`;

    particle.textContent = symbol;

    particle.style.left =
      `${Math.random() * 100}%`;

    particle.style.animationDelay =
      `${Math.random() * 5}s`;

    particle.style.animationDuration =
      `${Math.random() * 3 + 2}s`;

    if (type === "Rain" || type === "Storm") {

      particle.style.opacity =
        `${Math.random() * 0.5 + 0.3}`;

    }

    if (type === "Snow") {

      particle.style.fontSize =
        `${Math.random() * 14 + 10}px`;

    }

    if (type === "night") {

      particle.style.fontSize =
        `${Math.random() * 8 + 6}px`;

    }

    weatherEffects.appendChild(particle);
  }
}

/* =========================================================
   BACKGROUND
========================================================= */

function updateBackground(weatherMain, icon) {

  weatherEffects.innerHTML = "";

  document.body.className = "";

  /*
    Night always has priority.
  */

  if (icon.endsWith("n")) {

    createWeatherEffect("night");

    document.body.classList.add("night");

    glow.style.background =
      "#4f7cff55";

    return;
  }

  switch (weatherMain) {

    case "Rain":
    case "Drizzle":

      createWeatherEffect("Rain");

      document.body.classList.add("rain");

      glow.style.background =
        "#3b82f655";

      break;

    case "Thunderstorm":

      createWeatherEffect("Storm");

      document.body.classList.add("storm");

      glow.style.background =
        "#7c3aed66";

      break;

    case "Snow":

      createWeatherEffect("Snow");

      document.body.classList.add("snow");

      glow.style.background =
        "#dbeafe66";

      break;

    case "Clouds":

      document.body.classList.add("cloudy");

      glow.style.background =
        "#64748b66";

      break;

    case "Clear":

      document.body.classList.add("sunny");

      glow.style.background =
        "#ffd60a55";

      break;

    default:

      document.body.classList.add("cloudy");

      glow.style.background =
        "#64748b66";
  }
}

/* =========================================================
   UV INDEX
========================================================= */

async function getUVIndex(lat, lon) {

  try {

    const response =
      await fetch(
        `${METEO_API}?latitude=${lat}&longitude=${lon}&current=uv_index`
      );

    if (!response.ok) {
      throw new Error("Unable to retrieve UV index.");
    }

    const data =
      await response.json();

    const value =
      data.current?.uv_index;

    if (value !== undefined) {

      uvIndex.textContent =
        Math.round(value);

    } else {

      uvIndex.textContent = "--";
    }

  } catch (error) {

    console.error(
      "UV Index Error:",
      error
    );

    uvIndex.textContent = "--";
  }
}

/* =========================================================
   FORMAT CITY
========================================================= */

function formatCity(city) {

  return city
    .trim()
    .replace(/\s+/g, " ");
}

/* =========================================================
   UPDATE CURRENT WEATHER
========================================================= */

function updateUI(data) {

  if (!data?.weather?.[0]) {
    throw new Error(
      "Invalid weather data."
    );
  }

  const weather =
    data.weather[0];

  const main =
    data.main;

  const coordinates =
    data.coord;

  weatherIcon.textContent =
    getWeatherIcon(weather.icon);

  temperature.textContent =
    `${Math.round(main.temp)}°`;

  cityName.textContent =
    `${data.name}, ${data.sys.country}`;

  weatherDescription.textContent =
    weather.description;

  humidity.textContent =
    `${main.humidity}%`;

  wind.textContent =
    `${Math.round(
      data.wind.speed * 3.6
    )} km/h`;

  feelsLike.textContent =
    `${Math.round(
      main.feels_like
    )}°`;

  updateBackground(
    weather.main,
    weather.icon
  );

  getUVIndex(
    coordinates.lat,
    coordinates.lon
  );
}

/* =========================================================
   FORECAST
========================================================= */

async function getForecast(city) {

  try {

    const encodedCity =
      encodeURIComponent(city);

    const response =
      await fetch(
        `${WEATHER_API}/forecast?q=${encodedCity}&units=metric&lang=en&appid=${API_KEY}`
      );

    if (!response.ok) {

      throw new Error(
        "Unable to retrieve forecast."
      );
    }

    const data =
      await response.json();

    forecast.innerHTML = "";

    /*
      OpenWeather returns forecasts
      every 3 hours.

      We select the forecast closest
      to midday for each day.
    */

    const dailyForecasts = {};

    data.list.forEach(item => {

      const date =
        item.dt_txt.split(" ")[0];

      const hour =
        Number(
          item.dt_txt
            .split(" ")[1]
            .split(":")[0]
        );

      if (!dailyForecasts[date]) {

        dailyForecasts[date] =
          item;

        return;
      }

      const currentHour =
        Number(
          dailyForecasts[date]
            .dt_txt
            .split(" ")[1]
            .split(":")[0]
        );

      if (
        Math.abs(hour - 12) <
        Math.abs(currentHour - 12)
      ) {

        dailyForecasts[date] =
          item;
      }
    });

    const days =
      Object.values(
        dailyForecasts
      ).slice(0, 5);

    days.forEach(day => {

      const date =
        new Date(
          day.dt_txt.replace(" ", "T")
        );

      const weekday =
        date.toLocaleDateString(
          "en-US",
          {
            weekday: "short"
          }
        );

      const card =
        document.createElement("div");

      card.className =
        "forecast-card";

      card.innerHTML = `
        <p>${weekday}</p>

        <div class="forecast-icon">
          ${getWeatherIcon(
            day.weather[0].icon
          )}
        </div>

        <strong>
          ${Math.round(day.main.temp)}°
        </strong>
      `;

      forecast.appendChild(card);
    });

    if (days.length === 0) {

      forecast.innerHTML = `
        <p>
          Forecast unavailable.
        </p>
      `;
    }

  } catch (error) {

    console.error(
      "Forecast Error:",
      error
    );

    forecast.innerHTML = `
      <p>
        Forecast unavailable.
      </p>
    `;
  }
}

/* =========================================================
   GET WEATHER BY CITY
========================================================= */

async function getWeather(city) {

  const formattedCity =
    formatCity(city);

  if (!formattedCity) {

    showError(
      "Please enter a city."
    );

    return;
  }

  if (!API_KEY) {

    showError(
      "Weather API key is missing."
    );

    console.error(
      "VITE_WEATHER_API_KEY is not defined."
    );

    return;
  }

  hideError();

  showLoader();

  try {

    const encodedCity =
      encodeURIComponent(
        formattedCity
      );

    const response =
      await fetch(
        `${WEATHER_API}/weather?q=${encodedCity}&units=metric&lang=en&appid=${API_KEY}`
      );

    const data =
      await response.json();

    if (!response.ok) {

      if (response.status === 401) {

        throw new Error(
          "Invalid API key."
        );
      }

      if (response.status === 404) {

        throw new Error(
          "City not found."
        );
      }

      throw new Error(
        data.message ||
        "Unable to retrieve weather."
      );
    }

    currentCity =
      data.name;

    updateUI(data);

    await getForecast(
      data.name
    );

    cityInput.value =
      data.name;

  } catch (error) {

    console.error(
      "Weather Error:",
      error
    );

    showError(
      error.message ||
      "Unable to retrieve weather."
    );

  } finally {

    hideLoader();
  }
}

/* =========================================================
   GET WEATHER BY COORDINATES
========================================================= */

async function getWeatherByCoords(
  lat,
  lon
) {

  if (!API_KEY) {

    showError(
      "Weather API key is missing."
    );

    return;
  }

  hideError();

  showLoader();

  try {

    const response =
      await fetch(
        `${WEATHER_API}/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_KEY}`
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to retrieve location weather."
      );
    }

    currentCity =
      data.name;

    updateUI(data);

    await getForecast(
      data.name
    );

    cityInput.value =
      data.name;

  } catch (error) {

    console.error(
      "Location Weather Error:",
      error
    );

    showError(
      error.message ||
      "Unable to retrieve weather for your location."
    );

  } finally {

    hideLoader();
  }
}

/* =========================================================
   GEOLOCATION
========================================================= */

function getCurrentLocation() {

  if (!navigator.geolocation) {

    showError(
      "Geolocation is not supported by your browser."
    );

    return;
  }

  hideError();

  showLoader();

  navigator.geolocation.getCurrentPosition(

    position => {

      const {
        latitude,
        longitude
      } = position.coords;

      getWeatherByCoords(
        latitude,
        longitude
      );
    },

    error => {

      hideLoader();

      console.error(
        "Geolocation Error:",
        error
      );

      switch (error.code) {

        case error.PERMISSION_DENIED:

          showError(
            "Location permission was denied."
          );

          break;

        case error.POSITION_UNAVAILABLE:

          showError(
            "Your location is currently unavailable."
          );

          break;

        case error.TIMEOUT:

          showError(
            "Location request timed out."
          );

          break;

        default:

          showError(
            "Unable to determine your location."
          );
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

/* =========================================================
   SEARCH
========================================================= */

function searchCity() {

  const city =
    cityInput.value.trim();

  if (!city) {

    showError(
      "Enter a city to search."
    );

    cityInput.focus();

    return;
  }

  getWeather(city);
}

/* =========================================================
   EVENTS
========================================================= */

searchBtn.addEventListener(
  "click",
  searchCity
);

cityInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      event.preventDefault();

      searchCity();
    }
  }
);

locationBtn.addEventListener(
  "click",
  getCurrentLocation
);

/* =========================================================
   INITIAL WEATHER
========================================================= */

getWeather("Dublin");