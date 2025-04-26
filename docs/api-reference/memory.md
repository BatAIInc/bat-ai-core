# Memory API Reference

This document provides detailed information about the AgentMemory class and its methods.

## Class: AgentMemory

The `AgentMemory` class manages both short-term and long-term memory for agents.

### Constructor

```typescript
constructor(config: MemoryConfig)
```

#### Parameters

| Parameter | Type         | Description                                |
| --------- | ------------ | ------------------------------------------ |
| config    | MemoryConfig | Configuration object for the memory system |

### Properties

#### maxTokens

```typescript
public readonly maxTokens: number
```

Maximum number of tokens to store in memory.

#### persist

```typescript
public readonly persist: boolean
```

Whether to persist memory to storage.

#### storagePath

```typescript
public readonly storagePath?: string
```

Optional path for persistent storage.

#### contextWindow

```typescript
public readonly contextWindow?: number
```

Optional size of the context window.

### Methods

#### store

```typescript
public async store(memory: MemoryItem): Promise<void>
```

Stores a memory item.

##### Parameters

| Parameter | Type       | Description              |
| --------- | ---------- | ------------------------ |
| memory    | MemoryItem | The memory item to store |

##### Returns

- `Promise<void>`

#### retrieve

```typescript
public async retrieve(query: string): Promise<MemoryItem[]>
```

Retrieves memory items matching a query.

##### Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| query     | string | The query to search for |

##### Returns

- `Promise<MemoryItem[]>`: Matching memory items

#### clear

```typescript
public async clear(): Promise<void>
```

Clears all memory items.

##### Returns

- `Promise<void>`

#### prune

```typescript
public async prune(config: PruneConfig): Promise<void>
```

Removes old or irrelevant memories.

##### Parameters

| Parameter | Type        | Description           |
| --------- | ----------- | --------------------- |
| config    | PruneConfig | Pruning configuration |

##### Returns

- `Promise<void>`

#### exportToFile

```typescript
public async exportToFile(path: string): Promise<void>
```

Exports memory to a file.

##### Parameters

| Parameter | Type   | Description         |
| --------- | ------ | ------------------- |
| path      | string | Path to export file |

##### Returns

- `Promise<void>`

#### importFromFile

```typescript
public async importFromFile(path: string): Promise<void>
```

Imports memory from a file.

##### Parameters

| Parameter | Type   | Description         |
| --------- | ------ | ------------------- |
| path      | string | Path to import file |

##### Returns

- `Promise<void>`

## Types

### MemoryConfig

```typescript
interface MemoryConfig {
  maxTokens: number; // Maximum tokens to store
  persist: boolean; // Whether to persist memory
  storagePath?: string; // Path for persistent storage
  contextWindow?: number; // Size of context window
}
```

### MemoryItem

```typescript
interface MemoryItem {
  id: string; // Unique identifier
  content: string; // Memory content
  timestamp: number; // Creation timestamp
  type: MemoryType; // Type of memory
  metadata?: any; // Optional metadata
}
```

### MemoryType

```typescript
type MemoryType = "short_term" | "long_term" | "conversation";
```

### PruneConfig

```typescript
interface PruneConfig {
  maxAge?: number; // Maximum age in milliseconds
  maxTokens?: number; // Maximum tokens to keep
  types?: MemoryType[]; // Types to prune
}
```

## Events

The AgentMemory class emits the following events:

### onStore

```typescript
public onStore(callback: (memory: MemoryItem) => void): void
```

Emitted when a memory item is stored.

### onRetrieve

```typescript
public onRetrieve(callback: (query: string, results: MemoryItem[]) => void): void
```

Emitted when memory items are retrieved.

### onClear

```typescript
public onClear(callback: () => void): void
```

Emitted when memory is cleared.

### onPrune

```typescript
public onPrune(callback: (pruned: MemoryItem[]) => void): void
```

Emitted when memory is pruned.

## Example Usage

```typescript
import { AgentMemory } from "@bat-ai/core";

// Create a memory instance
const memory = new AgentMemory({
  maxTokens: 2000,
  persist: true,
  storagePath: "./memory",
  contextWindow: 1000,
});

// Add event listeners
memory.onStore((item) => {
  console.log("Memory stored:", item);
});

memory.onRetrieve((query, results) => {
  console.log(`Retrieved ${results.length} memories for query: ${query}`);
});

// Store a memory
await memory.store({
  id: "1",
  content: "User prefers dark mode",
  timestamp: Date.now(),
  type: "long_term",
  metadata: { source: "user_preferences" },
});

// Retrieve memories
const results = await memory.retrieve("dark mode");
console.log("Found memories:", results);

// Prune old memories
await memory.prune({
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxTokens: 1000,
  types: ["short_term"],
});

// Export memory
await memory.exportToFile("memory_backup.json");

// Import memory
await memory.importFromFile("memory_backup.json");
```

## Best Practices

1. **Memory Configuration**

   - Set appropriate token limits
   - Configure persistence when needed
   - Choose appropriate storage location
   - Set context window size

2. **Memory Management**

   - Regularly prune old memories
   - Monitor memory usage
   - Implement backup strategies
   - Clean up unused memories

3. **Event Handling**

   - Log important memory events
   - Monitor memory operations
   - Track memory usage patterns
   - Implement error handling

4. **Performance Optimization**
   - Use efficient storage methods
   - Implement caching when needed
   - Optimize retrieval queries
   - Monitor memory performance
