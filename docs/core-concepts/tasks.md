# Tasks

Tasks are the fundamental units of work in Bat AI Core. This guide explains how to create, configure, and manage tasks effectively.

## Overview

A task in Bat AI Core represents a specific piece of work to be executed by an agent. Tasks include:

- Description of the work
- Assigned agent
- Priority level
- Timeout configuration
- Retry settings

## Creating Tasks

### Basic Task Creation

```typescript
import { Task } from "@bat-ai/core";

// Create a basic task
const task = new Task("Write a function to sort an array", agent);

// Execute the task
const result = await task.run();
```

### Task with Priority

```typescript
// Create a high priority task
const highPriorityTask = new Task(
  "Fix critical bug in production",
  agent,
  "high"
);

// Create a low priority task
const lowPriorityTask = new Task("Update documentation", agent, "low");
```

### Task with Timeout

```typescript
// Create a task with 10 second timeout
const timeSensitiveTask = new Task(
  "Process real-time data",
  agent,
  "medium",
  10000 // 10 second timeout
);
```

### Task with Retry Configuration

```typescript
// Create a task with custom retry settings
const resilientTask = new Task(
  "Process unreliable data source",
  agent,
  "medium",
  30000, // 30 second timeout
  {
    maxRetries: 5, // Try up to 5 times
    retryDelayMs: 2000, // Wait 2 seconds between retries
  }
);
```

## Task Configuration

### Priority Levels

```typescript
type TaskPriority = "high" | "medium" | "low";

// Example usage
const task = new Task(
  "Important task",
  agent,
  "high" // Set priority to high
);
```

### Timeout Configuration

```typescript
// 10 second timeout
const task = new Task("Quick task", agent, "medium", 10000);

// 30 second timeout
const longTask = new Task("Complex task", agent, "medium", 30000);
```

### Retry Configuration

```typescript
interface TaskRetryConfig {
  maxRetries: number; // Maximum number of retry attempts
  retryDelayMs: number; // Delay between retries in milliseconds
}

// Example configuration
const retryConfig: TaskRetryConfig = {
  maxRetries: 3,
  retryDelayMs: 1000,
};
```

## Task Execution

### Basic Execution

```typescript
try {
  const result = await task.run();
  console.log("Task completed:", result);
} catch (error) {
  console.error("Task failed:", error);
}
```

### Task with Progress Tracking

```typescript
const task = new Task("Long running task", agent);

// Track progress
task.onProgress((progress) => {
  console.log(`Progress: ${progress}%`);
});

const result = await task.run();
```

### Task with Result Processing

```typescript
const task = new Task("Process data", agent);

// Process result
task.onComplete((result) => {
  console.log("Raw result:", result);
  const processed = processResult(result);
  console.log("Processed result:", processed);
});

await task.run();
```

## Task Management

### Task Queue

```typescript
import { TaskQueue } from "@bat-ai/core";

const queue = new TaskQueue();

// Add tasks to queue
queue.add(task1);
queue.add(task2);
queue.add(task3);

// Process queue
const results = await queue.process();
```

### Task Scheduling

```typescript
import { TaskScheduler } from "@bat-ai/core";

const scheduler = new TaskScheduler();

// Schedule task for later execution
scheduler.schedule(task, {
  delay: 5000, // Execute after 5 seconds
  repeat: false, // Don't repeat
});

// Start scheduler
scheduler.start();
```

## Error Handling

### Basic Error Handling

```typescript
try {
  const result = await task.run();
  console.log("Success:", result);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error("Task timed out:", error);
  } else if (error instanceof RetryError) {
    console.error("Task failed after retries:", error);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Custom Error Handling

```typescript
class CustomErrorHandler {
  async handle(error: Error): Promise<void> {
    if (error instanceof TimeoutError) {
      await this.handleTimeout(error);
    } else if (error instanceof RetryError) {
      await this.handleRetry(error);
    } else {
      await this.handleUnexpected(error);
    }
  }
}

const task = new Task("Task with custom error handling", agent);

task.setErrorHandler(new CustomErrorHandler());
```

## Best Practices

1. **Task Design**

   - Keep tasks focused and specific
   - Break complex tasks into smaller ones
   - Provide clear descriptions
   - Set appropriate priorities

2. **Timeout Configuration**

   - Set realistic timeouts
   - Consider task complexity
   - Account for network latency
   - Monitor timeout occurrences

3. **Retry Configuration**

   - Use appropriate retry counts
   - Set reasonable delays
   - Consider exponential backoff
   - Monitor retry patterns

4. **Error Handling**
   - Implement comprehensive error handling
   - Log errors appropriately
   - Provide meaningful error messages
   - Consider recovery strategies

## Example: Complete Task Workflow

```typescript
import { Task, TaskQueue, TaskScheduler } from "@bat-ai/core";

// Create tasks
const task1 = new Task("Process initial data", agent, "high", 10000);

const task2 = new Task("Analyze results", agent, "medium", 30000, {
  maxRetries: 3,
  retryDelayMs: 1000,
});

const task3 = new Task("Generate report", agent, "low");

// Create queue and scheduler
const queue = new TaskQueue();
const scheduler = new TaskScheduler();

// Add tasks to queue
queue.add(task1);
queue.add(task2);
queue.add(task3);

// Schedule queue processing
scheduler.schedule(
  async () => {
    const results = await queue.process();
    console.log("All tasks completed:", results);
  },
  {
    delay: 0,
    repeat: false,
  }
);

// Start scheduler
scheduler.start();
```
