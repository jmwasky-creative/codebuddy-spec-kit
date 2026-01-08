/**
 * Error Handler Utility
 * Centralized error handling with logging and user feedback
 */
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', context = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends AppError {
  constructor(message, context = {}) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message, context = {}) {
    super(message, 'NETWORK_ERROR', context);
    this.name = 'NetworkError';
  }
}

export class GameError extends AppError {
  constructor(message, context = {}) {
    super(message, 'GAME_ERROR', context);
    this.name = 'GameError';
  }
}

/**
 * Error Logger
 */
class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  /**
   * Log an error
   */
  log(error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error instanceof AppError ? error : {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', logEntry);
    }

    // Persist to storage for debugging
    try {
      localStorage.setItem('errorLogs', JSON.stringify(this.logs.slice(-50)));
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
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('errorLogs');
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count = 10) {
    return this.logs.slice(-count);
  }
}

const errorLogger = new ErrorLogger();

/**
 * Handle errors
 */
export function handleError(error, context = {}) {
  let appError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(error.message, 'UNKNOWN_ERROR', {
      ...context,
      originalError: error.name,
      stack: error.stack
    });
  } else {
    appError = new AppError(String(error), 'UNKNOWN_ERROR', context);
  }

  errorLogger.log(appError);

  // Return user-friendly message
  return getUserFriendlyMessage(appError);
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(error) {
  const messages = {
    'VALIDATION_ERROR': 'Please check your input and try again.',
    'NETWORK_ERROR': 'Connection failed. Please check your internet connection.',
    'GAME_ERROR': 'Something went wrong in the game. Please try again.',
    'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.'
  };

  return {
    title: 'Error',
    message: error.message || messages[error.code] || messages['UNKNOWN_ERROR'],
    code: error.code,
    timestamp: error.timestamp
  };
}

/**
 * Async error handler wrapper
 */
export function withErrorHandling(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const handled = handleError(error);
      throw handled;
    }
  };
}

export { errorLogger };
export default { handleError, AppError, ValidationError, NetworkError, GameError, errorLogger };
