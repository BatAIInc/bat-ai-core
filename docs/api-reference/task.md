# Task

The `Task` class represents a unit of work to be executed by an agent. It includes features for priority management, timeout control, and automatic retry mechanisms.

## Constructor

```typescript
constructor(
  description: string,
  agent: Agent,
  priority: TaskPriority = "medium",
  timeoutMs: number = 30000,
  retryConfig: TaskRetryConfig = DEFAULT_RETRY_CONFIG
)
```

### Parameters

| Parameter   | Type            | Description                                          | Default              |
| ----------- | --------------- | ---------------------------------------------------- | -------------------- |
| description | string          | Description of the task to be executed               | -                    |
| agent       | Agent           | The agent responsible for executing the task         | -                    |
| priority    | TaskPriority    | Priority level of the task ("high", "medium", "low") | "medium"             |
| timeoutMs   | number          | Maximum time in milliseconds for task execution      | 30000                |
| retryConfig | TaskRetryConfig | Configuration for retry behavior                     | DEFAULT_RETRY_CONFIG |

## Properties

### priority

```typescript
public readonly priority: TaskPriority
```

The priority level of the task.

### description

```typescript
public readonly description: string
```

The description of the task.

## Methods

### getPriority

```typescript
public getPriority(): TaskPriority
```

Returns the priority level of the task.

### run

```typescript
public async run(): Promise<string>
```

Executes the task with retry logic and timeout control.

#### Returns

- `Promise<string>`: The result of the task execution

#### Throws

- `Error`: If the task fails after all retry attempts

## Types

### TaskPriority

```typescript
type TaskPriority = "high" | "medium" | "low";
```

Priority levels for task execution.

### TaskRetryConfig

```typescript
interface TaskRetryConfig {
  maxRetries: number;
  retryDelayMs: number;
}
```

Configuration for task retry behavior.

## Default Configuration

```typescript
const DEFAULT_RETRY_CONFIG: TaskRetryConfig = {
  maxRetries: 3,
  retryDelayMs: 1000,
};
```

## Example Usage

```typescript
// Create a task with default settings
const task = new Task("Analyze user data", agent);

// Create a task with custom settings
const highPriorityTask = new Task(
  "Process urgent request",
  agent,
  "high",
  10000, // 10 second timeout
  {
    maxRetries: 5,
    retryDelayMs: 2000, // 2 second delay between retries
  }
);

// Execute the task
try {
  const result = await task.run();
  console.log("Task completed:", result);
} catch (error) {
  console.error("Task failed:", error);
}
```

## Error Handling

The Task class implements robust error handling:

1. Each execution attempt is wrapped in a try-catch block
2. Failed attempts are logged with detailed error information
3. The task will retry up to the configured number of times
4. After all retries are exhausted, the final error is thrown

## Timeout Control

Tasks include built-in timeout control:

1. Each execution attempt has a configurable timeout
2. If the task exceeds the timeout, it's considered failed
3. Timeout errors trigger the retry mechanism
4. The timeout is enforced using `Promise.race`

## Retry Mechanism

The retry mechanism includes:

1. Configurable number of retry attempts
2. Configurable delay between retries
3. Detailed logging of retry attempts
4. Final error reporting after all retries are exhausted
