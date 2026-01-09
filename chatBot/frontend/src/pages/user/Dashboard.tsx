import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { tokenPayload } from "../../types/types";
import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number; deg: number };
  clouds: { all: number };
  sys: { country: string; sunrise: number; sunset: number };
}

const Dashboard = () => {
  const userToken = Cookies.get("token");
  const tokenDecoded: tokenPayload = jwtDecode(userToken || "");
  const email_id = tokenDecoded.sub.email;

  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/current_weather/getdata",
          { email_id }
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };
    fetchData();
  }, [email_id]);

  if (!weather) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">Loading weather data...</div>
      </div>
    );
  }

  const weatherIconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-gray-500">{weather.weather[0].description}</p>
          </div>
          <img src={weatherIconUrl} alt="weather icon" className="w-16 h-16" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-5xl font-bold text-gray-800">
            {(weather.main.temp - 273.15).toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-500">
            Feels like {(weather.main.feels_like - 273.15).toFixed(1)}°C
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-sm">Min Temp</p>
            <p className="font-semibold">
              {(weather.main.temp_min - 273.15).toFixed(1)}°C
            </p>
          </div>
          <div>
            <p className="text-sm">Max Temp</p>
            <p className="font-semibold">
              {(weather.main.temp_max - 273.15).toFixed(1)}°C
            </p>
          </div>
          <div>
            <p className="text-sm">Humidity</p>
            <p className="font-semibold">{weather.main.humidity}%</p>
          </div>
          <div>
            <p className="text-sm">Pressure</p>
            <p className="font-semibold">{weather.main.pressure} hPa</p>
          </div>
          <div>
            <p className="text-sm">Wind Speed</p>
            <p className="font-semibold">{weather.wind.speed} m/s</p>
          </div>
          <div>
            <p className="text-sm">Cloudiness</p>
            <p className="font-semibold">{weather.clouds.all}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
