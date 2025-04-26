# Task Execution Examples

This guide demonstrates how to use the Task class with its advanced features like priority management, timeout control, and retry mechanisms.

## Basic Task Execution

```typescript
import { Agent, Task } from "@bat-ai/core";

// Create an agent
const agent = new Agent({
  role: "developer",
  goal: "Write and execute code",
  backstory: "A skilled developer agent",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_execution"],
});

// Create and execute a basic task
const task = new Task("Write a function to sort an array", agent);

try {
  const result = await task.run();
  console.log("Task completed:", result);
} catch (error) {
  console.error("Task failed:", error);
}
```

## Task with Priority

```typescript
// Create a high priority task
const highPriorityTask = new Task(
  "Fix critical bug in production",
  agent,
  "high" // Set priority to high
);

// Create a low priority task
const lowPriorityTask = new Task(
  "Update documentation",
  agent,
  "low" // Set priority to low
);
```

## Task with Timeout

```typescript
// Create a task with 10 second timeout
const timeSensitiveTask = new Task(
  "Process real-time data",
  agent,
  "medium",
  10000 // 10 second timeout
);
```

## Task with Retry Configuration

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

## Complete Example with All Features

```typescript
import { Agent, Task, Bat } from "@bat-ai/core";

// Create agents
const researchAgent = new Agent({
  role: "researcher",
  goal: "Gather and analyze information",
  backstory: "A research assistant agent",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["web_search", "data_analysis"],
});

const writerAgent = new Agent({
  role: "writer",
  goal: "Create clear and engaging content",
  backstory: "A content writer agent",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["content_creation"],
});

// Create a Bat instance
const bat = new Bat([researchAgent, writerAgent]);

// Add tasks with different configurations
bat.addTask({
  description: "Research latest AI trends",
  agentRole: "researcher",
  priority: "high",
  timeoutMs: 30000,
});

bat.addTask({
  description: "Write article about findings",
  agentRole: "writer",
  priority: "medium",
  retryConfig: {
    maxRetries: 3,
    retryDelayMs: 1000,
  },
});

// Execute tasks
const results = await bat.kickoff();
console.log("Task results:", results);
```

## Error Handling and Retries

The Task class automatically handles errors and retries:

```typescript
const task = new Task(
  "Process unreliable API data",
  agent,
  "medium",
  10000, // 10 second timeout
  {
    maxRetries: 3,
    retryDelayMs: 1000,
  }
);

try {
  const result = await task.run();
  console.log("Success:", result);
} catch (error) {
  // This will only be called after all retries are exhausted
  console.error("Final error after retries:", error);
}
```

## Best Practices

1. **Priority Setting**

   - Use "high" for critical tasks
   - Use "medium" for normal tasks
   - Use "low" for background tasks

2. **Timeout Configuration**

   - Set appropriate timeouts based on task complexity
   - Consider network latency and external service response times
   - Default 30 seconds is usually sufficient for most tasks

3. **Retry Configuration**

   - Increase retries for unreliable operations
   - Adjust retry delay based on the nature of the failure
   - Consider exponential backoff for network-related tasks

4. **Error Handling**
   - Always wrap task execution in try-catch blocks
   - Log errors appropriately
   - Consider implementing custom error handling strategies
