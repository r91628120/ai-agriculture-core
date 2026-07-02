# AnalysisModule.spec.md

## Module Name

AnalysisModule

## Version

v2.0

## Controller Integration

Connected by:

```js
analyzeFarmDecision(input)
```

## EventBus Integration

### Listens To

- `analysis:completed`

### Emits

- `analysis:built`

### Behavior

當 AIAKOS Controller Layer 完成農業分析後，
會發送：

```js
analysis:completed
```

AnalysisModule 接收到事件後：

```js
this.build(payload.result)
```

完成整理後，再發送：

```js
analysis:built
```

## Output Payload

```js
{
  input,
  result,
  analysis,
  timestamp
}
```

## Rules

- 不直接操作 DOM。
- 不直接呼叫 Engine。
- 不直接綁定 UI。
- 專門負責整理分析資料。