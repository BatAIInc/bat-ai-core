# Agents

Agents are the core building blocks of Bat AI Core. They are specialized AI entities that can perform specific tasks and interact with each other.

## Overview

An agent in Bat AI Core is defined by:

- A specific role and goal
- A backstory that shapes its behavior
- A language model for processing
- A set of capabilities
- Optional memory and tools

## Creating an Agent

```typescript
import { Agent } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

const agent = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "A skilled developer with expertise in TypeScript and Node.js",
  model: new ChatOpenAI({ temperature: 0.7 }),
  capabilities: ["code_execution", "code_review", "testing"],
});
```

## Agent Configuration

```typescript
interface AgentConfig {
  role: string; // The agent's role (e.g., "developer", "researcher")
  goal: string; // The agent's primary objective
  backstory: string; // Background information that shapes behavior
  model: BaseChatModel; // The language model to use
  memory?: AgentMemory; // Optional memory system
  tools?: BatTool[]; // Optional tools the agent can use
  capabilities?: string[]; // List of agent capabilities
}
```

## Agent Roles

Common agent roles include:

1. **Developer**

   - Writes and maintains code
   - Reviews code
   - Fixes bugs
   - Implements features

2. **Researcher**

   - Gathers information
   - Analyzes data
   - Summarizes findings
   - Provides insights

3. **Writer**

   - Creates content
   - Edits text
   - Formats documents
   - Maintains style guides

4. **Tester**
   - Writes tests
   - Runs tests
   - Reports bugs
   - Validates functionality

## Agent Capabilities

Capabilities define what an agent can do:

```typescript
// Example capabilities
const capabilities = [
  "code_execution", // Can execute code
  "web_search", // Can search the web
  "file_operations", // Can read/write files
  "data_analysis", // Can analyze data
  "content_creation", // Can create content
  "testing", // Can run tests
];
```

## Agent Tools

Agents can use various tools to accomplish tasks:

```typescript
import { WebSearchTool, CodeExecutionTool } from "@bat-ai/core";

const tools = [new WebSearchTool(), new CodeExecutionTool()];

const agent = new Agent({
  // ... other config
  tools: tools,
});
```

## Agent Memory

Agents can maintain memory of past interactions:

```typescript
import { AgentMemory } from "@bat-ai/core";

const memory = new AgentMemory({
  maxTokens: 2000,
  persist: true,
});

const agent = new Agent({
  // ... other config
  memory: memory,
});
```

## Agent Communication

Agents can communicate with each other:

```typescript
const developer = new Agent({
  /* ... */
});
const tester = new Agent({
  /* ... */
});

// Agents can share information
await developer.shareKnowledge(tester, "bug_fix_details");

// Agents can collaborate on tasks
const result = await developer.collaborate(tester, "test_new_feature");
```

## Best Practices

1. **Role Definition**

   - Make roles specific and clear
   - Align goals with capabilities
   - Provide detailed backstories

2. **Capability Selection**

   - Choose relevant capabilities
   - Avoid overlapping capabilities
   - Consider task requirements

3. **Memory Management**

   - Configure appropriate memory limits
   - Use persistence when needed
   - Monitor memory usage

4. **Tool Integration**
   - Select appropriate tools
   - Configure tool parameters
   - Test tool functionality

## Example: Multi-Agent System

```typescript
import { Agent, Bat } from "@bat-ai/core";

// Create specialized agents
const developer = new Agent({
  role: "developer",
  goal: "Write and maintain code",
  backstory: "Expert in TypeScript and Node.js",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_execution", "code_review"],
});

const tester = new Agent({
  role: "tester",
  goal: "Ensure code quality",
  backstory: "QA specialist with attention to detail",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["testing", "bug_reporting"],
});

// Create a Bat instance with multiple agents
const bat = new Bat([developer, tester]);

// Add tasks for different agents
bat.addTask({
  description: "Implement new feature",
  agentRole: "developer",
});

bat.addTask({
  description: "Test the new feature",
  agentRole: "tester",
});

// Execute tasks
const results = await bat.kickoff();
```
