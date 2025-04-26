/**
 * Simple logging utility for agent and task executions
 */
export class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  /**
   * Get the singleton instance of Logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log an agent action
   * @param agentRole Role of the agent
   * @param action Description of the action
   */
  public logAgentAction(agentRole: string, action: string): void {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] AGENT [${agentRole}]: ${action}`;
    this.logs.push(log);
    console.log(log);
  }

  /**
   * Log a task execution
   * @param taskDescription Description of the task
   * @param status Status of the execution (started/completed/failed)
   * @param result Optional result or error message
   */
  public logTaskExecution(
    taskDescription: string,
    status: "started" | "completed" | "failed",
    result?: string
  ): void {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] TASK [${status.toUpperCase()}]: ${taskDescription}${
      result ? `\nResult: ${result}` : ""
    }`;
    this.logs.push(log);
    console.log(log);
  }

  /**
   * Get all logs
   */
  public getLogs(): string[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }
}
