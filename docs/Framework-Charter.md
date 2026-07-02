# AIAKOS Framework Charter

Version：v2.0

Last Update：2026-07-02

---

# AI Agricultural Knowledge Operating System

AIAKOS（AI Agricultural Knowledge Operating System）
是一套以教育為核心、AI 為工具、知識為基礎、決策為目的的農業 Framework。

Framework 的目標不是建立單一網站，而是建立一套所有 AI 農業教育平台都能共同使用的核心架構。

---

# Vision（願景）

建立全球第一套以 AI、農業、教育、知識推論與推演式學習為核心的 AI Agricultural Education Framework。

讓每一個農業教育平台都能共享同一套知識引擎。

---

# Mission（使命）

AIAKOS 致力於：

- 整合農業知識
- 整合農業氣象
- 整合作物資料
- 整合病蟲害知識
- 建立 AI 決策能力
- 建立 AI 推演式學習

讓學生不只是查詢資料，而是學會分析、判斷與決策。

---

# Core Philosophy

資料不是只拿來查詢，

而是拿來推論。

AI 不是只回答問題，

而是協助決策。

平台不是彼此獨立，

而是共享知識。

---

# Five Core Principles

## 1. Single Responsibility

每個 Engine、Module、Service
只負責一件事情。

不得混合多種職責。

---

## 2. Low Coupling

所有元件保持低耦合。

Module 不直接依賴其他 Module。

跨模組溝通以 EventBus 為主。

---

## 3. Event-driven

Framework 採事件驅動。

Controller 不直接操作所有 Module。

透過 EventBus：

Controller

↓

Event

↓

Module

↓

Engine

---

## 4. Extensible

所有功能必須可擴充。

新增 Module

不得修改既有 Engine。

新增 Engine

不得破壞既有 API。

---

## 5. Reusable

所有 Engine

皆應可被不同平台重複使用。

例如：

WeatherEngine

可供：

- AI農業氣象中心
- AI植物診療師
- AI智慧農場
- AI智慧養殖
- AI碳管理平台

共同呼叫。

---

# Architecture Principles

Framework 分為：

Controller

↓

EventBus

↓

Module

↓

Engine

↓

Service

↓

Data

---

# Controller Rules

Controller：

只負責流程控制。

不得：

- 判斷病害
- 判斷作物
- 操作 DOM
- 撰寫商業邏輯

---

# Module Rules

Module：

只負責：

- UI
- Dashboard
- Analysis
- History
- Prompt
- Report

不得：

直接修改 Engine。

---

# Engine Rules

Engine：

只負責：

知識推論。

不得：

直接操作畫面。

不得：

直接綁定按鈕。

---

# Service Rules

Service：

只負責：

- API
- JSON
- 外部資料

不得：

包含 AI 決策。

---

# Data Rules

所有 Data：

保持純資料。

不得：

寫任何商業邏輯。

---

# EventBus Rules

所有跨模組通訊：

優先採 EventBus。

例如：

analysis:completed

analysis:built

history:saved

weather:updated

decision:changed

---

# Documentation Rules

所有新增功能：

必須同步更新：

- Spec
- Development Log

重大功能：

必須更新：

- Architecture
- Roadmap

---

# Version Rules

Framework

獨立版本。

Engine

獨立版本。

Module

獨立版本。

Service

獨立版本。

互不影響。

---

# Future Vision

AIAKOS 將逐步發展成：

AI Agricultural Knowledge Operating System

支援：

- AI Weather Agent
- AI Plant Doctor
- AI Farm Manager
- AI Carbon Manager
- AI Aquaculture
- AI Learning Coach
- AI Decision Coach

共同共享同一套 Framework。

---

# Long-term Goal

打造可持續十年以上發展的 AI 農業教育 Framework。

使每一個平台都能：

共享資料、

共享知識、

共享 AI、

共享未來。

---

# Motto

Knowledge drives Agriculture.

AI empowers Education.

Learning inspires the Future.