/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * Interface for structured log data
 */
interface LogData {
  message: string;
  level: LogLevel;
  timestamp: string;
  module: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Helper function to make BigInt serializable
 */
function serializeBigInt(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }
  return obj;
}

/**
 * Creates a logger instance for a specific module
 */
export class Logger {
  constructor(private readonly module: string) {}

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const logData: LogData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      module: this.module,
      context: context ? serializeBigInt(context) : undefined,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: serializeBigInt(error.cause)
      } as Error : undefined
    };

    // In production, you might want to send this to a logging service
    // For now, we'll format it nicely for console output
    const output = this.formatLog(logData);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
    }
  }

  private formatLog(logData: LogData): string {
    const base = `[${logData.timestamp}] [${logData.level}] [${logData.module}] ${logData.message}`;
    
    const parts = [base];

    if (logData.context) {
      parts.push('\nContext:', JSON.stringify(serializeBigInt(logData.context), null, 2));
    }

    if (logData.error) {
      parts.push('\nError:', logData.error.message);
      if (logData.error.stack) {
        parts.push('\nStack:', logData.error.stack);
      }
      if (logData.error.cause) {
        parts.push('\nCause:', JSON.stringify(serializeBigInt(logData.error.cause), null, 2));
      }
    }

    return parts.join(' ');
  }
} 