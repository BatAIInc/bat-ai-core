import { ChatOpenAI } from "@langchain/openai";
import { MemoryFactory } from "./agents/memory/MemoryFactory";
import { Agent } from "./agents/Agent";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // Initialize the LLM model
  const model = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
    maxTokens: 2000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Create memory for the agent
  const memory = MemoryFactory.createMemory({
    type: "buffer",
    llm: model as BaseChatModel,
  });

  // Create an agent with web search capabilities
  const agent = new Agent({
    role: "Research Assistant",
    goal: "Gather and analyze information from the web",
    backstory:
      "I am an AI research assistant specialized in finding and analyzing information from the web.",
    model: model,
    memory: memory,
    capabilities: ["web_search"],
  });

  // Example research tasks
  const tasks = [
    {
      description: "Pesquise sobre a cogna educação",
      expectedAgent: "Research Assistant",
      expectedTool: "web_search",
    },
  ];

  // Execute each task
  for (const task of tasks) {
    console.log("\nExecuting task:", task.description);
    console.log("Expected agent:", task.expectedAgent);
    console.log("Expected tool:", task.expectedTool);

    try {
      const result = await agent.execute(task.description);
      console.log("\nTask result:", result);

      // Add a delay between tasks to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Error executing task:", error);
    }
  }
}

// Run the main function
main().catch(console.error);
