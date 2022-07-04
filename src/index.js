// Display the current date and time
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
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

  return `${weekday}, ${date} ${month}, ${year}, ${hour}:${minutes}`;
}

function updateDateTimeOnView() {
  const newDate = document.querySelector("#data");
  newDate.innerHTML = formatDate();
}

updateDateTimeOnView();

// Add a search engine, when searching for a city
// Display the city name on the page after the user submits the form
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search-input");
const cityEl = document.querySelector("#city");
const temperatureEl = document.querySelector("#temperature");
const descriptionEl = document.querySelector("#desc");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const key = "1ad6e66daecab484d39c734aa3d7405a";
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${key}&units=metric`;
const defaultCity = "Kharkiv";

function showTemp(response) {
  temperatureEl.innerHTML = Math.round(response.data.main.temp);
  humidityEl.innerHTML = `Humidity: ${Math.round(response.data.main.humidity)}%`;
  windEl.innerHTML = `Wind: ${Math.round(response.data.wind.speed)}km/h`;
  descriptionEl.innerHTML = response.data.weather[0].main;
}

function getWeatherByCityName(cityName) {
  const url = `${baseUrl}&q=${cityName}`;
  axios.get(url).then(showTemp);
}

function searchCity(event) {
  event.preventDefault();
  if (searchInputEl.value.length > 0) {
    cityEl.innerHTML = searchInputEl.value.trim().toUpperCase();
    getWeatherByCityName(searchInputEl.value);
    // searchInputEl.value = "";
    updateDateTimeOnView();
    searchFormEl.reset();
  }
}

searchFormEl.addEventListener("submit", searchCity);

cityEl.innerHTML = defaultCity;
getWeatherByCityName(defaultCity);



// Current Location (click button)
function showWeather(response) {
  temperatureEl.innerHTML = Math.round(response.data.main.temp);
  cityEl.innerHTML = `${response.data.name}`;
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const apiKey = "1ad6e66daecab484d39c734aa3d7405a";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

const button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);
