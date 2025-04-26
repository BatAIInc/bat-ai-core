# Basic Usage

This guide will help you get started with Bat AI Core by showing you how to create and use agents, execute tasks, and manage workflows.

## Creating Your First Agent

```typescript
import { Agent } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Create a developer agent
const developer = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "A skilled developer with expertise in TypeScript and Node.js",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["code_execution", "code_review"],
});
```

## Creating a Task

```typescript
import { Task } from "@bat-ai/core";

// Create a basic task
const task = new Task("Write a function to sort an array", developer);

// Execute the task
try {
  const result = await task.run();
  console.log("Task completed:", result);
} catch (error) {
  console.error("Task failed:", error);
}
```

## Using the Bat Class

The `Bat` class helps you manage multiple agents and tasks:

```typescript
import { Bat } from "@bat-ai/core";

// Create a Bat instance with your agents
const bat = new Bat([developer]);

// Add tasks
bat.addTask({
  description: "Write a function to sort an array",
  agentRole: "developer",
});

// Execute all tasks
const results = await bat.kickoff();
console.log("All tasks completed:", results);
```

## Basic Workflow Example

Here's a complete example of a basic workflow:

```typescript
import { Agent, Bat, Task } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Create agents
const developer = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "Expert in TypeScript and Node.js",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_execution"],
});

const reviewer = new Agent({
  role: "reviewer",
  goal: "Review and improve code",
  backstory: "Experienced code reviewer",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_review"],
});

// Create a Bat instance
const bat = new Bat([developer, reviewer]);

// Add tasks
bat.addTask({
  description: "Write a function to calculate Fibonacci numbers",
  agentRole: "developer",
});

bat.addTask({
  description: "Review the Fibonacci function implementation",
  agentRole: "reviewer",
});

// Execute tasks
const results = await bat.kickoff();
console.log("Workflow completed:", results);
```

## Task Configuration

Tasks can be configured with different options:

```typescript
// Task with priority
const highPriorityTask = new Task("Fix critical bug", developer, "high");

// Task with timeout
const timeSensitiveTask = new Task(
  "Process real-time data",
  developer,
  "medium",
  10000 // 10 second timeout
);

// Task with retry configuration
const resilientTask = new Task(
  "Process unreliable data",
  developer,
  "medium",
  30000, // 30 second timeout
  {
    maxRetries: 5,
    retryDelayMs: 2000,
  }
);
```

## Error Handling

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

## Best Practices

1. **Agent Configuration**

   - Define clear roles and goals
   - Provide detailed backstories
   - Choose appropriate capabilities

2. **Task Management**

   - Set appropriate priorities
   - Configure timeouts based on task complexity
   - Use retry mechanisms for unreliable operations

3. **Error Handling**

   - Always wrap task execution in try-catch blocks
   - Handle specific error types
   - Implement appropriate recovery strategies

4. **Workflow Design**
   - Break complex tasks into smaller ones
   - Use appropriate agent roles
   - Consider task dependencies

## Next Steps

After mastering the basics, you can explore:

1. [Advanced Task Configuration](configuration.md)
2. [Memory Management](memory.md)
3. [Custom Tools and Capabilities](advanced-features.md)
4. [Multi-Agent Collaboration](agents.md)
