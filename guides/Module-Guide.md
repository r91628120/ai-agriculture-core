# Module Guide

Version：v2.0

Last Update：2026-07-02

---

# Purpose

Module 是 AIAKOS Framework 中負責功能整合與畫面呈現的組件。

Module 位於 Controller 與 Engine 之間，負責接收事件、整理資料、更新畫面，但不直接進行農業知識推論。

Module 的設計目標為：

- 高內聚（High Cohesion）
- 低耦合（Low Coupling）
- 可重複使用（Reusable）
- 可獨立測試（Testable）

---

# Module Responsibilities

Module 可以負責：

- Dashboard 畫面更新
- Analysis 整理
- Prompt 產生
- History 管理
- Report 輸出
- Scenario 呈現
- Chart 繪製

Module 不負責：

- 農業知識判斷
- AI 決策推論
- API 呼叫
- JSON 載入
- Engine 邏輯

---

# Standard Structure

所有 Module 建議採用以下結構：

```javascript
class ExampleModule {

    constructor() {

    }

    bindEventBus(eventBus) {

    }

    render(data) {

    }

    helper() {

    }

}