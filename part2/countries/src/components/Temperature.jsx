import axios from "axios";
import { useEffect, useState } from "react";

function Temperature({ capital }) {
  const [city, setCity] = useState(null);
  useEffect(() => {
    if (capital) {
      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_API_KEY
          }&q=${capital.toLowerCase()}`
        )
        .then((response) => setCity(response.data))
        .catch((error) => console.error("Error fetching weather data:", error));
    }
  }, [capital]);

  if (!city) {
    return <p>Loading weather in {capital}...</p>;
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {city.current.temp_c} Celcius</p>
      <img src={city.current.condition.icon} />
      <p>wind {city.current.wind_kph} kph</p>
    </div>
  );
}

export default Temperature;
