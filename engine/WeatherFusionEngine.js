/*
========================================
AI Agriculture Core
WeatherFusionEngine.js v1.0
天氣融合引擎
========================================

職責：
1. 接收最近三站氣象資料
2. 計算加權融合氣象值
3. 判斷資料一致性
4. 產生 AI 可信度評分
*/

class WeatherFusionEngine {
  constructor() {}

  fuse(stationWeatherList = []) {
    const validStations = stationWeatherList.filter(item =>
      item &&
      item.current &&
      item.station
    );

    if (validStations.length === 0) {
      return {
        success: false,
        message: "WeatherFusionEngine：沒有可融合的測站資料"
      };
    }

    const fused = {
      temp: this.weightedAverage(validStations, "temp"),
      humidity: this.weightedAverage(validStations, "humidity"),
      rainMm: this.weightedAverage(validStations, "rainMm"),
      windSpeed: this.weightedAverage(validStations, "windSpeed"),
      sunshine: this.weightedAverage(validStations, "sunshine")
    };

    const consistency = this.calculateConsistency(validStations);
    const completeness = this.calculateCompleteness(validStations);
    const confidence = this.calculateConfidence(validStations, consistency, completeness);

    return {
      success: true,

      stationCount: validStations.length,

      stations: validStations.map(item => ({
        id: item.station.id,
        name: item.station.name,
        distanceKm: item.station.distanceKm ?? null,
        temp: item.current.temp,
        humidity: item.current.humidity,
        rainMm: item.current.rainMm,
        windSpeed: item.current.windSpeed,
        sunshine: item.current.sunshine
      })),

      fused,

      quality: {
        consistency,
        completeness,
        confidence
      },

      summary: this.buildSummary(fused, confidence, validStations.length)
    };
  }

  weightedAverage(stations, key) {
    let totalWeight = 0;
    let totalValue = 0;

    stations.forEach(item => {
      const value = Number(item.current[key]);

      if (Number.isNaN(value)) return;

      const distance = Number(item.station.distanceKm ?? 1);
      const weight = 1 / Math.max(distance, 0.5);

      totalValue += value * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return "--";

    return Number((totalValue / totalWeight).toFixed(1));
  }

  calculateConsistency(stations) {
    const tempValues = stations
      .map(item => Number(item.current.temp))
      .filter(v => !Number.isNaN(v));

    const rainValues = stations
      .map(item => Number(item.current.rainMm))
      .filter(v => !Number.isNaN(v));

    let score = 100;

    if (tempValues.length >= 2) {
      const tempRange = Math.max(...tempValues) - Math.min(...tempValues);
      if (tempRange > 3) score -= 20;
      else if (tempRange > 1.5) score -= 10;
    }

    if (rainValues.length >= 2) {
      const rainRange = Math.max(...rainValues) - Math.min(...rainValues);
      if (rainRange > 20) score -= 25;
      else if (rainRange > 5) score -= 15;
    }

    return Math.max(0, score);
  }

  calculateCompleteness(stations) {
    const fields = ["temp", "humidity", "rainMm", "windSpeed", "sunshine"];
    let total = 0;
    let valid = 0;

    stations.forEach(item => {
      fields.forEach(field => {
        total++;
        const value = item.current[field];
        if (value !== "--" && value !== null && value !== undefined && value !== "") {
          valid++;
        }
      });
    });

    return Math.round((valid / total) * 100);
  }

  calculateConfidence(stations, consistency, completeness) {
    let stationScore = 0;

    if (stations.length >= 3) stationScore = 100;
    else if (stations.length === 2) stationScore = 80;
    else stationScore = 60;

    const confidence =
      stationScore * 0.3 +
      consistency * 0.4 +
      completeness * 0.3;

    return Math.round(confidence);
  }

  buildSummary(fused, confidence, stationCount) {
    return `已整合 ${stationCount} 個鄰近農業氣象站資料，AI可信度 ${confidence}%。目前融合氣象：氣溫 ${fused.temp}℃、濕度 ${fused.humidity}%、雨量 ${fused.rainMm}mm、風速 ${fused.windSpeed}m/s。`;
  }
}

window.WeatherFusionEngine = WeatherFusionEngine;