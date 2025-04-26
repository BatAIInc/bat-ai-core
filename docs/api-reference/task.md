# Task API Reference

This document provides detailed information about the Task class and its methods.

## Class: Task

The `Task` class represents a unit of work to be executed by an agent. It includes features for priority management, timeout control, and automatic retry mechanisms.

### Constructor

```typescript
constructor(
  description: string,
  agent: Agent,
  priority: TaskPriority = "medium",
  timeoutMs: number = 30000,
  retryConfig: TaskRetryConfig = DEFAULT_RETRY_CONFIG
)
```

#### Parameters

| Parameter   | Type            | Description                                         |
| ----------- | --------------- | --------------------------------------------------- |
| description | string          | Description of the task                             |
| agent       | Agent           | The agent assigned to the task                      |
| priority    | TaskPriority    | Task priority (default: "medium")                   |
| timeoutMs   | number          | Timeout in milliseconds (default: 30000)            |
| retryConfig | TaskRetryConfig | Retry configuration (default: DEFAULT_RETRY_CONFIG) |

### Properties

#### description

```typescript
public readonly description: string
```

The task description.

#### agent

```typescript
public readonly agent: Agent
```

The agent assigned to the task.

#### priority

```typescript
public readonly priority: TaskPriority
```

The task priority.

#### timeoutMs

```typescript
public readonly timeoutMs: number
```

The task timeout in milliseconds.

#### retryConfig

```typescript
public readonly retryConfig: TaskRetryConfig
```

The retry configuration.

#### status

```typescript
public readonly status: TaskStatus
```

The current status of the task.

### Methods

#### run

```typescript
public async run(): Promise<string>
```

Executes the task.

##### Returns

- `Promise<string>`: The result of the task execution

##### Throws

- `TimeoutError`: If the task times out
- `RetryError`: If all retry attempts fail
- `Error`: For other execution errors

#### cancel

```typescript
public cancel(): void
```

Cancels the task execution.

#### setErrorHandler

```typescript
public setErrorHandler(handler: ErrorHandler): void
```

Sets a custom error handler for the task.

##### Parameters

| Parameter | Type         | Description              |
| --------- | ------------ | ------------------------ |
| handler   | ErrorHandler | The error handler to set |

#### onProgress

```typescript
public onProgress(callback: (progress: number) => void): void
```

Sets a callback for progress updates.

##### Parameters

| Parameter | Type             | Description           |
| --------- | ---------------- | --------------------- |
| callback  | (number) => void | The progress callback |

#### onComplete

```typescript
public onComplete(callback: (result: string) => void): void
```

Sets a callback for task completion.

##### Parameters

| Parameter | Type             | Description             |
| --------- | ---------------- | ----------------------- |
| callback  | (string) => void | The completion callback |

## Types

### TaskPriority

```typescript
type TaskPriority = "high" | "medium" | "low";
```

### TaskStatus

```typescript
type TaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";
```

### TaskRetryConfig

```typescript
interface TaskRetryConfig {
  maxRetries: number; // Maximum number of retry attempts
  retryDelayMs: number; // Delay between retries in milliseconds
}
```

## Events

The Task class emits the following events:

### onStart

```typescript
public onStart(callback: () => void): void
```

Emitted when the task starts execution.

### onProgress

```typescript
public onProgress(callback: (progress: number) => void): void
```

Emitted when the task progress updates.

### onComplete

```typescript
public onComplete(callback: (result: string) => void): void
```

Emitted when the task completes successfully.

### onError

```typescript
public onError(callback: (error: Error) => void): void
```

Emitted when the task fails.

### onCancel

```typescript
public onCancel(callback: () => void): void
```

Emitted when the task is cancelled.

## Example Usage

```typescript
import { Task, Agent } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Create an agent
const agent = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "A skilled developer",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["code_execution"],
});

// Create a task
const task = new Task(
  "Write a function to sort an array",
  agent,
  "high",
  10000, // 10 second timeout
  {
    maxRetries: 3,
    retryDelayMs: 1000,
  }
);

// Add event listeners
task.onStart(() => {
  console.log("Task started");
});

task.onProgress((progress) => {
  console.log(`Progress: ${progress}%`);
});

task.onComplete((result) => {
  console.log("Task completed:", result);
});

task.onError((error) => {
  console.error("Task failed:", error);
});

// Execute the task
try {
  const result = await task.run();
  console.log("Task result:", result);
} catch (error) {
  console.error("Task execution failed:", error);
}
```

## Best Practices

1. **Task Configuration**

   - Set appropriate priorities
   - Configure realistic timeouts
   - Use retry mechanisms for unreliable operations
   - Monitor task progress

2. **Error Handling**

   - Implement comprehensive error handling
   - Use custom error handlers when needed
   - Log errors appropriately
   - Consider recovery strategies

3. **Event Management**

   - Handle all relevant events
   - Implement progress tracking
   - Monitor task status
   - Clean up event listeners

4. **Resource Management**
   - Cancel unused tasks
   - Monitor task execution time
   - Handle memory efficiently
   - Implement cleanup procedures
