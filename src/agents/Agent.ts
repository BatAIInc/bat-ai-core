import { BatTool } from "@bat-ai/tools";
import { BaseMessage } from "@langchain/core/messages";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { BaseMemory } from "langchain/memory";

/**
 * Interface for LLM models that can be used by agents
 */
export interface LLMModel {
  invoke(prompt: string): Promise<BaseMessage>;
}

/**
 * Interface for memory implementations
 */
export interface AgentMemory extends BaseMemory {
  loadMemoryVariables(
    inputs: Record<string, any>
  ): Promise<Record<string, any>>;
  saveContext(
    inputs: Record<string, any>,
    outputs: Record<string, any>
  ): Promise<void>;
}

/**
 * Interface for task delegation
 */
export interface TaskDelegation {
  task: string;
  reason: string;
  targetAgentRole: string;
}

/**
 * Interface for agent configuration
 */
export interface AgentConfig {
  role: string;
  goal: string;
  backstory: string;
  model: BaseChatModel;
  memory?: AgentMemory;
  tools?: BatTool[];
  capabilities?: string[];
}

/**
 * Represents an intelligent agent with specific role, goal, and capabilities
 */
export class Agent {
  private readonly tools: BatTool[];
  private readonly memory?: AgentMemory;
  private readonly model: BaseChatModel;
  public readonly role: string;
  public readonly goal: string;
  public readonly backstory: string;
  public readonly capabilities: string[];

  constructor(config: AgentConfig) {
    this.role = config.role;
    this.goal = config.goal;
    this.backstory = config.backstory;
    this.model = config.model;
    this.memory = config.memory;
    this.tools = config.tools || [];
    this.capabilities = config.capabilities || [];
  }

  /**
   * Gets the available tools for this agent
   */
  public getAvailableTools(): BatTool[] {
    return this.tools;
  }

