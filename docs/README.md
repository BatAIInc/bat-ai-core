# Bat AI Core Documentation

![Bat AI Core Logo](_media/logo.png)

> AI-powered task execution system

Bat AI Core is a sophisticated task execution system based on AI agents, designed to automate and manage complex workflows. The system uses a combination of tools and specialized agents to execute tasks intelligently and efficiently.

## 🚀 Features

- 🤖 Specialized agents for different types of tasks
- 🛠️ Support for multiple AI tools
- 🔄 Memory management for agents
- 🔍 Task delegation and coordination
- ⏱️ Task timeout and retry mechanisms
- 📦 Easy to extend with new tools and agents

## 📋 Quick Start

```bash
# Install the package
npm install @bat-ai/core

# Basic usage
import { Agent, Bat } from '@bat-ai/core';

// Create an agent
const agent = new Agent({
  role: "developer",
  goal: "Write and execute code",
  backstory: "A skilled developer agent",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_execution", "code_review"]
});

// Create a Bat instance
const bat = new Bat([agent]);

// Add and execute tasks
bat.addTask({
  description: "Write a function to sort an array",
  agentRole: "developer"
});

const results = await bat.kickoff();
```

## 📚 Documentation

- [Getting Started](getting-started.md)
- [Core Concepts](core-concepts.md)
- [Agents](agents.md)
- [Tasks](tasks.md)
- [Configuration](configuration.md)
- [API Reference](api-reference.md)
- [Examples](examples.md)
- [Contributing](contributing.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](contributing.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
