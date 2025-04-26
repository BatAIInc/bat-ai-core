import { ChatOpenAI } from "@langchain/openai";
import { MemoryFactory } from "./agents/memory/MemoryFactory";
import { Agent } from "./agents/Agent";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import dotenv from "dotenv";
import { Bat } from "./bat/Bat";

dotenv.config();

async function main() {
  // Initialize the LLM model
  const model = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
    maxTokens: 2000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Create different types of agents with specialized roles
  const researchAgent = new Agent({
    role: "Research Assistant",
    goal: "Gather and analyze information from the web",
    backstory:
      "I am an AI research assistant specialized in finding and analyzing information from the web.",
    model: model,
    memory: MemoryFactory.createMemory({
      type: "buffer",
      llm: model as BaseChatModel,
    }),
    capabilities: ["web_search"],
  });

  const dataAnalystAgent = new Agent({
    role: "Data Analyst",
    goal: "Analyze and interpret data to provide insights",
    backstory:
      "I am a data analyst specialized in processing and interpreting complex data sets.",
    model: model,
    memory: MemoryFactory.createMemory({
      type: "buffer",
      llm: model as BaseChatModel,
    }),
    capabilities: ["data_analysis"],
  });

  const contentWriterAgent = new Agent({
    role: "Content Writer",
    goal: "Create engaging and informative content",
    backstory:
      "I am a content writer specialized in creating clear and engaging content based on research and data.",
    model: model,
    memory: MemoryFactory.createMemory({
      type: "buffer",
      llm: model as BaseChatModel,
    }),
    capabilities: ["content_creation"],
  });

  // Example collaborative tasks
  const tasks = [
    {
      description:
        "Pesquise sobre as últimas tendências em inteligência artificial",
      agent: researchAgent,
      expectedOutput: "Dados de pesquisa sobre IA",
    },
    {
      description:
        "Analise os dados coletados sobre IA e identifique os principais insights",
      agent: dataAnalystAgent,
      expectedOutput: "Análise dos dados de IA",
    },
    {
      description:
        "Crie um artigo informativo baseado na análise das tendências de IA",
      agent: contentWriterAgent,
      expectedOutput: "Artigo sobre tendências de IA",
    },
  ];

  // Execute tasks sequentially with collaboration
  let previousResult = null;
  for (const task of tasks) {
    console.log(`\nExecutando tarefa com o agente: ${task.agent.role}`);
    console.log("Descrição da tarefa:", task.description);

    try {
      // If there's a previous result, include it in the context
      const taskInput = previousResult
        ? `${task.description}\n\nContexto adicional: ${previousResult}`
        : task.description;

      const result = await task.agent.execute(taskInput);
      console.log("\nResultado da tarefa:", result);
      previousResult = result;

      // Add a delay between tasks to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Erro ao executar tarefa:", error);
    }
  }

  // Example of parallel task execution
  console.log("\nExecutando tarefas em paralelo...");
  const parallelTasks = [
    {
      description: "Pesquise sobre o impacto da IA na educação",
      agent: researchAgent,
    },
    {
      description: "Analise os dados sobre o mercado de trabalho em tecnologia",
      agent: dataAnalystAgent,
    },
    {
      description: "Crie um resumo sobre as principais tecnologias emergentes",
      agent: contentWriterAgent,
    },
  ];

  const parallelResults = await Promise.all(
    parallelTasks.map(async (task) => {
      try {
        const result = await task.agent.execute(task.description);
        return {
          agent: task.agent.role,
          result,
        };
      } catch (error: any) {
        console.error(`Erro na tarefa paralela do ${task.agent.role}:`, error);
        return {
          agent: task.agent.role,
          error: error.message,
        };
      }
    })
  );

  console.log("\nResultados das tarefas paralelas:");
  parallelResults.forEach(({ agent, result, error }) => {
    console.log(`\n${agent}:`);
    if (error) {
      console.log("Erro:", error);
    } else {
      console.log(result);
    }
  });

  // Create a Bat instance
  const bat = new Bat([researchAgent, dataAnalystAgent]);

  // Add tasks with different configurations
  bat.addTask({
    description: "Urgent task with short timeout and default retries",
    agentRole: "Research Assistant",
    priority: "high",
    timeoutMs: 10000, // 10 seconds
  });

  // Task with custom retry configuration
  bat.addTask({
    description: "Task with custom retry settings",
    agentRole: "Data Analyst",
    retryConfig: {
      maxRetries: 5,
      retryDelayMs: 2000, // 2 seconds between retries
    },
  });

  bat.addTask({
    description: "Low priority task with long timeout and default retries",
    agentRole: "Research Assistant",
    priority: "low",
    timeoutMs: 60000, // 60 seconds
  });

  // Task with default configuration (medium priority, 30s timeout, 3 retries)
  bat.addTask({
    description: "Regular task with default settings",
    agentRole: "Research Assistant",
  });

  // Execute tasks (they will be executed in priority order with retry and timeout control)
  const results = await bat.kickoff();
  console.log("\nResultados das tarefas do Bat:");
  results.forEach((result, index) => {
    console.log(`\nTarefa ${index + 1}:`);
    console.log(result);
  });
}

// Run the main function
main().catch(console.error);
