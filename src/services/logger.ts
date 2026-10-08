/**
 * Production-ready Structured Logger for Buzzing Brain
 * Ensures clean formatting and avoids console clutter in production.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogContext {
  [key: string]: unknown;
}

class ProductionLogger {
  private isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  private formatMessage(level: LogLevel, namespace: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] [${namespace}]: ${message}${contextStr}`;
  }

  debug(namespace: string, message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('DEBUG', namespace, message, context));
    }
  }

  info(namespace: string, message: string, context?: LogContext) {
    console.info(this.formatMessage('INFO', namespace, message, context));
  }

  warn(namespace: string, message: string, context?: unknown) {
    const contextObj = context instanceof Error ? { error: context.message } : (context as LogContext);
    console.warn(this.formatMessage('WARN', namespace, message, contextObj));
  }

  error(namespace: string, message: string, error?: unknown, context?: LogContext) {
    const errorDetails = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack?.split('\n').slice(0, 3).join('\n') }
      : error;
    console.error(this.formatMessage('ERROR', namespace, message, { ...context, error: errorDetails }));
  }
}

export const logger = new ProductionLogger();
