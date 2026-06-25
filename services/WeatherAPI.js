/*
========================================
AI Agriculture Core
WeatherAPI.js v1.0
農業氣象 API 服務層
========================================
*/

class WeatherAPI {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchWeather(stationId) {
    const url =
      this.apiUrl +
      "?location=" +
      encodeURIComponent(stationId);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("WeatherAPI：API 回應失敗");
    }

    return await response.json();
  }
}

window.WeatherAPI = WeatherAPI;