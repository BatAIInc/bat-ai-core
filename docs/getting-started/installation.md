# Installation

This guide will help you install and set up Bat AI Core in your project.

## Prerequisites

Before installing Bat AI Core, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn
- Access to an AI API (OpenAI, Groq, etc.)

## Installation

### Using npm

```bash
npm install @bat-ai/core
```

### Using yarn

```bash
yarn add @bat-ai/core
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here

# Optional: Other AI Provider Configuration
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Basic Setup

```typescript
import { Agent, Bat } from "@bat-ai/core";
import { ChatOpenAI } from "@langchain/openai";

// Configure your first agent
const agent = new Agent({
  role: "developer",
  goal: "Write and execute code",
  backstory: "A skilled developer agent",
  model: new ChatOpenAI({ temperature: 0 }),
  capabilities: ["code_execution"],
});

// Create a Bat instance
const bat = new Bat([agent]);
```

## Dependencies

Bat AI Core has the following peer dependencies:

```json
{
  "dependencies": {
    "@langchain/openai": "^0.0.x",
    "@langchain/core": "^0.0.x",
    "langchain": "^0.0.x"
  }
}
```

Make sure to install these dependencies:

```bash
npm install @langchain/openai @langchain/core langchain
# or
yarn add @langchain/openai @langchain/core langchain
```

## Supported AI Providers

Bat AI Core supports multiple AI providers:

1. **OpenAI**

   - GPT-3.5
   - GPT-4
   - GPT-4 Turbo

2. **Groq**

   - Mixtral
   - Llama 2

3. **Anthropic**
   - Claude 2
   - Claude 3

## Configuration Examples

### OpenAI Configuration

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.7,
  maxTokens: 2000,
});
```

### Groq Configuration

```typescript
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  modelName: "mixtral-8x7b-32768",
  temperature: 0.7,
});
```

### Anthropic Configuration

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  modelName: "claude-3-opus-20240229",
  temperature: 0.7,
});
```

## Troubleshooting

### Common Issues

1. **API Key Not Found**

   - Make sure your `.env` file is in the correct location
   - Verify that the API key is correctly set
   - Check for typos in the environment variable name

2. **Model Not Available**

   - Verify that you have access to the selected model
   - Check your API provider's documentation for available models
   - Ensure your API key has the necessary permissions

3. **Dependency Conflicts**
   - Try clearing your package manager's cache
   - Use `npm install --force` or `yarn install --force`
   - Check for version conflicts in your `package.json`

### Getting Help

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/BatAIInc/bat-ai-core/issues)
2. Join our [Discord Community](https://discord.gg/bat-ai)
3. Contact support at support@batai.com

## Next Steps

After installation, you can:

1. [Create your first agent](basic-usage.md)
2. [Configure task execution](configuration.md)
3. [Set up memory management](memory.md)
4. [Explore advanced features](advanced-features.md)
