/*
========================================
AI Agriculture Core
DashboardModule.js v1.0

AIAKOS Dashboard UI Module
負責把 AIAKOS.analyze() 的結果呈現在畫面上
========================================
*/

class DashboardModule {
  constructor() {
    console.log("DashboardModule v1.0 ready");
  }

  render(result) {
    if (!result || result.success !== true) {
      this.renderError(result?.message || "尚未取得 AIAKOS 分析結果");
      return;
    }

    this.renderWeather(result.weather);
    this.renderConfidence(result);
    this.renderDisease(result.diseaseRisk);
    this.renderDecision(result.decision);
    this.renderPrompt(result.prompt);
  }

  renderWeather(weather = {}) {
    this.setText("dashTemp", `${this.show(weather.temp)} ℃`);
    this.setText("dashHumidity", `${this.show(weather.humidity)} %`);
    this.setText("dashRain", `${this.show(weather.rainMm)} mm`);
    this.setText("dashWind", `${this.show(weather.windSpeed)} m/s`);
    this.setText("dashSunshine", `${this.show(weather.sunshine)} hr`);
  }

  renderConfidence(result) {
    const confidence =
      result.fusion?.quality?.confidence ??
      result.decision?.confidenceScore ??
      "--";

    this.setText("v3Confidence", `${confidence}%`);

    const panel = document.getElementById("aiConfidencePanel");
    if (!panel) return;

    panel.innerHTML = `
      <div class="confidence-big">
        <strong>${confidence}%</strong>
        <span>AI可信度評分</span>
      </div>

      <div class="confidence-detail-list">
        <div class="confidence-detail">
          <span>資料完整度</span>
          <strong>${result.fusion?.quality?.completeness ?? "--"}%</strong>
        </div>
        <div class="confidence-detail">
          <span>三站一致性</span>
          <strong>${result.fusion?.quality?.consistency ?? "--"}%</strong>
        </div>
        <div class="confidence-detail">
          <span>測站數量</span>
          <strong>${result.fusion?.stationCount ?? "--"} 站</strong>
        </div>
      </div>
    `;
  }

  renderDisease(diseaseRisk) {
    const box = document.getElementById("diseaseRiskLights");
    if (!box) return;

    if (!diseaseRisk || !Array.isArray(diseaseRisk.diseases)) {
      box.innerHTML = `<div class="empty-state">尚無病害風險資料。</div>`;
      return;
    }

    if (diseaseRisk.diseases.length === 0) {
      box.innerHTML = `
        <div class="empty-state">
          ${diseaseRisk.summary || "目前無專屬病害資料，已採一般病害風險推估。"}
        </div>
      `;
      return;
    }

    box.innerHTML = diseaseRisk.diseases.map(d => {
      const cls =
        d.level === "高" ? "risk-high-box" :
        d.level === "中" ? "risk-mid-box" :
        "risk-low-box";

      const dot =
        d.level === "高" ? "🔴" :
        d.level === "中" ? "🟡" :
        "🟢";

      return `
        <div class="disease-light ${cls}">
          <div class="disease-head">
            <span class="risk-dot">${dot}</span>
            <strong>${d.name}</strong>
            <b>${d.level}</b>
          </div>
          <p style="margin-top:10px;">風險分數：${d.score}</p>
          <p>${(d.reasons || []).join("<br>")}</p>
        </div>
      `;
    }).join("");
  }

  renderDecision(decision) {
    if (!decision) return;

    this.renderFarmAdvice(decision);
    this.renderDecisionConfidence(decision);
    this.renderDecisionMatrix(decision);
  }

  renderFarmAdvice(decision) {
    const box = document.getElementById("farmAdviceCards");
    if (!box) return;

    const actions = decision.farmActions || [];

    box.innerHTML = actions.map((text, index) => `
      <div class="farm-advice-card">
        <div class="advice-icon">${this.getAdviceIcon(index)}</div>
        <h4>農事建議 ${index + 1}</h4>
        <p>${text}</p>
      </div>
    `).join("");
  }

  renderDecisionConfidence(decision) {
    const panel = document.getElementById("decisionConfidencePanel");
    if (!panel) return;

    const score = decision.confidenceScore ?? 0;

    panel.innerHTML = `
      <div class="decision-meter">
        <div class="decision-meter-main">
          <div class="decision-circle" style="--score:${score}%;">
            ${score}%
          </div>
          <div class="decision-meter-text">
            <strong>Decision Confidence：${decision.decisionConfidence}</strong>
            <p>${decision.summary}</p>
          </div>
        </div>
      </div>
    `;
  }

  renderDecisionMatrix(decision) {
    const panel = document.getElementById("decisionMatrixPanel");
    if (!panel || !decision.matrix) return;

    const rows = [
      ["採收風險", decision.matrix.harvest],
      ["運輸風險", decision.matrix.transport],
      ["病害風險", decision.matrix.disease],
      ["品質風險", decision.matrix.quality],
      ["田間作業風險", decision.matrix.fieldWork]
    ];

    panel.innerHTML = `
      <div class="matrix-table-wrap">
        <table class="decision-matrix">
          <thead>
            <tr>
              <th>決策項目</th>
              <th>風險等級</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(([name, level]) => `
              <tr>
                <td>${name}</td>
                <td class="${this.levelClass(level)}">${level}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  renderPrompt(prompt) {
    const textarea = document.getElementById("aiPromptOutput");
    if (!textarea) return;

    textarea.value = prompt || "尚未產生 AI Prompt。";
  }

  renderError(message) {
    const riskBox = document.getElementById("weatherRisk");
    if (riskBox) {
      riskBox.innerHTML = `<p>⚠️ ${message}</p>`;
    }
  }

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  show(value) {
    if (value === null || value === undefined || value === "" || value === "--") {
      return "--";
    }
    return value;
  }

  levelClass(level) {
    if (level === "高") return "matrix-danger";
    if (level === "中") return "matrix-watch";
    return "matrix-good";
  }

  getAdviceIcon(index) {
    const icons = ["🌱", "🌧️", "☀️", "🚚", "🦠"];
    return icons[index % icons.length];
  }
}

window.DashboardModule = DashboardModule;