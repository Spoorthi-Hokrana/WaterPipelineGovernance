/**
 * Debug logging utilities for development and testing
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private currentLevel: LogLevel = LogLevel.DEBUG;

  constructor() {
    if (typeof window !== 'undefined') {
      // Store logs in localStorage for persistence
      this.loadStoredLogs();
    }
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('governance-logs', JSON.stringify(this.logs.slice(-100)));
      } catch (error) {
        // LocalStorage might be full
        console.warn('Could not store logs:', error);
      }
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(entry);
    }
  }

  private logToConsole(entry: LogEntry) {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.component}]`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.data, entry.error);
        break;
    }
  }

  private loadStoredLogs() {
    try {
      const stored = localStorage.getItem('governance-logs');
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        this.logs = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Could not load stored logs:', error);
    }
  }

  debug(component: string, message: string, data?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.DEBUG,
      component,
      message,
      data,
    });
  }

  info(component: string, message: string, data?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.INFO,
      component,
      message,
      data,
    });
  }

  warn(component: string, message: string, data?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.WARN,
      component,
      message,
      data,
    });
  }

  error(component: string, message: string, error?: Error, data?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.ERROR,
      component,
      message,
      error,
      data,
    });
  }

  // Contract-specific logging methods
  contractCall(component: string, method: string, params: any[], txHash?: string) {
    this.info(component, `Contract call: ${method}`, {
      method,
      params,
      txHash,
    });
  }

  contractEvent(component: string, eventName: string, args: any[], blockNumber?: number) {
    this.info(component, `Contract event: ${eventName}`, {
      eventName,
      args,
      blockNumber,
    });
  }

  userAction(component: string, action: string, userId?: string, data?: any) {
    this.info(component, `User action: ${action}`, {
      action,
      userId,
      data,
    });
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('governance-logs');
    }
  }

  // Get logs summary
  getSummary() {
    const summary = {
      total: this.logs.length,
      byLevel: {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
      },
      recent: this.logs.slice(-10),
    };

    this.logs.forEach(log => {
      switch (log.level) {
        case LogLevel.DEBUG:
          summary.byLevel.debug++;
          break;
        case LogLevel.INFO:
          summary.byLevel.info++;
          break;
        case LogLevel.WARN:
          summary.byLevel.warn++;
          break;
        case LogLevel.ERROR:
          summary.byLevel.error++;
          break;
      }
    });

    return summary;
  }
}

// Global logger instance
export const logger = new Logger();

// Development helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).governanceLogger = logger;
  (window as any).clearLogs = () => logger.clearLogs();
  (window as any).getLogs = () => logger.getLogs();
  (window as any).exportLogs = () => logger.exportLogs();
}

// Hook for React components
export function useLogger(component: string) {
  return {
    debug: (message: string, data?: any) => logger.debug(component, message, data),
    info: (message: string, data?: any) => logger.info(component, message, data),
    warn: (message: string, data?: any) => logger.warn(component, message, data),
    error: (message: string, error?: Error, data?: any) => logger.error(component, message, error, data),
    contractCall: (method: string, params: any[], txHash?: string) => 
      logger.contractCall(component, method, params, txHash),
    contractEvent: (eventName: string, args: any[], blockNumber?: number) => 
      logger.contractEvent(component, eventName, args, blockNumber),
    userAction: (action: string, userId?: string, data?: any) => 
      logger.userAction(component, action, userId, data),
  };
}
