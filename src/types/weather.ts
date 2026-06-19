/**
 * Weather type definitions for OpenWeatherMap Current Weather Data API.
 * API key lives server-side only — never exposed to client.
 */

export interface WeatherData {
  cityName: string;
  temp: number;           // Celsius
  feelsLike: number;
  humidity: number;       // percentage
  pressure: number;       // hPa
  windSpeed: number;      // m/s
  windDeg: number;
  icon: string;           // OWM icon code (e.g. "01d")
  description: string;    // e.g. "scattered clouds"
  precipitation: number;  // 24h rain probability (0–100), simulated for free-tier
  sunrise: number;        // unix ts
  sunset: number;
  dt: number;
}

export interface OpenWeatherCurrentResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
  dt: number;
  rain?: { "1h"?: number; "3h"?: number };
  name?: string;  // city name from OWM response
}

export interface BaliRegion {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
}
