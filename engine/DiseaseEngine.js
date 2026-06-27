/*
========================================
AI Agriculture Core
DiseaseEngine.js v1.0

作物病害風險引擎
根據作物、氣象與 diseases.json 推估病害風險。
========================================
*/

class DiseaseEngine {
  constructor(diseases = []) {
    this.diseases = diseases;
    console.log("DiseaseEngine v1.0 ready");
  }

  static async load(jsonPath = "data/diseases.json") {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error("DiseaseEngine：無法讀取 diseases.json");
    }

    const diseases = await response.json();
    return new DiseaseEngine(diseases);
  }

  evaluate({ cropName, weather, stage = "" }) {
    if (!cropName || !weather) {
      return {
        success: false,
        message: "DiseaseEngine：缺少作物名稱或氣象資料。"
      };
    }

    const matchedDiseases = this.findDiseasesByCrop(cropName);

    if (matchedDiseases.length === 0) {
      return {
        success: true,
        cropName,
        stage,
        level: this.estimateGeneralDiseaseRisk(weather),
        diseases: [],
        summary: "目前資料庫尚未建立此作物的專屬病害資料，系統先依溫度、濕度與雨量估算一般病害風險。"
      };
    }

    const diseaseResults = matchedDiseases.map(disease => {
      const score = this.calculateDiseaseScore(disease, weather, stage);
      const level = this.scoreToLevel(score);

      return {
        id: disease.id || disease.name,
        name: disease.name,
        crop: disease.crop,
        score,
        level,
        reasons: this.buildReasons(disease, weather, stage),
        advice: disease.advice || "建議加強巡田觀察，必要時依照作物病害防治建議處理。"
      };
    });

    const highestScore = Math.max(...diseaseResults.map(d => d.score));
    const overallLevel = this.scoreToLevel(highestScore);

    return {
      success: true,
      cropName,
      stage,
      level: overallLevel,
      diseases: diseaseResults,
      summary: this.buildSummary(cropName, diseaseResults, overallLevel)
    };
  }

  findDiseasesByCrop(cropName) {
    return this.diseases.filter(disease => {
      const crops = disease.crops || disease.crop || [];
      const cropList = Array.isArray(crops) ? crops : [crops];

      return cropList.some(crop =>
        cropName.includes(crop) || crop.includes(cropName)
      );
    });
  }

  calculateDiseaseScore(disease, weather, stage) {
    const temp = this.toNumber(weather.temp);
    const humidity = this.toNumber(weather.humidity);
    const rainMm = this.toNumber(weather.rainMm);
    const windSpeed = this.toNumber(weather.windSpeed);

    let score = 20;

    const conditions = disease.conditions || {};

    if (conditions.tempRange && temp !== null) {
      const [min, max] = conditions.tempRange;
      if (temp >= min && temp <= max) score += 25;
      else if (temp >= min - 3 && temp <= max + 3) score += 10;
    }

    if (conditions.humidityMin && humidity !== null) {
      if (humidity >= conditions.humidityMin) score += 25;
      else if (humidity >= conditions.humidityMin - 10) score += 10;
    }

    if (conditions.rainMin !== undefined && rainMm !== null) {
      if (rainMm >= conditions.rainMin) score += 20;
      else if (rainMm >= conditions.rainMin / 2) score += 10;
    }

    if (conditions.windSensitive && windSpeed !== null && windSpeed >= 4) {
      score += 8;
    }

    if (
      stage &&
      Array.isArray(disease.sensitiveStages) &&
      disease.sensitiveStages.includes(stage)
    ) {
      score += 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  estimateGeneralDiseaseRisk(weather) {
    const humidity = this.toNumber(weather.humidity);
    const rainMm = this.toNumber(weather.rainMm);

    if (humidity >= 85 || rainMm >= 20) return "高";
    if (humidity >= 75 || rainMm >= 5) return "中";
    return "低";
  }

  scoreToLevel(score) {
    if (score >= 70) return "高";
    if (score >= 45) return "中";
    return "低";
  }

  buildReasons(disease, weather, stage) {
    const reasons = [];
    const temp = this.toNumber(weather.temp);
    const humidity = this.toNumber(weather.humidity);
    const rainMm = this.toNumber(weather.rainMm);

    const conditions = disease.conditions || {};

    if (conditions.tempRange && temp !== null) {
      const [min, max] = conditions.tempRange;
      if (temp >= min && temp <= max) {
        reasons.push(`目前氣溫 ${temp}℃ 落在 ${disease.name} 易發溫度範圍。`);
      }
    }

    if (conditions.humidityMin && humidity !== null && humidity >= conditions.humidityMin) {
      reasons.push(`目前濕度 ${humidity}% 偏高，有利病害發生。`);
    }

    if (conditions.rainMin !== undefined && rainMm !== null && rainMm >= conditions.rainMin) {
      reasons.push(`目前雨量 ${rainMm}mm，需注意雨後病害擴散。`);
    }

    if (
      stage &&
      Array.isArray(disease.sensitiveStages) &&
      disease.sensitiveStages.includes(stage)
    ) {
      reasons.push(`目前「${stage}」屬於此病害較敏感的生育階段。`);
    }

    if (reasons.length === 0) {
      reasons.push("目前氣象條件未明顯達到高風險門檻，但仍建議持續觀察。");
    }

    return reasons;
  }

  buildSummary(cropName, diseaseResults, overallLevel) {
    const highDiseases = diseaseResults
      .filter(d => d.level === "高")
      .map(d => d.name);

    if (highDiseases.length > 0) {
      return `${cropName} 目前病害整體風險為「${overallLevel}」，需特別注意：${highDiseases.join("、")}。`;
    }

    return `${cropName} 目前病害整體風險為「${overallLevel}」，建議維持巡田與環境觀察。`;
  }

  toNumber(value) {
    if (value === null || value === undefined || value === "--") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
}

window.DiseaseEngine = DiseaseEngine;