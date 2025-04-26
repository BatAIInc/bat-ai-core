import { Agent } from "../agents/Agent";
import { Task } from "../tasks/Task";

/**
 * Orchestrates multiple agents and tasks
 */
export class Bat {
  private readonly tasks: Task[] = [];

  constructor(private readonly agents: Agent[]) {}

  /**
   * Adds a new task to be executed
   * @param description Task description
   * @param agentRole Role of the agent that should execute the task
   * @returns The created task
   */
  public addTask(description: string, agentRole: string): Task {
    const agent = this.agents.find((a) => a.role === agentRole);
    if (!agent) {
      throw new Error(`No agent found with role: ${agentRole}`);
    }

    const task = new Task(description, agent);
    this.tasks.push(task);
    return task;
  }

  /**
   * Executes all tasks and returns their results
   * @returns Promise with an array of task results
   */
  public async kickoff(): Promise<string[]> {
    const results: string[] = [];

    for (const task of this.tasks) {
      try {
        const result = await task.run();
        results.push(result);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Task failed: ${error.message}`);
          results.push(`Task failed: ${error.message}`);
        } else {
          console.error("Task failed: Unknown error");
          results.push("Task failed: Unknown error");
        }
      }
    }

    return results;
  }
}
