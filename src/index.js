const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

let months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input');
const cityEl = document.querySelector('#city');
const temperatureEl = document.querySelector('#temperature');
const iconElement = document.querySelector('#icon');
const mainDescriptionEl = document.querySelector('#main-description');
const descriptionEl = document.querySelector('#description');
const humidityEl = document.querySelector('#humidity');
const windEl = document.querySelector('#wind');
const celsiusLink = document.querySelector('#celsius');
const fahrenheitLink = document.querySelector('#fahrenheit');
const currentLocationButton = document.querySelector('#current-location');
const currentDayWeekElement = document.querySelector('#current-day-week');

let currentUnit = 'C';
let celsiusTemperature = 0;

const key = '1ad6e66daecab484d39c734aa3d7405a';
const baseUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${key}&units=metric`;
const defaultCity = 'Kharkiv';

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
  const newDate = document.querySelector('#data');
  newDate.innerHTML = formatDate();
}

updateDateTimeOnView();

function showTemp(response) {
  celsiusTemperature = response.data.main.temp;
  temperatureEl.innerHTML = getFormattedTemp(celsiusTemperature, currentUnit);
  iconElement.setAttribute('src', weatherIcons[response.data.weather[0].icon]);
  iconElement.setAttribute('alt', response.data.weather[0].description);
  mainDescriptionEl.innerHTML = response.data.weather[0].main;
  descriptionEl.innerHTML = `Description: ${response.data.weather[0].description}`;
  humidityEl.innerHTML = `Humidity: ${response.data.main.humidity} %`;
  windEl.innerHTML = `Wind: ${Math.round(response.data.wind.speed)} km/h`;
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

searchFormEl.addEventListener('submit', searchCity);

cityEl.innerHTML = defaultCity;
getWeatherByCityName(defaultCity);

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

currentLocationButton.addEventListener('click', getCurrentPosition);

function getFormattedTemp(celsiusTemperature) {
  if (currentUnit === 'C'){
    return Math.round(celsiusTemperature);
  }
  return  Math.round((celsiusTemperature * 9) / 5 + 32);
}

function showCelsius(event) {
  currentUnit = 'C';
  temperatureEl.innerHTML = getFormattedTemp(celsiusTemperature);
  celsiusLink.classList.add('active');
  fahrenheitLink.classList.remove('active');
}

function showFahrenheit(event) {
  currentUnit = 'F';
  temperatureEl.innerHTML = getFormattedTemp(celsiusTemperature);
  celsiusLink.classList.remove('active');
  fahrenheitLink.classList.add('active');
}

celsiusLink.addEventListener('click', showCelsius);
fahrenheitLink.addEventListener('click', showFahrenheit);
