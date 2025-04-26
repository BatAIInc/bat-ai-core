# Bat API Reference

This document provides detailed information about the Bat class and its methods.

## Class: Bat

The `Bat` class is the central orchestrator that manages agents and tasks in Bat AI Core.

### Constructor

```typescript
constructor(agents: Agent[])
```

#### Parameters

| Parameter | Type    | Description               |
| --------- | ------- | ------------------------- |
| agents    | Agent[] | Array of agents to manage |

### Properties

#### agents

```typescript
private readonly agents: Agent[]
```

The agents managed by this Bat instance.

#### taskManager

```typescript
private readonly taskManager: TaskManager
```

The task manager instance.

#### agentManager

```typescript
private readonly agentManager: AgentManager
```

The agent manager instance.

### Methods

#### addTask

```typescript
public async addTask(task: Task): Promise<void>
```

Adds a task to the task queue.

##### Parameters

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| task      | Task | The task to add |

##### Returns

- `Promise<void>`

#### kickoff

```typescript
public async kickoff(): Promise<TaskResult[]>
```

Executes all tasks in the queue.

##### Returns

- `Promise<TaskResult[]>`: Results of all executed tasks

#### getAgent

```typescript
public getAgent(role: string): Agent | undefined
```

Retrieves an agent by role.

##### Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| role      | string | The role of the agent to find |

##### Returns

- `Agent | undefined`: The found agent or undefined

#### getAgents

```typescript
public getAgents(): Agent[]
```

Retrieves all managed agents.

##### Returns

- `Agent[]`: Array of all managed agents

#### removeAgent

```typescript
public removeAgent(role: string): void
```

Removes an agent by role.

##### Parameters

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| role      | string | The role of the agent to remove |

## Events

The Bat class emits the following events:

### onTaskAdded

```typescript
public onTaskAdded(callback: (task: Task) => void): void
```

Emitted when a task is added to the queue.

### onTaskCompleted

```typescript
public onTaskCompleted(callback: (task: Task, result: TaskResult) => void): void
```

Emitted when a task completes successfully.

### onTaskFailed

```typescript
public onTaskFailed(callback: (task: Task, error: Error) => void): void
```

Emitted when a task fails.

### onAgentAdded

```typescript
public onAgentAdded(callback: (agent: Agent) => void): void
```

Emitted when an agent is added.

### onAgentRemoved

```typescript
public onAgentRemoved(callback: (role: string) => void): void
```

Emitted when an agent is removed.

## Example Usage

```typescript
import { Bat, Agent, Task } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Create agents
const developer = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "A skilled developer",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["code_execution"],
});

const reviewer = new Agent({
  role: "reviewer",
  goal: "Review code",
  backstory: "An experienced code reviewer",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["code_review"],
});

// Create Bat instance
const bat = new Bat([developer, reviewer]);

// Add event listeners
bat.onTaskAdded((task) => {
  console.log(`Task added: ${task.description}`);
});

bat.onTaskCompleted((task, result) => {
  console.log(`Task completed: ${task.description}`);
  console.log(`Result: ${result}`);
});

// Add tasks
bat.addTask(new Task("Write a sorting function", developer));
bat.addTask(new Task("Review the sorting function", reviewer));

// Execute tasks
const results = await bat.kickoff();
console.log("All tasks completed:", results);
```

## Best Practices

1. **Agent Management**

   - Add agents with distinct roles
   - Monitor agent performance
   - Remove unused agents
   - Balance agent workload

2. **Task Management**

   - Queue tasks appropriately
   - Monitor task progress
   - Handle task failures
   - Clean up completed tasks

3. **Event Handling**

   - Implement comprehensive error handling
   - Log important events
   - Monitor system health
   - Track performance metrics

4. **Resource Management**
   - Monitor system resources
   - Implement cleanup procedures
   - Handle memory efficiently
   - Optimize performance
