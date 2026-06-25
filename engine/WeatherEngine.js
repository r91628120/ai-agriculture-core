/*
========================================
AI Agriculture Core
WeatherEngine.js v2.0
農業氣象核心引擎
========================================

新增能力：
1. 取得單一測站氣象資料
2. 同時取得最近三站氣象資料
3. 串接 WeatherFusionEngine
4. 回傳 fusionResult 給 V3.0 決策中心使用
*/

class WeatherEngine {
  constructor(weatherAPI, fusionEngine = null) {
    this.weatherAPI = weatherAPI;
    this.fusionEngine = fusionEngine;
  }

  async getWeather(stationId, stationMeta = null) {
    if (!stationId) {
      throw new Error("WeatherEngine：缺少 stationId");
    }

    const rawData = await this.weatherAPI.fetchWeather(stationId);

    if (!rawData || rawData.success !== true) {
      return {
        success: false,
        message: rawData?.message || "無法取得氣象資料",
        stationId,
        station: stationMeta || { id: stationId, name: "--" }
      };
    }

    return {
      success: true,

      station: {
        id: rawData.stationId || stationMeta?.id || stationId,
        name: stationMeta?.name || rawData.stationName || rawData.station || "--",
        county: stationMeta?.county || "",
        township: stationMeta?.township || "",
        distanceKm: stationMeta?.distanceKm ?? null,
        lat: stationMeta?.lat ?? null,
        lng: stationMeta?.lng ?? null
      },

      current: {
        obsTime: rawData.obsTime || "--",
        temp: this.cleanValue(rawData.temp),
        humidity: this.cleanValue(rawData.humidity),
        rainMm: this.cleanValue(rawData.rainMm),
        windSpeed: this.cleanValue(rawData.windSpeed),
        sunshine: this.cleanValue(rawData.sunshine),
        soil10: this.cleanValue(rawData.soil10)
      },

      history: Array.isArray(rawData.history)
        ? rawData.history.map(item => this.normalizeHistory(item))
        : [],

      forecast: Array.isArray(rawData.forecast)
        ? rawData.forecast
        : [],

      raw: rawData
    };
  }

  async getWeatherByStations(stations = []) {
    if (!Array.isArray(stations) || stations.length === 0) {
      throw new Error("WeatherEngine：缺少 stations 陣列");
    }

    const results = await Promise.all(
      stations.map(async station => {
        try {
          return await this.getWeather(station.id, station);
        } catch (error) {
          return {
            success: false,
            message: error.message,
            station
          };
        }
      })
    );

    return results.filter(item => item && item.success === true);
  }

  async getFusionWeather(stations = []) {
    const stationWeatherList = await this.getWeatherByStations(stations);

    if (!this.fusionEngine) {
      return {
        success: true,
        stationWeatherList,
        fusion: null,
        message: "尚未設定 WeatherFusionEngine"
      };
    }

    const fusion = this.fusionEngine.fuse(stationWeatherList);

    return {
      success: fusion.success,
      stationWeatherList,
      fusion
    };
  }

  getCurrent(weatherData) {
    return weatherData?.current || null;
  }

  getHistory(weatherData) {
    return weatherData?.history || [];
  }

  getStation(weatherData) {
    return weatherData?.station || null;
  }

  normalizeHistory(item) {
    return {
      obsTime: item.obsTime || item.ObsTime || "--",
      temp: this.cleanValue(item.temp ?? item.Temperature),
      humidity: this.cleanValue(item.humidity ?? item.RH),
      rainMm: this.cleanValue(item.rainMm ?? item.Precp),
      windSpeed: this.cleanValue(item.windSpeed ?? item.WS),
      sunshine: this.cleanValue(item.sunshine ?? item.SunShine)
    };
  }

  cleanValue(value) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "--" ||
      value === -9999 ||
      value === "XXX"
    ) {
      return "--";
    }

    return value;
  }
}

window.WeatherEngine = WeatherEngine;