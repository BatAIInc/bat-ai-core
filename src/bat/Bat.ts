import { Agent } from "../agents/Agent";
import { Task, TaskPriority, TaskRetryConfig } from "../tasks/Task";
import { Logger } from "../utils/Logger";

/**
 * Interface for task creation parameters
 */
export interface TaskParams {
  description: string;
  agentRole: string;
  priority?: TaskPriority;
  timeoutMs?: number;
  retryConfig?: TaskRetryConfig;
}

/**
 * Orchestrates multiple agents and tasks
 */
export class Bat {
  private readonly tasks: Task[] = [];

  constructor(private readonly agents: Agent[]) {}

  /**
   * Adds a new task to be executed
   * @param params Task parameters
   * @returns The created task
   */
  public addTask(params: TaskParams): Task {
    const agent = this.agents.find((a) => a.role === params.agentRole);
    if (!agent) {
      throw new Error(`No agent found with role: ${params.agentRole}`);
    }

    const task = new Task(
      params.description,
      agent,
      params.priority ?? "medium",
      params.timeoutMs,
      params.retryConfig
    );
    this.tasks.push(task);
    return task;
  }

  /**
   * Gets the priority weight for a task
   * @param priority Task priority
   * @returns Numeric weight for sorting
   */
  private getPriorityWeight(priority: TaskPriority): number {
    const weights: Record<TaskPriority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    return weights[priority];
  }

  /**
   * Sorts tasks by priority (high to low)
   */
  private sortTasksByPriority(): void {
    this.tasks.sort((a, b) => {
      const weightA = this.getPriorityWeight(a.getPriority());
      const weightB = this.getPriorityWeight(b.getPriority());
      return weightB - weightA; // Sort in descending order (high to low)
    });
  }

  /**
   * Executes all tasks in priority order and returns their results.
   * Each task has a timeout control (default 30 seconds) to prevent infinite execution.
   * If a task exceeds its timeout, it will be cancelled and an error will be logged.
   *
   * @returns Promise with an array of task results
   */
  public async kickoff(): Promise<string[]> {
    const logger = Logger.getInstance();

    // Sort tasks by priority before execution
    this.sortTasksByPriority();

    const taskPromises = this.tasks.map(async (task) => {
      logger.logTaskExecution(
        task.description,
        "started",
        `Priority: ${task.getPriority()}`
      );
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
