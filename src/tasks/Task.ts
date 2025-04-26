import { Agent } from "../agents/Agent";

/**
 * Represents a task to be executed by an agent
 */
export class Task {
  constructor(
    public readonly description: string,
    private readonly agent: Agent
  ) {}

  /**
   * Executes the task using the assigned agent
   * @returns Promise with the task result
   */
  public async run(): Promise<string> {
    try {
      return await this.agent.execute(this.description);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Task execution failed: ${error.message}`);
      }
      throw new Error("Task execution failed: Unknown error");
    }
  }
}
