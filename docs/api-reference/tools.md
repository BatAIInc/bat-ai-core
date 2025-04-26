# Tools API Reference

This document provides detailed information about the BatTool class and its methods.

## Class: BatTool

The `BatTool` class is the base class for all tools in Bat AI Core.

### Constructor

```typescript
constructor(name: string, config: ToolConfig)
```

#### Parameters

| Parameter | Type       | Description                       |
| --------- | ---------- | --------------------------------- |
| name      | string     | The name of the tool              |
| config    | ToolConfig | Configuration object for the tool |

### Properties

#### name

```typescript
public readonly name: string
```

The name of the tool.

#### config

```typescript
public readonly config: ToolConfig
```

The tool configuration.

#### isEnabled

```typescript
public readonly isEnabled: boolean
```

Whether the tool is enabled.

### Methods

#### execute

```typescript
public async execute(input: string): Promise<string>
```

Executes the tool with the given input.

##### Parameters

| Parameter | Type   | Description          |
| --------- | ------ | -------------------- |
| input     | string | The input to process |

##### Returns

- `Promise<string>`: The result of the tool execution

##### Throws

- `Error`: If the tool execution fails

#### enable

```typescript
public enable(): void
```

Enables the tool.

#### disable

```typescript
public disable(): void
```

Disables the tool.

#### validate

```typescript
public validate(input: string): boolean
```

Validates the input before execution.

##### Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| input     | string | The input to validate |

##### Returns

- `boolean`: Whether the input is valid

## Types

### ToolConfig

```typescript
interface ToolConfig {
  enabled?: boolean; // Whether the tool is enabled
  timeout?: number; // Execution timeout in milliseconds
  retryCount?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries in milliseconds
  sandbox?: boolean; // Whether to run in sandbox mode
}
```

## Built-in Tools

### WebSearchTool

```typescript
class WebSearchTool extends BatTool {
  constructor(config: WebSearchConfig) {
    super("web_search", config);
  }

  async execute(query: string): Promise<string> {
    // Implementation
  }
}

interface WebSearchConfig extends ToolConfig {
  apiKey: string; // API key for the search service
  maxResults: number; // Maximum number of results
  safeSearch: boolean; // Whether to enable safe search
}
```

### CodeExecutionTool

```typescript
class CodeExecutionTool extends BatTool {
  constructor(config: CodeExecutionConfig) {
    super("code_execution", config);
  }

  async execute(code: string): Promise<string> {
    // Implementation
  }
}

interface CodeExecutionConfig extends ToolConfig {
  language: string; // Programming language
  timeout: number; // Execution timeout
  memoryLimit: number; // Memory limit in MB
}
```

### FileOperationsTool

```typescript
class FileOperationsTool extends BatTool {
  constructor(config: FileOperationsConfig) {
    super("file_operations", config);
  }

  async execute(operation: string): Promise<string> {
    // Implementation
  }
}

interface FileOperationsConfig extends ToolConfig {
  basePath: string; // Base path for operations
  allowedExtensions: string[]; // Allowed file extensions
  maxFileSize: number; // Maximum file size in bytes
}
```

## Creating Custom Tools

```typescript
class CustomTool extends BatTool {
  constructor(config: CustomToolConfig) {
    super("custom_tool", config);
  }

  async execute(input: string): Promise<string> {
    // Custom implementation
    return "result";
  }

  validate(input: string): boolean {
    // Custom validation
    return true;
  }
}

interface CustomToolConfig extends ToolConfig {
  // Custom configuration options
}
```

## Example Usage

```typescript
import { WebSearchTool, CodeExecutionTool } from "@bat-ai/core";

// Create tools
const searchTool = new WebSearchTool({
  apiKey: "your_api_key",
  maxResults: 5,
  safeSearch: true,
});

const codeTool = new CodeExecutionTool({
  language: "typescript",
  timeout: 5000,
  memoryLimit: 100,
});

// Execute tools
try {
  // Search the web
  const searchResults = await searchTool.execute("Bat AI Core documentation");
  console.log("Search results:", searchResults);

  // Execute code
  const codeResult = await codeTool.execute(`
    function sum(a: number, b: number): number {
      return a + b;
    }
    sum(1, 2);
  `);
  console.log("Code result:", codeResult);
} catch (error) {
  console.error("Tool execution failed:", error);
}
```

## Best Practices

1. **Tool Configuration**

   - Set appropriate timeouts
   - Configure retry mechanisms
   - Enable sandbox mode when needed
   - Set resource limits

2. **Error Handling**

   - Implement comprehensive error handling
   - Validate inputs
   - Handle timeouts gracefully
   - Log errors appropriately

3. **Security**

   - Validate all inputs
   - Use sandbox mode for risky operations
   - Implement access control
   - Monitor tool usage

4. **Performance**
   - Optimize tool execution
   - Implement caching when needed
   - Monitor resource usage
   - Handle concurrent requests
