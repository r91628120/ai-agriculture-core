WeatherFusionEngine.spec.md
WeatherFusionEngine Specification
Version

v1.0

Purpose

WeatherFusionEngine 負責整合多個農業氣象站資料，降低單一測站誤差，產生區域融合氣象結果。

Responsibilities
接收多站氣象資料
過濾無效資料
計算融合氣溫
計算融合濕度
計算融合雨量
計算融合風速
計算資料可信度
回傳融合結果
Input
weatherRecords = [
  {
    stationId,
    stationName,
    distance,
    temp,
    humidity,
    rainMm,
    windSpeed,
    sunshine,
    obsTime
  }
]
Output
{
  fused: {
    temp,
    humidity,
    rainMm,
    windSpeed,
    sunshine,
    obsTime
  },
  stations,
  stationCount,
  quality: {
    confidence,
    completeness,
    consistency
  }
}
Dependencies
WeatherEngine
WeatherAPI
StationService
Workflow
multiple station weather data
↓
data cleaning
↓
fusion calculation
↓
quality score
↓
fused weather result
Design Principles
優先採用最近三站
避免單一測站誤判
必須回傳可信度
必須保留原始測站資訊
Future Features
距離加權融合
雨量異常偵測
三站一致性評估 v2
地形修正
區域氣象風險圖