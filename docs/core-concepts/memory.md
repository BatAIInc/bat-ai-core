# Memory Management

The memory system in Bat AI Core allows agents to maintain context and learn from previous interactions. This guide explains how to use and configure memory in your agents.

## Overview

Memory in Bat AI Core is implemented through the `AgentMemory` class, which provides:

- Short-term memory for current task context
- Long-term memory for persistent knowledge
- Conversation history tracking
- Context window management

## Basic Usage

```typescript
import { Agent, AgentMemory } from "@bat-ai/core";

// Create a memory instance
const memory = new AgentMemory({
  maxTokens: 2000,
  persist: true,
});

// Create an agent with memory
const agent = new Agent({
  role: "researcher",
  goal: "Gather and analyze information",
  backstory: "A research assistant agent",
  model: new ChatOpenAI({ temperature: 0.7 }),
  memory: memory,
});
```

## Memory Types

### Short-term Memory

- Stores context for the current task
- Automatically cleared after task completion
- Limited by token count

### Long-term Memory

- Persists across multiple tasks
- Can be saved to and loaded from storage
- Useful for maintaining agent knowledge

### Conversation History

- Tracks all agent interactions
- Can be used for context in future tasks
- Helps maintain conversation flow

## Configuration Options

```typescript
interface MemoryConfig {
  maxTokens: number; // Maximum tokens to store
  persist: boolean; // Whether to persist memory
  storagePath?: string; // Path for persistent storage
  contextWindow?: number; // Size of context window
}
```

## Best Practices

1. **Token Management**

   - Set appropriate `maxTokens` based on your model's context window
   - Monitor memory usage to prevent overflow
   - Use summarization for long conversations

2. **Persistence**

   - Enable persistence for important agent knowledge
   - Choose appropriate storage location
   - Implement backup strategies

3. **Context Management**
   - Keep context windows focused
   - Remove irrelevant information
   - Use memory pruning when necessary

## Example: Using Memory in Tasks

```typescript
const agent = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "A skilled developer agent",
  model: new ChatOpenAI({ temperature: 0 }),
  memory: new AgentMemory({
    maxTokens: 4000,
    persist: true,
  }),
});

// Memory is automatically used in task execution
const task = new Task("Fix the bug in the authentication system", agent);

// Previous context is available in the task
const result = await task.run();
```

## Advanced Features

### Memory Pruning

```typescript
// Remove old or irrelevant memories
memory.prune({
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxTokens: 2000,
});
```

### Memory Export/Import

```typescript
// Export memory to file
await memory.exportToFile("agent_memory.json");

// Import memory from file
await memory.importFromFile("agent_memory.json");
```

### Custom Memory Implementations

```typescript
class CustomMemory extends AgentMemory {
  async store(memory: MemoryItem): Promise<void> {
    // Custom storage logic
  }

  async retrieve(query: string): Promise<MemoryItem[]> {
    // Custom retrieval logic
  }
}
```
