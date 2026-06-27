CropEngine.spec.md
CropEngine Specification
Version

v1.0

Purpose

CropEngine 負責讀取 crops.json，提供作物查詢、作物基本資料、生育期風險與常見病害資料。

Responsibilities
載入 crops.json
依作物名稱查詢
支援 aliases 別名查詢
回傳作物適合溫度與濕度
回傳作物敏感生育期
回傳作物常見病害
Input
cropName = "芒果"
stage = "結果期"
Output
{
  found: true,
  id,
  name,
  category,
  idealTemp,
  idealHumidity,
  stageRisks,
  commonDiseases,
  notes
}
Dependencies
data/crops.json
Workflow
cropName
↓
crops.json
↓
crop profile
↓
AIAKOS
Design Principles
只處理作物知識
不處理氣象資料
不處理病害推估
不處理決策建議
Future Features
作物生育期資料庫
灌溉需求
施肥需求
採收期判斷
作物成長模型