import { Agent } from "../agents/Agent";
import { Task } from "../tasks/Task";
import { Logger } from "../utils/Logger";

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
   * Executes all tasks in parallel and returns their results
   * @returns Promise with an array of task results
   */
  public async kickoff(): Promise<string[]> {
    const logger = Logger.getInstance();
    const taskPromises = this.tasks.map(async (task) => {
      logger.logTaskExecution(task.description, "started");
      try {
        const result = await task.run();
        logger.logTaskExecution(task.description, "completed", result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.logTaskExecution(task.description, "failed", errorMessage);
        return `Task failed: ${errorMessage}`;
      }
    });

    return Promise.all(taskPromises);
  }
}
