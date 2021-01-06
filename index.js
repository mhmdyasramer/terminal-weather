const axios = require('axios').default;
const geoip = require('geoip-lite');

const terminalImage = require('terminal-image');
const got = require('got');

const GEOLOCATION_API_TOKEN = 'AIzaSyA3IDfY1RRPdPdWIHItgpXI34ukUBkfMN4';
const OPEN_WEATHER_MAP_TOKEN = '03d3092f7f06050c3e7a75bac72b5f82';
const FIND_IP_URL = 'https://ipinfo.io/ip';


const getIP = async () => {
  const res = await axios.get(FIND_IP_URL);
  // console.log(`IP: ${res.data}`);
  return res.data;
}

const getCoordinates = (location) => {
  const coordsArray = location.ll;
  const coords = { lat: coordsArray[0], lon: coordsArray[1] };
  return coords;
}

const getWeatherByCoordinates = async (coords) => {
  const { lat, lon } = coords;
  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_TOKEN}&units=metric`;

  const res = await axios.get(url);
  return res.data;
}

const getFormattedLocationInfo = (location) => {
  const { country, region, city, timezone } = location;

  return { country, region, city, timezone };
}

const showFormattedLocationInfo = (location) => {
  const data = getFormattedLocationInfo(location);

  console.log(`Location: ${data.city}, Region: ${data.region}, Country: ${data.country}`);
  console.log(`Timezone: ${data.timezone}`);
}

const getFormattedWeatherInfo = async (weatherData) => {
  // console.log(weatherData);
  const temp = Math.round(weatherData.main.temp);
  const { main, description } = weatherData.weather[0]
  const iconCode = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
  const icon = await getWeatherIcon(iconUrl);
  return { temp, main, description, icon };
}

const showFormattedWeatherInfo = async (weatherInfo) => {
  const data = await getFormattedWeatherInfo(weatherInfo);
  const degreeSymbol = '\u00B0';
  console.log(`Temperature: ${data.temp}${degreeSymbol} Celcius`);
  console.log(`Conditions: ${data.main}, ${data.description}`);
  console.log(`Visual status: ${data.icon}`);
}

const getWeatherIcon = async (iconUrl) => {
  const newUrl = 'https://openweathermap.org/img/w/03d.png';
  const body = await got(`${newUrl}`).buffer();
  const options = { width: '5%', preserveAspectRatio: true };
  const icon = await terminalImage.buffer(body, options);
  return icon;
}

const getWeather = async () => {
  const ip = await getIP();
  const location = geoip.lookup(ip);
  const coords = getCoordinates(location);
  const weatherData = await getWeatherByCoordinates(coords);
  showFormattedWeatherInfo(weatherData);
  showFormattedLocationInfo(location);
}

getWeather();
// showImage();