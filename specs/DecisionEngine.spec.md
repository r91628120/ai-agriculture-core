DecisionEngine.spec.md
DecisionEngine Specification
Version

v1.0

Purpose

DecisionEngine 負責整合氣象、作物與病害分析結果，產生 AI 農業決策建議。

Responsibilities
評估高溫風險
評估濕度風險
評估降雨風險
評估風速風險
建立 AI 決策矩陣
計算 AI 可信度
產生農事建議
產生決策摘要
Input
{
  crop,
  stage,
  weather,
  diseaseRisk
}
Output
{
  success: true,
  risks,
  matrix,
  confidenceScore,
  decisionConfidence,
  farmActions,
  summary
}
Dependencies
Weather Data
CropEngine result
DiseaseEngine result
Workflow
weather + crop + disease
↓
risk evaluation
↓
decision matrix
↓
confidence score
↓
farm actions
Design Principles
不直接替農民做最終決策
提供可解釋建議
優先考量作物安全
適合教育情境使用
Future Features
AI Decision Confidence v2
農事日曆整合
採收時機建議
防災決策流程
多作物比較決策