# Agent API Reference

This document provides detailed information about the Agent class and its methods.

## Class: Agent

The `Agent` class represents an AI entity that can execute tasks and interact with other agents.

### Constructor

```typescript
constructor(config: AgentConfig)
```

#### Parameters

| Parameter | Type        | Description                        |
| --------- | ----------- | ---------------------------------- |
| config    | AgentConfig | Configuration object for the agent |

### Properties

#### role

```typescript
public readonly role: string
```

The agent's role (e.g., "developer", "researcher").

#### goal

```typescript
public readonly goal: string
```

The agent's primary objective.

#### backstory

```typescript
public readonly backstory: string
```

Background information that shapes the agent's behavior.

#### model

```typescript
public readonly model: BaseChatModel
```

The language model used by the agent.

#### memory

```typescript
public readonly memory?: AgentMemory
```

Optional memory system for the agent.

#### tools

```typescript
public readonly tools?: BatTool[]
```

Optional tools available to the agent.

#### capabilities

```typescript
public readonly capabilities?: string[]
```

List of agent capabilities.

### Methods

#### execute

```typescript
public async execute(task: Task): Promise<string>
```

Executes a given task.

##### Parameters

| Parameter | Type | Description         |
| --------- | ---- | ------------------- |
| task      | Task | The task to execute |

##### Returns

- `Promise<string>`: The result of the task execution

##### Throws

- `Error`: If the task execution fails

#### shareKnowledge

```typescript
public async shareKnowledge(otherAgent: Agent, knowledge: string): Promise<void>
```

Shares knowledge with another agent.

##### Parameters

| Parameter  | Type   | Description             |
| ---------- | ------ | ----------------------- |
| otherAgent | Agent  | The agent to share with |
| knowledge  | string | The knowledge to share  |

##### Returns

- `Promise<void>`

#### collaborate

```typescript
public async collaborate(otherAgent: Agent, task: string): Promise<string>
```

Collaborates with another agent on a task.

##### Parameters

| Parameter  | Type   | Description                   |
| ---------- | ------ | ----------------------------- |
| otherAgent | Agent  | The agent to collaborate with |
| task       | string | The task description          |

##### Returns

- `Promise<string>`: The result of the collaboration

#### addTool

```typescript
public addTool(tool: BatTool): void
```

Adds a tool to the agent's toolkit.

##### Parameters

| Parameter | Type    | Description     |
| --------- | ------- | --------------- |
| tool      | BatTool | The tool to add |

#### removeTool

```typescript
public removeTool(toolName: string): void
```

Removes a tool from the agent's toolkit.

##### Parameters

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| toolName  | string | The name of the tool to remove |

#### hasCapability

```typescript
public hasCapability(capability: string): boolean
```

Checks if the agent has a specific capability.

##### Parameters

| Parameter  | Type   | Description             |
| ---------- | ------ | ----------------------- |
| capability | string | The capability to check |

##### Returns

- `boolean`: Whether the agent has the capability

## Types

### AgentConfig

```typescript
interface AgentConfig {
  role: string; // The agent's role
  goal: string; // The agent's primary objective
  backstory: string; // Background information
  model: BaseChatModel; // The language model
  memory?: AgentMemory; // Optional memory system
  tools?: BatTool[]; // Optional tools
  capabilities?: string[]; // List of capabilities
}
```

## Events

The Agent class emits the following events:

### onTaskStart

```typescript
public onTaskStart(callback: (task: Task) => void): void
```

Emitted when a task starts execution.

### onTaskComplete

```typescript
public onTaskComplete(callback: (task: Task, result: string) => void): void
```

Emitted when a task completes successfully.

### onTaskError

```typescript
public onTaskError(callback: (task: Task, error: Error) => void): void
```

Emitted when a task fails.

### onKnowledgeShared

```typescript
public onKnowledgeShared(callback: (otherAgent: Agent, knowledge: string) => void): void
```

Emitted when knowledge is shared with another agent.

## Example Usage

```typescript
import { Agent } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Create an agent
const agent = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "A skilled developer with expertise in TypeScript",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["code_execution", "code_review"],
});

// Add event listeners
agent.onTaskStart((task) => {
  console.log(`Starting task: ${task.description}`);
});

agent.onTaskComplete((task, result) => {
  console.log(`Task completed: ${task.description}`);
  console.log(`Result: ${result}`);
});

agent.onTaskError((task, error) => {
  console.error(`Task failed: ${task.description}`);
  console.error(`Error: ${error.message}`);
});

// Execute a task
const task = new Task("Write a function to sort an array", agent);

try {
  const result = await agent.execute(task);
  console.log("Task result:", result);
} catch (error) {
  console.error("Task execution failed:", error);
}
```

## Best Practices

1. **Agent Configuration**

   - Provide clear and specific roles
   - Define achievable goals
   - Write detailed backstories
   - Choose appropriate capabilities

2. **Event Handling**

   - Implement comprehensive error handling
   - Log important events
   - Monitor task progress
   - Track knowledge sharing

3. **Tool Management**

   - Add only necessary tools
   - Remove unused tools
   - Monitor tool usage
   - Handle tool errors

4. **Memory Usage**
   - Configure appropriate memory limits
   - Implement memory persistence
   - Monitor memory usage
   - Clean up old memories
