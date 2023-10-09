// import "./index.css";
import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const data = await getFormattedWeatherData(city, units);

      if (data === null) {
        setError("City not found");
        setWeather(null);
      } else {
        setWeather(data);

        const threshold = units === "metric" ? 20 : 60;
        if (data.temp <= threshold) setBg(coldBg);
        else setBg(hotBg);

        setError(null); // Clear any previous error messages
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data.");
      setWeather(null);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [units]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const handleCitySubmit = (e) => {
    fetchWeatherData();
  };
  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <div className="container">
          <div className="section section__inputs">
            <input
              // onKeyDown={enterKeyPressed}
              type="text"
              name="city"
              placeholder="Enter City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              className="button-search"
              onClick={(e) => handleCitySubmit(e)}
            >
              Search
            </button>
            <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>

          {weather && (
            <>
              <div className="section section__temperature">
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
                <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} °${
                    units === "metric" ? "C" : "F"
                  }`}</h1>
                </div>
              </div>
              {/* bottom description */}
              <Descriptions weather={weather} units={units} />{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
