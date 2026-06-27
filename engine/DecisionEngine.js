/*
========================================
AI Agriculture Core
DecisionEngine.js v1.0

AI 農業決策引擎
整合氣象、作物、病害與風險資料，
產生 AI 農業決策建議。
========================================
*/

class DecisionEngine {
  constructor() {
    console.log("DecisionEngine v1.0 ready");
  }

  analyze({ crop, stage = "", weather, diseaseRisk = null }) {
    if (!weather) {
      return {
        success: false,
        message: "缺少氣象資料，無法進行決策分析。"
      };
    }

    const temp = this.toNumber(weather.temp);
    const humidity = this.toNumber(weather.humidity);
    const rainMm = this.toNumber(weather.rainMm);
    const windSpeed = this.toNumber(weather.windSpeed);
    const sunshine = this.toNumber(weather.sunshine);

    const risks = {
      heat: this.evaluateHeat(temp),
      humidity: this.evaluateHumidity(humidity),
      rain: this.evaluateRain(rainMm),
      wind: this.evaluateWind(windSpeed),
      sunshine: this.evaluateSunshine(sunshine)
    };

    const matrix = this.buildDecisionMatrix(risks, diseaseRisk);
    const confidenceScore = this.calculateConfidence(weather, risks);
    const decisionConfidence = this.getConfidenceLevel(confidenceScore);
    const farmActions = this.buildFarmActions(risks, crop, stage, diseaseRisk);
    const summary = this.buildSummary(crop, stage, risks, confidenceScore);

    return {
      success: true,
      crop: crop?.name || crop || "未指定作物",
      stage,
      weather,
      risks,
      matrix,
      diseaseRisk,
      confidenceScore,
      decisionConfidence,
      farmActions,
      summary
    };
  }

  toNumber(value) {
    if (value === null || value === undefined || value === "--") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  evaluateHeat(temp) {
    if (temp === null) return "未知";
    if (temp >= 35) return "高";
    if (temp >= 30) return "中";
    return "低";
  }

  evaluateHumidity(humidity) {
    if (humidity === null) return "未知";
    if (humidity >= 85) return "高";
    if (humidity >= 70) return "中";
    return "低";
  }

  evaluateRain(rainMm) {
    if (rainMm === null) return "未知";
    if (rainMm >= 20) return "高";
    if (rainMm >= 5) return "中";
    return "低";
  }

  evaluateWind(windSpeed) {
    if (windSpeed === null) return "未知";
    if (windSpeed >= 8) return "高";
    if (windSpeed >= 4) return "中";
    return "低";
  }

  evaluateSunshine(sunshine) {
    if (sunshine === null) return "未知";
    if (sunshine >= 8) return "高";
    if (sunshine >= 3) return "中";
    return "低";
  }

  buildDecisionMatrix(risks, diseaseRisk) {
    const diseaseLevel =
      diseaseRisk?.level ||
      diseaseRisk?.risk ||
      this.deriveDiseaseLevel(risks);

    return {
      harvest: this.maxRisk([risks.rain, risks.wind, risks.heat]),
      transport: this.maxRisk([risks.rain, risks.wind]),
      disease: diseaseLevel,
      quality: this.maxRisk([risks.heat, risks.humidity, risks.rain]),
      fieldWork: this.maxRisk([risks.rain, risks.wind, risks.heat])
    };
  }

  deriveDiseaseLevel(risks) {
    if (risks.humidity === "高" || risks.rain === "高") return "高";
    if (risks.humidity === "中" || risks.rain === "中") return "中";
    return "低";
  }

  maxRisk(levels) {
    if (levels.includes("高")) return "高";
    if (levels.includes("中")) return "中";
    if (levels.includes("未知")) return "未知";
    return "低";
  }

  calculateConfidence(weather, risks) {
    let score = 100;

    const requiredFields = [
      weather.temp,
      weather.humidity,
      weather.rainMm,
      weather.windSpeed,
      weather.sunshine
    ];

    const missingCount = requiredFields.filter(
      v => v === null || v === undefined || v === "--"
    ).length;

    score -= missingCount * 8;

    if (risks.wind === "高") score -= 8;
    if (risks.rain === "高") score -= 8;
    if (risks.heat === "高") score -= 5;

    return Math.max(50, Math.min(100, score));
  }

  getConfidenceLevel(score) {
    if (score >= 85) return "高";
    if (score >= 70) return "中";
    return "低";
  }

  buildFarmActions(risks, crop, stage, diseaseRisk) {
    const actions = [];

    if (risks.heat === "高" || risks.heat === "中") {
      actions.push("注意高溫熱害，避免中午高溫時段進行高強度農事。");
    }

    if (risks.humidity === "高") {
      actions.push("相對濕度偏高，建議加強通風並巡田觀察病害。");
    }

    if (risks.rain === "高" || risks.rain === "中") {
      actions.push("近期雨量偏高，請注意排水、土壤積水與採收品質。");
    }

    if (risks.wind === "高" || risks.wind === "中") {
      actions.push("風速偏高，請留意支架、網室、果樹枝條與運輸穩定性。");
    }

    if (diseaseRisk && (diseaseRisk.level === "高" || diseaseRisk.risk === "高")) {
      actions.push("病害風險偏高，建議加強田間巡查並記錄病徵變化。");
    }

    if (actions.length === 0) {
      actions.push("目前氣象條件相對穩定，可依作物生育期安排一般農事。");
    }

    return actions;
  }

  buildSummary(crop, stage, risks, confidenceScore) {
    const cropName = crop?.name || crop || "作物";
    const stageText = stage ? `目前處於「${stage}」` : "目前未指定生育階段";

    const mainRisks = [];

    if (risks.heat === "高" || risks.heat === "中") mainRisks.push("高溫");
    if (risks.humidity === "高") mainRisks.push("高濕");
    if (risks.rain === "高" || risks.rain === "中") mainRisks.push("降雨");
    if (risks.wind === "高" || risks.wind === "中") mainRisks.push("風速");

    if (mainRisks.length === 0) {
      return `${cropName}${stageText}，目前氣象風險較低，AI 可信度 ${confidenceScore}%。`;
    }

    return `${cropName}${stageText}，需注意 ${mainRisks.join("、")} 風險，AI 可信度 ${confidenceScore}%。`;
  }
}

window.DecisionEngine = DecisionEngine;