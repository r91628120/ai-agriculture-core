# WeatherDashboardModule.spec.md

## Module Name
WeatherDashboardModule

## Version
v2.0

## EventBus Integration

### Listens To
- `analysis:completed`

## Behavior
當 AIAKOS Controller Layer 完成農業分析後，會透過 EventBus 發送 `analysis:completed`。

WeatherDashboardModule 接收到事件後，自動呼叫：

```js
this.render(payload.result)


到這裡就結束了。:contentReference[oaicite:1]{index=1}

建議後面再補：

````md
## Rules

- 不直接呼叫 Engine。
- 不處理農業分析邏輯。
- 不直接綁定 UI 按鈕。
- 只負責 Dashboard 畫面呈現。

## Future Extension

未來可監聽：

- weather:updated
- analysis:built
- decision:updated

以支援更多 Dashboard。