import { Agent } from "../agents/Agent";
import { Logger } from "../utils/Logger";

export type TaskPriority = "high" | "medium" | "low";

/**
 * Configuration for task retry behavior
 */
export interface TaskRetryConfig {
  maxRetries: number;
  retryDelayMs: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: TaskRetryConfig = {
  maxRetries: 3,
  retryDelayMs: 1000, // 1 second delay between retries
};

/**
 * Represents a task to be executed by an agent
 */
export class Task {
  private readonly logger: Logger;
  private retryCount: number = 0;

  constructor(
    public readonly description: string,
    private readonly agent: Agent,
    private readonly priority: TaskPriority = "medium",
    private readonly timeoutMs: number = 30000, // Default 30 seconds
    private readonly retryConfig: TaskRetryConfig = DEFAULT_RETRY_CONFIG
  ) {
    this.logger = Logger.getInstance();
  }

  /**
   * Gets the priority of the task
   */
  public getPriority(): TaskPriority {
    return this.priority;
  }

  /**
   * Creates a promise that rejects after the specified timeout
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise that rejects after timeout
   */
  private createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Task timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }

  /**
   * Delays execution for the specified time
   * @param ms Time to delay in milliseconds
   * @returns Promise that resolves after the delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Attempts to execute the task with retry logic
   * @returns Promise with the task result
   */
  private async attemptExecution(): Promise<string> {
    try {
      // Race between the task execution and the timeout
      const result = await Promise.race([
        this.agent.execute(this.description),
        this.createTimeoutPromise(this.timeoutMs),
      ]);
      return result;
    } catch (error) {
      this.retryCount++;

      // If we've reached max retries, throw the final error
      if (this.retryCount >= this.retryConfig.maxRetries) {
        throw error;
      }

      // Log the retry attempt
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.logTaskExecution(
        this.description,
        "retrying",
        `Attempt ${this.retryCount}/${this.retryConfig.maxRetries}: ${errorMessage}`
      );

      // Wait before retrying
      await this.delay(this.retryConfig.retryDelayMs);

      // Try again
      return this.attemptExecution();
    }
  }

  /**
   * Executes the task with retry logic and timeout control
   * @returns Promise with the task result
   */
  public async run(): Promise<string> {
    this.retryCount = 0; // Reset retry count before execution
    try {
      const result = await this.attemptExecution();
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `Task execution failed after ${this.retryCount} attempts: ${errorMessage}`
      );
    }
  }
}
