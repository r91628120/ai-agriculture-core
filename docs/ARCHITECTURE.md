AIAKOS Framework

AI Agricultural Knowledge Operating System

---

# Overall Architecture

```
Applications

│

├── AI Agricultural Weather Decision Support System

├── AI Plant Explorer

├── AI Plant Doctor

├── AI Farm Management Simulator

├── AI Carbon Management

├── AI Agricultural Education Platform

│

▼

AIAKOS Controller

│

▼

Engine Layer

│

├── WeatherEngine

├── WeatherFusionEngine

├── CropEngine

├── DiseaseEngine

├── DecisionEngine

├── PromptEngine

│

▼

Knowledge Layer

│

├── Knowledge Base

├── Rule Engine

├── Confidence Engine

├── Knowledge Graph

│

▼

Service Layer

│

├── Weather API

├── Station Service

├── Future IoT Service

├── Future Remote Sensing Service

│

▼

Data Layer

│

├── stations.json

├── crops.json

├── diseases.json

├── weather-rules.json

├── risk-rules.json

├── prompt-library.json

├── counties.json

├── soil.json
```

---

# Layer Description

## Controller Layer

Responsibilities

* Application Entry
* Workflow Control
* Engine Coordination
* Dashboard Rendering

Main File

```
AIAKOS.js
```

---

## Engine Layer

Responsible for AI reasoning.

WeatherEngine

Agricultural weather analysis.

WeatherFusionEngine

Multi-station weather fusion.

CropEngine

Crop knowledge.

DiseaseEngine

Disease risk estimation.

DecisionEngine

Agricultural decision support.

PromptEngine

LLM Prompt generation.

---

## Knowledge Layer

Stores reusable agricultural knowledge.

Includes:

* Crop Knowledge
* Disease Knowledge
* Weather Rules
* Decision Rules
* AI Prompt Templates

---

## Service Layer

Responsible for external data.

Examples:

* Weather API
* Station Service
* Future Drone API
* Future IoT API

---

## Data Layer

Persistent agricultural datasets.

Current

* stations.json
* crops.json
* diseases.json
* counties.json
* weather-rules.json
* risk-rules.json
* soil.json

---

# Design Principles

1.

Single Responsibility

Each Engine performs only one task.

2.

Reusable

Every platform shares the same AI Core.

3.

Scalable

New Engines can be added without modifying existing architecture.

4.

Educational

All AI decisions should be explainable for learning.

5.

Open Architecture

Designed for future AI Agents and agricultural applications.

---

# Future Architecture

```
Applications

↓

AIAKOS Controller

↓

AI Engines

↓

Knowledge Graph

↓

AI Memory

↓

Agricultural AI Agents
```

---

# Ultimate Goal

Create an AI Agricultural Knowledge Operating System that supports:

* Agricultural Education
* Smart Farming
* Sustainable Agriculture
* Agricultural Research
* AI Decision Support
* AI Simulation Learning
* Future Agricultural AI Agents

One Core

Unlimited Agricultural AI Applications.


## Framework Layers

```text
Applications
↓
AIAKOS Controller Layer
↓
EventBus
↓
Modules
↓
Engines
↓
Services
↓
Data


## 3. Development-Log.md 新增紀錄

```md
## 2026-07-02

### Architecture
- 專案正式定位為 `AIAKOS Framework`。
- `AI Agriculture Core` 轉型為 AIAKOS Framework 的核心基礎。
- 新增 `guides/` 資料夾，作為 Framework Developer Guide 文件區。
- 新增 `EventBus-Guide.md`，作為事件驅動架構使用指南。

### Direction
- 未來所有 Engine、Module、Service、Agent 皆以 AIAKOS Framework 規範開發。