  /**
   * Uses a tool to perform a specific action
   * @param toolName Name of the tool to use
   * @param input Input parameters for the tool
   * @returns Promise with the tool's output
   */
  public async useTool(toolName: string, input: any): Promise<any> {
    const tool = this.tools.find((t) => t.schema.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    const result = await tool.execute(input);
    if (!result.success) {
      throw new Error(`Tool execution failed: ${result.error}`);
    }

    return result.result;
  }

  /**
   * Determines which tool to use for a given task
   * @param taskDescription Description of the task
   * @returns Promise with the selected tool and input parameters
   */
  private async selectTool(
    taskDescription: string
  ): Promise<{ tool: BatTool; input: any } | null> {
    const prompt = `
      You are a ${this.role}.
      Your goal is: ${this.goal}
      Your backstory: ${this.backstory}
      
      Available tools:
      ${this.tools
        .map(
          (tool) =>
            `- ${tool.schema.name}: ${tool.schema.description}
         Parameters: ${JSON.stringify(tool.schema.parameters)}`
        )
        .join("\n")}
      
      Task: ${taskDescription}
      
      Select the most appropriate tool and provide input parameters.
      Respond with a valid JSON object in this exact format (no markdown, no code blocks):
      {
        "tool": "tool_name",
        "input": {
          "param1": "value1",
          "param2": "value2"
        }
      }
    `;

    const response = await this.model.invoke(prompt);
    const responseText = response.content.toString().trim();

    try {
      // Remove any markdown code block indicators if present
      const cleanResponse = responseText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      const result = JSON.parse(cleanResponse);

      const selectedTool = this.tools.find(
        (t) => t.schema.name === result.tool
      );
      if (!selectedTool) {
        return null;
      }

      return {
        tool: selectedTool,
        input: result.input,
      };
    } catch (error) {
      console.error("Error parsing tool selection response:", error);
      console.error("Raw response:", responseText);
      return null;
    }
  }

  /**
   * Checks if the agent can handle a given task
   * @param taskDescription Description of the task
   * @returns Promise with boolean indicating if the agent can handle the task
   */
  public async canHandleTask(taskDescription: string): Promise<boolean> {
    const prompt = `
      You are a ${this.role}.
      Your goal is: ${this.goal}
      Your backstory: ${this.backstory}
      Your capabilities: ${this.capabilities.join(", ")}
      
      Task: ${taskDescription}
      
      Can you handle this task effectively? Answer with only "yes" or "no".
    `;

    const response = await this.model.invoke(prompt);
    return response.content.toString().toLowerCase().trim() === "yes";
  }

  /**
   * Determines if a task should be delegated and to which agent
   * @param taskDescription Description of the task
   * @param availableAgents List of available agents
   * @returns Promise with TaskDelegation or null if no delegation is needed
   */
  public async shouldDelegateTask(
    taskDescription: string,
    availableAgents: Agent[]
  ): Promise<TaskDelegation | null> {
    const prompt = `
      You are a ${this.role}.
      Your goal is: ${this.goal}
      Your backstory: ${this.backstory}
      Your capabilities: ${this.capabilities.join(", ")}
      
      Available agents:
      ${availableAgents
        .map((agent) => `- ${agent.role}: ${agent.capabilities.join(", ")}`)
        .join("\n")}
      
      Task: ${taskDescription}
      
      Should this task be delegated to another agent? If yes, provide:
      1. The reason for delegation
      2. The role of the most suitable agent
      
      Respond with a valid JSON object in this exact format (no markdown, no code blocks):
      {
        "shouldDelegate": true or false,
        "reason": "explanation of why delegation is needed",
        "targetAgentRole": "role of the agent to delegate to"
      }
    `;

    const response = await this.model.invoke(prompt);
    const responseText = response.content.toString().trim();

    try {
      // Remove any markdown code block indicators if present
      const cleanResponse = responseText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      const result = JSON.parse(cleanResponse);

      if (result.shouldDelegate) {
        return {
          task: taskDescription,
          reason: result.reason,
          targetAgentRole: result.targetAgentRole,
        };
      }

      return null;
    } catch (error) {
      console.error("Error parsing delegation response:", error);
      console.error("Raw response:", responseText);
      return null;
    }
  }

  /**
   * Executes a task using the agent's capabilities and tools
   * @param taskDescription Description of the task to be executed
   * @param availableAgents List of available agents for delegation
   * @returns Promise with the task result
   */
  public async execute(
    taskDescription: string,
    availableAgents: Agent[] = []
  ): Promise<string> {
    try {
      // First try to use a tool
      const toolSelection = await this.selectTool(taskDescription);
      if (toolSelection) {
        const result = await this.useTool(
          toolSelection.tool.schema.name,
          toolSelection.input
        );
        return JSON.stringify(result);
      }

      // If no suitable tool is found, check for delegation
      const canHandle = await this.canHandleTask(taskDescription);

      if (!canHandle && availableAgents.length > 0) {
        const delegation = await this.shouldDelegateTask(
          taskDescription,
          availableAgents
        );

        if (delegation) {
          const targetAgent = availableAgents.find(
            (agent) => agent.role === delegation.targetAgentRole
          );

          if (targetAgent) {
            return `Task delegated to ${
              targetAgent.role
            }:\n${await targetAgent.execute(taskDescription)}`;
          }
        }
      }

      // If no tool or delegation, use the default execution
      const prompt = this.buildPrompt(taskDescription);

      let previousContext: BaseMessage[] = [];
      if (this.memory) {
        const memoryVariables = await this.memory.loadMemoryVariables({});
        previousContext = memoryVariables.chat_history || [];
      }

      const enhancedPrompt = this.enhancePromptWithMemory(
        prompt,
        previousContext
      );

      const response = await this.model.invoke(enhancedPrompt);
      const result = response.content.toString();

      if (this.memory) {
        await this.memory.saveContext(
          { input: taskDescription },
          { output: result }
        );
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Agent execution failed: ${error.message}`);
      }
      throw new Error("Agent execution failed with unknown error");
    }
  }

  /**
   * Builds the prompt for the agent based on its properties and the task
   * @param taskDescription Description of the task
   * @returns Formatted prompt string
   */
  private buildPrompt(taskDescription: string): string {
    return `
      You are a ${this.role}.
      Your goal is: ${this.goal}
      Your backstory: ${this.backstory}
      
      Available tools: ${this.tools.map((tool) => tool.schema.name).join(", ")}
      
      Task: ${taskDescription}
      
      Please provide a detailed response to complete this task.
    `;
  }

  /**
   * Enhances the prompt with previous context from memory
   * @param prompt Original prompt
   * @param previousContext Previous conversation history
   * @returns Enhanced prompt with memory context
   */
  private enhancePromptWithMemory(
    prompt: string,
    previousContext: BaseMessage[]
  ): string {
    if (previousContext.length === 0) {
      return prompt;
    }

    const contextSummary = previousContext
      .map(
        (msg) =>
          `${msg._getType()}: ${
            typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content)
          }`
      )
      .join("\n");

    return `
      Previous Context:
      ${contextSummary}

      ${prompt}
    `;
  }
}
