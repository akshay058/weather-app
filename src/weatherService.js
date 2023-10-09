import axios from "axios";
const API_KEY = "31b26e07c1109f0dd2acf85cdbdb4acf";

const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const getFormattedWeatherData = async (city, units = "metric") => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(URL);

    if (response.status === 404) {
      throw new Error(`City "${city}" not found`);
    }

    if (response.status !== 200) {
      throw new Error(`Failed to fetch weather data for ${city}`);
    }

    const data = response.data;

    const {
      weather,
      main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
      wind: { speed },
      sys: { country },
      name,
    } = data;

    const { description, icon } = weather[0];

    return {
      description,
      iconURL: makeIconURL(icon),
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      speed,
      country,
      name,
    };
  } catch (error) {
    console.error(error.message);
    return null; // Return null or some other value to indicate the error.
  }
};

export { getFormattedWeatherData };
