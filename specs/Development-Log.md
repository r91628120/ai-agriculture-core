## AIAKOS Framework v2.0

### Added
- 新增 `engine/EventBus.js`。
- 建立 AIAKOS Framework 共用事件總線。
- `AIAKOS.js` 新增 `this.eventBus`。
- `analyzeFarmDecision()` 完成分析後會發送 `analysis:completed` 事件。

### Architecture
- Controller Layer 不再需要直接通知所有 Module。
- 未來 Dashboard、Prompt、History、Scenario 等 Module 可透過 EventBus 自動監聽分析結果。

### Updated
- `WeatherDashboardModule` 新增 `bindEventBus(eventBus)` 方法。
- `WeatherDashboardModule` 開始監聽 `analysis:completed` 事件。
- 分析完成後，Dashboard 可透過 EventBus 自動更新畫面。

### Architecture
- Dashboard 更新流程由直接呼叫改為事件驅動。
- `AIAKOS Controller Layer` 不再需要知道 Dashboard 的細節。

### Updated
- `AnalysisModule` 新增 `bindEventBus(eventBus)` 方法。
- `AnalysisModule` 開始監聽 `analysis:completed` 事件。
- `AnalysisModule` 接收到分析完成事件後，會自動執行 `build(result)`。
- `AnalysisModule` 完成整理後，會發送 `analysis:built` 事件。

### Architecture
- `analysis:completed` 代表 Controller 完成原始分析。
- `analysis:built` 代表 AnalysisModule 已整理成標準化分析資料。
- Dashboard 可讀取原始 result。
- Report、History、Prompt、Agent 未來可優先讀取 analysis。