/**
 * Logger Utility
 * Centralized logging with different levels and storage
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

class Logger {
  constructor() {
    this.currentLevel = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
    this.logs = [];
    this.maxLogs = 200;
  }

  /**
   * Set log level
   */
  setLevel(level) {
    this.currentLevel = LOG_LEVELS[level] || level;
  }

  /**
   * Debug level log
   */
  debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }

  /**
   * Info level log
   */
  info(message, context = {}) {
    this.log('INFO', message, context);
  }

  /**
   * Warning level log
   */
  warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  /**
   * Error level log
   */
  error(message, context = {}) {
    this.log('ERROR', message, context);
  }

  /**
   * Internal log method
   */
  log(level, message, context) {
    if (LOG_LEVELS[level] < this.currentLevel) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      source: this._getCallerInfo()
    };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    this._consoleOutput(logEntry);

    // Persist important logs
    if (level === 'ERROR' || level === 'WARN') {
      this._persistLogs();
    }
  }

  /**
   * Get caller info for better debugging
   */
  _getCallerInfo() {
    try {
      const stack = new Error().stack;
      const lines = stack.split('\n');
      const match = lines[3]?.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        return {
          function: match[1],
          file: match[2],
          line: match[3],
          column: match[4]
        };
      }
    } catch (e) {
      // Ignore
    }
    return {};
  }

  /**
   * Output to console with appropriate styling
   */
  _consoleOutput(entry) {
    const styles = {
      DEBUG: 'color: #888',
      INFO: 'color: #2196F3',
      WARN: 'color: #FF9800',
      ERROR: 'color: #F44336; font-weight: bold;'
    };

    const prefix = `[${entry.timestamp}] [${entry.level}]`;
    const contextStr = Object.keys(entry.context).length > 0
      ? ` ${JSON.stringify(entry.context)}`
      : '';

    const sourceStr = entry.source.file
      ? `\n  at ${entry.source.file}:${entry.source.line}`
      : '';

    console.log(`%c${prefix} ${entry.message}${contextStr}${sourceStr}`, styles[entry.level]);
  }

  /**
   * Persist logs to localStorage
   */
  _persistLogs() {
    try {
      const recentLogs = this.logs.filter(
        l => l.level === 'ERROR' || l.level === 'WARN'
      ).slice(-50);

      localStorage.setItem('appLogs', JSON.stringify(recentLogs));
    } catch (e) {
      // Ignore storage errors
    }
  }

  /**
   * Get all logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level) {
    return this.logs.filter(l => l.level === level);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count = 20) {
    return this.logs.slice(-count);
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('appLogs');
  }

  /**
   * Export logs as text
   */
  exportLogs() {
    return this.logs
      .map(l => `[${l.timestamp}] [${l.level}] ${l.message} ${JSON.stringify(l.context)}`)
      .join('\n');
  }

  /**
   * Create performance logger
   */
  createPerformanceLogger(label) {
    const startTime = performance.now();

    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.debug(`${label} completed`, { duration: `${duration.toFixed(2)}ms` });
        return duration;
      }
    };
  }
}

// Singleton instance
const logger = new Logger();

export default logger;
