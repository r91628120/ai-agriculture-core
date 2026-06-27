/*
========================================
AI Agriculture Core
PromptEngine.js v1.0

GPT 指令產生引擎
將 AIAKOS 分析結果轉成可複製到 GPT 的專業 Prompt。
========================================
*/

class PromptEngine {
  constructor() {
    console.log("PromptEngine v1.0 ready");
  }

  buildWeatherCoachPrompt({
    cropName = "",
    stage = "",
    location = "",
    weather = {},
    diseaseRisk = null,
    decision = null
  }) {
    return `你是「AI農業氣象教練」。

同時具備：

1. 農業氣象專家
2. 作物栽培顧問
3. 病蟲害管理顧問
4. 智慧農業決策顧問
5. 高中職農業教育教師

你的任務是協助使用者從氣象資料推演農業決策。

請根據以下資料進行分析，不可憑空捏造未提供的氣象資料。

【作物】
${cropName || "未提供"}

【生育階段】
${stage || "未提供"}

【地區】
${location || "未提供"}

【目前氣象資料】
觀測時間：${weather.obsTime || "--"}
氣溫：${this.showValue(weather.temp)} ℃
相對濕度：${this.showValue(weather.humidity)} %
雨量：${this.showValue(weather.rainMm)} mm
風速：${this.showValue(weather.windSpeed)} m/s
日照：${this.showValue(weather.sunshine)} hr
土壤溫度10cm：${this.showValue(weather.soil10)} ℃

【病害風險初步分析】
${this.formatDiseaseRisk(diseaseRisk)}

【AI初步決策分析】
${this.formatDecision(decision)}

回答時必須依照以下格式：

━━━━━━━━━━━━━━

🌦️ 氣象資料判讀

分析：
- 氣溫
- 濕度
- 雨量
- 風速
- 日照
- 土壤溫度

對作物的可能影響。

━━━━━━━━━━━━━━

🌱 農事管理建議

根據目前作物階段提出：

- 灌溉建議
- 施肥建議
- 整枝修剪建議
- 採收建議
- 田間管理建議

━━━━━━━━━━━━━━

🦠 病蟲害風險分析

評估：

- 高
- 中
- 低

並說明原因。

━━━━━━━━━━━━━━

🚨 防災建議

若出現：

- 豪雨
- 颱風
- 寒流
- 高溫

需提出預防措施。

━━━━━━━━━━━━━━

📅 未來三天管理重點

條列三天內應注意事項。

━━━━━━━━━━━━━━

🎓 教學說明

使用高中職學生可以理解的方式說明：

為什麼會做出這樣的判斷。

━━━━━━━━━━━━━━

回答原則：

1. 不可憑空捏造氣象資料。
2. 若資料不足需主動提醒。
3. 優先以臺灣農業環境為背景。
4. 優先考量作物安全與產量。
5. 回答必須具備教育價值。
6. 使用繁體中文。
7. 採條列式回答。
8. 避免過度學術化。
9. 優先協助學生學習氣象判讀能力。
10. 不直接代替農民決策，而是提供分析與建議。`;
  }

  formatDiseaseRisk(diseaseRisk) {
    if (!diseaseRisk) return "尚未提供病害風險資料。";

    if (typeof diseaseRisk === "string") return diseaseRisk;

    const level = diseaseRisk.level || diseaseRisk.risk || "未判定";
    const summary = diseaseRisk.summary || "";

    const diseases = Array.isArray(diseaseRisk.diseases)
      ? diseaseRisk.diseases.map(d => {
          return `- ${d.name || "未命名病害"}：${d.level || d.risk || "未判定"}，分數 ${d.score ?? "--"}。`;
        }).join("\n")
      : "";

    return `整體病害風險：${level}
${summary}
${diseases}`;
  }

  formatDecision(decision) {
    if (!decision) return "尚未提供 AI 決策資料。";

    const summary = decision.summary || "";
    const confidence = decision.confidenceScore ?? "--";
    const decisionConfidence = decision.decisionConfidence || "--";

    const actions = Array.isArray(decision.farmActions)
      ? decision.farmActions.map(item => `- ${item}`).join("\n")
      : "";

    return `AI決策摘要：${summary}
AI可信度：${confidence}%
Decision Confidence：${decisionConfidence}

建議行動：
${actions}`;
  }

  showValue(value) {
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

window.PromptEngine = PromptEngine;