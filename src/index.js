const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
  "December",
];

const weatherIcons = {
  "01d": "src/icons/clear_sky_d.png",
  "01n": "src/icons/clear_sky_n.png",
  "02d": "src/icons/few_clouds_d.png",
  "02n": "src/icons/few_clouds_n.png",
  "03d": "src/icons/scattered_clouds_d.png",
  "03n": "src/icons/scattered_clouds_n.png",
  "04d": "src/icons/broken_clouds_d.png",
  "04n": "src/icons/broken_clouds_n.png",
  "09d": "src/icons/shower_rain_d.png",
  "09n": "src/icons/shower_rain_n.png",
  "10d": "src/icons/rain_d.png",
  "10n": "src/icons/rain_n.png",
  "11d": "src/icons/thunderstorm_d.png",
  "11n": "src/icons/thunderstorm_n.png",
  "13d": "src/icons/snow_d.png",
  "13n": "src/icons/snow_n.png",
  "50d": "src/icons/mist_d.png",
  "50n": "src/icons/mist_n.png",
};

const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search-input");
const cityEl = document.querySelector("#city");
const temperatureEl = document.querySelector("#temperature");
const iconElement = document.querySelector("#icon");
const mainDescriptionEl = document.querySelector("#main-description");
const descriptionElement = document.querySelector("#description");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const celsiusLink = document.querySelector("#celsius");
const fahrenheitLink = document.querySelector("#fahrenheit");
const currentLocationButton = document.querySelector("#current-location");
const currentDayWeekElement = document.querySelector("#current-day-week");
const forecastElement = document.querySelector("#forecast");

let currentUnit = "C";
let celsiusTemperature = 0;

const key = "1ad6e66daecab484d39c734aa3d7405a";
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${key}&units=metric`;
const defaultCity = "Kharkiv";

function formatDate() {
  const currentDate = new Date();
  const weekday = weekdays[currentDate.getDay()];
  const date = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  currentDayWeekElement.innerHTML = weekday;
  return `${date} ${month}, ${year}, ${hour}:${minutes}`;
}

function updateDateTimeOnView() {
  const newDate = document.querySelector("#data");
  newDate.innerHTML = formatDate();
}

function formatDayForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  return weekdays[day];
}

function forecastDisplay(response) {
  let forecastDays = response.data.daily;
  console.log(response.data.daily);
  let forecastHTML = `<div class="row mb-5">`;
  forecastDays.forEach(function (forecastDay, index) {
    if (index < 7 && index !== 0) {
      forecastHTML = forecastHTML + `
        <div class='col border shadow p-2 m-2 bg-body rounded'>
          <div class='mb-2'>${formatDayForecast(forecastDay.dt)}</div>
          <div class='mb-2'>
            <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
            <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
          </div>
          <div> 
            <img
            src='${weatherIcons[forecastDay.weather[0].icon]}'
            id='icon'
            class='weather-forecast-icon'
            alt='${forecastDay.weather[0].description}' />
          </div>
        </div>
      `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${key}&units=metric`;
  axios.get(apiUrl).then(forecastDisplay);
}

function showTemp(response) {
  celsiusTemperature = response.data.main.temp;
  temperatureEl.innerHTML = getFormattedTemp(celsiusTemperature, currentUnit);
  iconElement.setAttribute("src", weatherIcons[response.data.weather[0].icon]);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  mainDescriptionEl.innerHTML = response.data.weather[0].main;
  descriptionElement.innerHTML = capitalizeFirstLetter(`${response.data.weather[0].description}`);
  humidityEl.innerHTML = `Humidity: ${response.data.main.humidity} %`;
  windEl.innerHTML = `Wind: ${Math.round(response.data.wind.speed)} km/h`;

  getForecast(response.data.coord);
}

function capitalizeFirstLetter (sentence) {
  sentence = sentence.split('');
  sentence[0] = sentence[0].toUpperCase();
  return sentence.join('');
}

function getWeatherByCityName(cityName) {
  const url = `${baseUrl}&q=${cityName}`;
  axios.get(url).then(showTemp);
}

function setCityName(city) {
  cityEl.innerHTML = city.trim();
}

function searchCity(event) {
  event.preventDefault();
  if (searchInputEl.value.length > 0) {
    setCityName(searchInputEl.value);
    getWeatherByCityName(searchInputEl.value);
    updateDateTimeOnView();
    searchFormEl.reset();
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `${baseUrl}&lat=${lat}&lon=${lon}`;
  axios.get(url).then((response) => {
    showTemp(response);
    setCityName(response.data.name);
  });
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function getFormattedTemp(celsiusTemperature) {
  if (currentUnit === "C") {
    return Math.round(celsiusTemperature);
  }
  return Math.round((celsiusTemperature * 9) / 5 + 32);
}

function showCelsius(event) {
  currentUnit = "C";
  temperatureEl.innerHTML = getFormattedTemp(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function showFahrenheit(event) {
  currentUnit = "F";
  temperatureEl.innerHTML = getFormattedTemp(celsiusTemperature);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function startApp(city) {
  cityEl.innerHTML = city;
  getWeatherByCityName(city);
}

celsiusLink.addEventListener("click", showCelsius);
fahrenheitLink.addEventListener("click", showFahrenheit);
currentLocationButton.addEventListener("click", getCurrentPosition);
searchFormEl.addEventListener("submit", searchCity);

startApp(defaultCity);
