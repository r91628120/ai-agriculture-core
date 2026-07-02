/*
========================================
AI Agriculture Core
AnalysisModule.js v1.0

AIAKOS Analysis Module
負責統一整理 AIAKOS.analyze() 的分析結果，
成為 Dashboard、Report、Prompt、API 的共同出口。
========================================
*/

class AnalysisModule {
  constructor() {
    console.log("AnalysisModule v1.0 ready");
  }

  
     /*
  ----------------------------
  綁定 EventBus
  ----------------------------
  */

  bindEventBus(eventBus) {
    if (!eventBus) {
      console.warn("AnalysisModule：EventBus 不存在");
      return;
    }

    eventBus.on("analysis:completed", (payload) => {
      console.log("[AnalysisModule] analysis completed");

      if (!payload || !payload.result) {
        console.warn("AnalysisModule：analysis:completed 缺少 result");
        return;
      }

      const analysis =
        this.build(payload.result);

      eventBus.emit("analysis:built", {
        input: payload.input,
        result: payload.result,
        analysis,
        timestamp: new Date().toISOString()
      });
    });
  }


  build(result) {
    if (!result || result.success !== true) {
      return this.buildError(result);
    }

    return {
      success: true,
      meta: this.buildMeta(result),
      weather: this.buildWeather(result),
      disease: this.buildDisease(result),
      decision: this.buildDecision(result),
      prompt: this.buildPrompt(result),
      summary: this.buildSummary(result),
      raw: result
    };
  }

  buildError(result) {
    return {
      success: false,
      message: result?.message || "AnalysisModule：分析資料不足。",
      raw: result || null
    };
  }

  buildMeta(result) {
    return {
      cropName: result.cropName || "--",
      stage: result.stage || "--",
      county: result.location?.county || "--",
      township: result.location?.township || "--",
      lat: result.location?.lat ?? "--",
      lng: result.location?.lng ?? "--",
      generatedAt: new Date().toISOString(),
      system: "AIAKOS",
      version: "v1.0"
    };
  }

  buildWeather(result) {
    const weather = result.weather || {};
    const fusion = result.fusion || {};

    return {
      temp: this.show(weather.temp),
      humidity: this.show(weather.humidity),
      rainMm: this.show(weather.rainMm),
      windSpeed: this.show(weather.windSpeed),
      sunshine: this.show(weather.sunshine),
      obsTime: weather.obsTime || "--",
      fusion: {
        stationCount: fusion.stationCount ?? "--",
        stations: fusion.stations || [],
        confidence: fusion.quality?.confidence ?? "--",
        completeness: fusion.quality?.completeness ?? "--",
        consistency: fusion.quality?.consistency ?? "--"
      }
    };
  }

  buildDisease(result) {
    const diseaseRisk = result.diseaseRisk || {};

    return {
      level: diseaseRisk.level || "--",
      summary: diseaseRisk.summary || "尚無病害分析摘要。",
      diseases: Array.isArray(diseaseRisk.diseases)
        ? diseaseRisk.diseases.map(d => ({
            name: d.name || "--",
            level: d.level || "--",
            score: d.score ?? "--",
            reasons: d.reasons || [],
            advice: d.advice || ""
          }))
        : []
    };
  }

  buildDecision(result) {
    const decision = result.decision || {};

    return {
      confidenceScore: decision.confidenceScore ?? "--",
      decisionConfidence: decision.decisionConfidence || "--",
      summary: decision.summary || "尚無決策摘要。",
      risks: decision.risks || {},
      matrix: decision.matrix || {},
      farmActions: decision.farmActions || []
    };
  }

  buildPrompt(result) {
    return {
      weatherCoachPrompt: result.prompt || ""
    };
  }

  buildSummary(result) {
    const cropName = result.cropName || "作物";
    const stage = result.stage || "未指定生育期";

    const weather = result.weather || {};
    const diseaseLevel = result.diseaseRisk?.level || "--";
    const decisionLevel = result.decision?.decisionConfidence || "--";
    const confidence = result.decision?.confidenceScore ?? "--";

    return `${cropName}目前生育階段為「${stage}」。氣溫 ${this.show(weather.temp)}℃，濕度 ${this.show(weather.humidity)}%，雨量 ${this.show(weather.rainMm)}mm。病害風險為「${diseaseLevel}」，Decision Confidence 為「${decisionLevel}」，AI可信度 ${confidence}%。`;
  }

  toJSON(result) {
    return JSON.stringify(this.build(result), null, 2);
  }

  show(value) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "--"
    ) {
      return "--";
    }

    return value;
  }
}

window.AnalysisModule = AnalysisModule;