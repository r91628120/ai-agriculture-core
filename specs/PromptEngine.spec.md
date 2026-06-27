PromptEngine.spec.md
PromptEngine Specification
Version

v1.0

Purpose

PromptEngine 負責將 AIAKOS 分析結果轉換成可提供給 GPT 或其他 LLM 的農業分析指令。

Responsibilities
產生 AI農業氣象教練 Prompt
整合氣象資料
整合病害風險
整合決策建議
保持繁體中文與教育語氣
避免輸出內部系統提示
Input
{
  cropName,
  stage,
  location,
  weather,
  diseaseRisk,
  decision
}
Output
string
Dependencies
DiseaseEngine result
DecisionEngine result
Weather Data
Prompt Library
Workflow
AIAKOS result
↓
PromptEngine
↓
GPT prompt
Design Principles
不捏造氣象資料
資料不足時主動提醒
優先以台灣農業情境回答
適合高中職學生理解
保留教育價值
Future Features
多種 GPT Prompt 模板
AISL Prompt
Carbon Prompt
Plant Doctor Prompt
Marketing Prompt
Agent Prompt