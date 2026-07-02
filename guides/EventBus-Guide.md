# EventBus Guide

Version：v2.0

---

# Purpose

EventBus 是 AIAKOS Framework 的事件中心。

所有 Module 應優先透過 EventBus 溝通。

避免：

Module A

↓

直接呼叫

↓

Module B

---

# Architecture

Controller

↓

emit()

↓

EventBus

↓

Dashboard

↓

Analysis

↓

History

↓

Prompt

---

# Register

```js
eventBus.on(
    "analysis:completed",
    callback
);