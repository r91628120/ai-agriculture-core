AIAKOS Framework v2.0 Documentation Standard

Version：v2.0

Last Update：2026-07-02

一、目的（Purpose）

本文件規範 AIAKOS Framework 所有文件的撰寫方式。

包含：

Engine
Module
Service
Data
Controller
Agent
API
Architecture
Development Log

所有文件皆依照相同格式撰寫，以提升：

可閱讀性
可維護性
可擴充性
AI 協作效率
團隊開發一致性
二、文件分類

Framework 共分成八種文件：

docs/
│
├── README.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── Development-Log.md
├── Documentation-Standard.md
│
specs/
│
├── Engine.spec.md
├── Module.spec.md
├── Service.spec.md
├── Agent.spec.md
└── API.spec.md
三、Engine 文件格式

每個 Engine 採固定格式：

# Engine Name

## Version

## Purpose

## Responsibilities

## Public Methods

## Input

## Output

## Dependencies

## Rules

## EventBus Integration

## Future Extension

## History

例如：

WeatherEngine.spec.md

內容：

# WeatherEngine

## Version

v2.0

## Purpose

提供融合氣象資料。

## Responsibilities

- 即時氣象
- 三站融合
- 可信度

## Public Methods

getFusionWeather()

## Input

stations[]

## Output

FusionWeather

## Dependencies

WeatherAPI

WeatherFusionEngine

## EventBus

None

## Future

支援 CWA API
四、Module 文件格式

所有 Module 一律：

# Module Name

## Version

## Purpose

## Controller Integration

## EventBus Integration

### Listens To

### Emits

## Public Methods

## Input

## Output

## Rules

## Future Extension

## History

例如：

AnalysisModule

一定要寫：

Listens To

analysis:completed

Emits

analysis:built
五、Service 文件格式
# Service Name

## Version

## Purpose

## External API

## Public Methods

## Input

## Output

## Dependencies

## Error Handling

## Future

例如：

WeatherAPI

StationService
六、Data 文件格式

所有 JSON 都要有 Spec。

例如：

crops.json

建立：

CropData.spec.md

格式：

# Crop Data

## Version

## Source

## Schema

## Required Fields

## Optional Fields

## Validation Rules

## Example

## History
七、Controller 文件格式

Controller 不屬於 Engine。

統一：

# Controller Name

## Version

## Purpose

## Flow

## Public Methods

## EventBus

## Dependencies

## Rules

## Future

例如：

AIAKOS Controller
八、EventBus 規格

每新增事件，

一定要登錄。

例如：

## Event

analysis:completed

### Emitter

Controller

### Listener

DashboardModule

AnalysisModule

### Payload

{
    input,
    result
}

下一個：

analysis:built

也要登錄。

九、Development Log

採日期紀錄。

格式：

# Development Log

## 2026-07-02

### Added

...

### Updated

...

### Fixed

...

### Refactor

...

### Architecture

...

### Next Step

...

不要一直：

AIAKOS v2

AIAKOS v2

AIAKOS v2

重複。

十、Architecture 文件

固定章節：

# Overview

# Folder Structure

# Controller Layer

# EventBus

# Modules

# Engines

# Services

# Data

# Future Agent

# Dependency Graph
十一、Method 註解格式（JavaScript）

所有公開方法：

/*
----------------------------
方法名稱
----------------------------
用途說明
*/

例如：

/*
----------------------------
analyzeFarmDecision()
----------------------------
統一農場分析入口
*/
十二、版本規範

Engine：

WeatherEngine v2.1

Module：

AnalysisModule v2.0

Framework：

AIAKOS Framework v2.0

不要全部一起升版。

十三、命名規範

Engine

WeatherEngine
DiseaseEngine

Module

DashboardModule
AnalysisModule
HistoryModule

Service

WeatherAPI
StationService

Event

analysis:completed

analysis:built

weather:updated

history:saved

全部採：

小寫:事件
十四、Framework 設計原則

AIAKOS 採五項核心原則：

Single Responsibility（單一職責）
Low Coupling（低耦合）
Event-driven（事件驅動）
Modular Design（模組化）
Extensible Framework（可擴充 Framework）
十五、AIAKOS 開發流程（Developer Workflow）

所有功能均遵循以下流程：

需求討論
    │
    ▼
Architecture Design
    │
    ▼
Spec 撰寫
    │
    ▼
程式開發
    │
    ▼
Development Log 更新
    │
    ▼
功能測試
    │
    ▼
Framework 整合