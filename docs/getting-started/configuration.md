# Configuration

This guide covers the various configuration options available in Bat AI Core, including agent settings, task parameters, and system-wide configurations.

## Agent Configuration

### Basic Agent Settings

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

### Model Configuration

```typescript
// OpenAI Configuration
const openAIModel = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.7,
  maxTokens: 2000,
  streaming: true,
});

// Groq Configuration
const groqModel = new ChatGroq({
  modelName: "mixtral-8x7b-32768",
  temperature: 0.7,
});

// Anthropic Configuration
const anthropicModel = new ChatAnthropic({
  modelName: "claude-3-opus-20240229",
  temperature: 0.7,
});
```

## Task Configuration

### Task Parameters

```typescript
interface TaskConfig {
  description: string; // Task description
  agentRole: string; // Role of agent to execute
  priority?: TaskPriority; // Task priority
  timeoutMs?: number; // Timeout in milliseconds
  retryConfig?: {
    // Retry configuration
    maxRetries: number;
    retryDelayMs: number;
  };
}
```

### Priority Levels

```typescript
type TaskPriority = "high" | "medium" | "low";

// Example usage
const highPriorityTask = new Task("Fix critical bug", agent, "high");
```

### Timeout Configuration

```typescript
// 10 second timeout
const timeSensitiveTask = new Task(
  "Process real-time data",
  agent,
  "medium",
  10000
);

// 30 second timeout with retries
const resilientTask = new Task(
  "Process unreliable data",
  agent,
  "medium",
  30000,
  {
    maxRetries: 5,
    retryDelayMs: 2000,
  }
);
```

## System Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=your_api_key_here

# Optional
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
LOG_LEVEL=info
DEBUG_MODE=false
```

### Logging Configuration

```typescript
import { Logger } from "@bat-ai/core";

// Configure logging
Logger.configure({
  level: "info",
  format: "json",
  destination: "file",
  filePath: "bat-ai.log",
});
```

## Memory Configuration

### Memory Settings

```typescript
interface MemoryConfig {
  maxTokens: number; // Maximum tokens to store
  persist: boolean; // Whether to persist memory
  storagePath?: string; // Path for persistent storage
  contextWindow?: number; // Size of context window
}

// Example configuration
const memory = new AgentMemory({
  maxTokens: 2000,
  persist: true,
  storagePath: "./memory",
  contextWindow: 1000,
});
```

## Tool Configuration

### Basic Tool Setup

```typescript
import { WebSearchTool, CodeExecutionTool } from "@bat-ai/core";

const tools = [
  new WebSearchTool({
    apiKey: process.env.SEARCH_API_KEY,
    maxResults: 5,
  }),
  new CodeExecutionTool({
    timeout: 5000,
    sandbox: true,
  }),
];
```

### Custom Tool Creation

```typescript
class CustomTool extends BatTool {
  constructor(config: CustomToolConfig) {
    super("custom_tool", config);
  }

  async execute(input: string): Promise<string> {
    // Tool implementation
    return "result";
  }
}
```

## Best Practices

1. **Agent Configuration**

   - Choose appropriate models for each role
   - Set reasonable temperature values
   - Configure memory based on task requirements

2. **Task Configuration**

   - Set appropriate timeouts
   - Use retry mechanisms for unreliable operations
   - Assign priorities based on business needs

3. **System Configuration**

   - Use environment variables for sensitive data
   - Configure appropriate logging levels
   - Set up monitoring and alerts

4. **Memory Management**
   - Configure appropriate token limits
   - Use persistence for important knowledge
   - Implement memory pruning strategies

## Advanced Configuration

### Custom Error Handling

```typescript
import { ErrorHandler } from "@bat-ai/core";

class CustomErrorHandler extends ErrorHandler {
  async handle(error: Error): Promise<void> {
    // Custom error handling logic
    console.error("Custom error handling:", error);
    // Notify monitoring system
    await this.notifyMonitoring(error);
  }
}
```

### Custom Task Scheduler

```typescript
import { TaskScheduler } from "@bat-ai/core";

class CustomScheduler extends TaskScheduler {
  async schedule(task: Task): Promise<void> {
    // Custom scheduling logic
    if (task.priority === "high") {
      await this.executeImmediately(task);
    } else {
      await this.queueTask(task);
    }
  }
}
```

## Configuration Validation

```typescript
import { ConfigValidator } from "@bat-ai/core";

// Validate configuration
const validator = new ConfigValidator();
const errors = await validator.validate(config);

if (errors.length > 0) {
  console.error("Configuration errors:", errors);
  process.exit(1);
}
```
