# Bat AI Core

Bat AI Core is a task execution system based on AI agents, designed to automate and manage complex workflows. The system uses a combination of tools and specialized agents to execute tasks intelligently and efficiently.

## 🚀 Features

- 🤖 Specialized agents for different types of tasks
- 🛠️ Support for multiple AI tools
- 🔄 Memory management for agents
- 🔍 Task delegation and coordination
- 📦 Easy to extend with new tools and agents

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Access to AI APIs (OpenAI, Groq, etc.)

## 🔧 Installation

Install the public package from npm:

```bash
npm install @bat-ai/core
# or
yarn add @bat-ai/core
```

## 🎯 Usage

### Basic Setup

```typescript
import { Agent, Bat, Task, AgentConfig } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Configure an agent
const agentConfig: AgentConfig = {
  role: "developer",
  goal: "Write and execute code",
  backstory: "A skilled developer agent",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_execution", "code_review"],
};

// Create an agent
const agent = new Agent(agentConfig);

// Create a task
const task = new Task("Write a function to sort an array", agent);

// Create a Bat instance with agents
const bat = new Bat([agent]);

// Add and execute tasks
bat.addTask("Write a function to sort an array", "developer");
const results = await bat.kickoff();
```

### Agent Configuration

```typescript
interface AgentConfig {
  role: string;
  goal: string;
  backstory: string;
  model: BaseChatModel;
  memory?: AgentMemory;
  tools?: BatTool[];
  capabilities?: string[];
}
```

### Task Execution

```typescript
// Execute a single task
const result = await task.run();

// Execute multiple tasks with Bat
const results = await bat.kickoff();
```

## 🧪 Testing

To run the tests:

```bash
npm test
# or
yarn test
```

## 📚 Documentation

The complete documentation is available in the [docs/](docs/) directory. It includes:

- Development Guide
- API Reference
- Usage Examples
- Contribution Guidelines

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue on GitHub or contact us at: support@example.com
