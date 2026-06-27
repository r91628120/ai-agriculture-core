DiseaseEngine.spec.md
DiseaseEngine Specification
Version

v1.0

Purpose

DiseaseEngine 負責依據作物、氣象條件與 diseases.json，推估病害風險。

Responsibilities
載入 diseases.json
依作物名稱篩選病害
根據氣溫、濕度、雨量、風速推估病害風險
回傳病害分數
回傳病害等級
回傳判斷原因與建議
Input
{
  cropName: "芒果",
  stage: "結果期",
  weather: {
    temp,
    humidity,
    rainMm,
    windSpeed
  }
}
Output
{
  success: true,
  cropName,
  stage,
  level,
  diseases: [
    {
      name,
      score,
      level,
      reasons,
      advice
    }
  ],
  summary
}
Dependencies
data/diseases.json
Weather Data
Crop Name
Workflow
crop + weather + stage
↓
diseases.json
↓
risk scoring
↓
disease risk result
Design Principles
不替代專業診斷
提供教育用風險推估
必須說明原因
必須保留資料不足提醒
Future Features
病蟲害分離
病害發生模型
圖像診斷整合
防治建議資料庫
病害知識圖譜