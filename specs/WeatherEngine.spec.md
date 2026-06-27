WeatherEngine.spec.md
WeatherEngine Specification
Version

v1.0

Purpose

WeatherEngine 負責取得農業氣象資料，並將多個測站資料交給 WeatherFusionEngine 進行融合分析。

Responsibilities
接收最近測站資料
呼叫 WeatherAPI 取得即時氣象
整理氣象欄位
傳送資料給 WeatherFusionEngine
回傳可供 AIAKOS 使用的氣象分析結果
Input
stations = [
  {
    id,
    name,
    distance
  }
]
Output
{
  success: true,
  fusion: {
    fused: {
      temp,
      humidity,
      rainMm,
      windSpeed,
      sunshine,
      obsTime
    },
    stations,
    quality
  }
}
Dependencies
WeatherAPI
WeatherFusionEngine
StationService
Workflow
stations
↓
WeatherAPI
↓
weather records
↓
WeatherFusionEngine
↓
fusion result
Design Principles
不處理畫面
不做病害判斷
不做農事決策
只負責氣象資料取得與整理
Future Features
6 小時歷史氣象
24 小時趨勢分析
CWA 預報資料整合
IoT 感測器資料整合