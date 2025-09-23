// ============================================================================
// ERROR UTILITIES - Following DRY principles
// ============================================================================

// ============================================================================
// ERROR TYPES
// ============================================================================

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class ValidationError extends Error implements AppError {
  public readonly type = ErrorType.VALIDATION;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'VALIDATION_ERROR', details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

export class AuthenticationError extends Error implements AppError {
  public readonly type = ErrorType.AUTHENTICATION;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'AUTH_ERROR', details?: any) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.details = details;
  }
}

export class AuthorizationError extends Error implements AppError {
  public readonly type = ErrorType.AUTHORIZATION;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'AUTHZ_ERROR', details?: any) {
    super(message);
    this.name = 'AuthorizationError';
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends Error implements AppError {
  public readonly type = ErrorType.NOT_FOUND;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'NOT_FOUND', details?: any) {
    super(message);
    this.name = 'NotFoundError';
    this.code = code;
    this.details = details;
  }
}

export class ConflictError extends Error implements AppError {
  public readonly type = ErrorType.CONFLICT;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'CONFLICT', details?: any) {
    super(message);
    this.name = 'ConflictError';
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Error implements AppError {
  public readonly type = ErrorType.NETWORK;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'NETWORK_ERROR', details?: any) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.details = details;
  }
}

export class ServerError extends Error implements AppError {
  public readonly type = ErrorType.SERVER;
  public readonly timestamp = new Date();
  public readonly code: string;

  constructor(message: string, code: string = 'SERVER_ERROR', details?: any) {
    super(message);
    this.name = 'ServerError';
    this.code = code;
    this.details = details;
  }
}

// ============================================================================
// ERROR FACTORY
// ============================================================================

export class ErrorFactory {
  static validation(message: string, code?: string, details?: any): ValidationError {
    return new ValidationError(message, code, details);
  }

  static authentication(message: string, code?: string, details?: any): AuthenticationError {
    return new AuthenticationError(message, code, details);
  }

  static authorization(message: string, code?: string, details?: any): AuthorizationError {
    return new AuthorizationError(message, code, details);
  }

  static notFound(message: string, code?: string, details?: any): NotFoundError {
    return new NotFoundError(message, code, details);
  }

  static conflict(message: string, code?: string, details?: any): ConflictError {
    return new ConflictError(message, code, details);
  }

  static network(message: string, code?: string, details?: any): NetworkError {
    return new NetworkError(message, code, details);
  }

  static server(message: string, code?: string, details?: any): ServerError {
    return new ServerError(message, code, details);
  }

  static fromError(error: Error): AppError {
    if (error instanceof ValidationError) return error;
    if (error instanceof AuthenticationError) return error;
    if (error instanceof AuthorizationError) return error;
    if (error instanceof NotFoundError) return error;
    if (error instanceof ConflictError) return error;
    if (error instanceof NetworkError) return error;
    if (error instanceof ServerError) return error;

    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      timestamp: new Date(),
      stack: error.stack
    };
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export class ErrorHandler {
  /**
   * Handle API errors and convert to appropriate AppError
   */
  static handleApiError(error: any): AppError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          return ErrorFactory.validation(message, 'BAD_REQUEST', error.response.data);
        case 401:
          return ErrorFactory.authentication(message, 'UNAUTHORIZED', error.response.data);
        case 403:
          return ErrorFactory.authorization(message, 'FORBIDDEN', error.response.data);
        case 404:
          return ErrorFactory.notFound(message, 'NOT_FOUND', error.response.data);
        case 409:
          return ErrorFactory.conflict(message, 'CONFLICT', error.response.data);
        case 500:
          return ErrorFactory.server(message, 'INTERNAL_SERVER_ERROR', error.response.data);
        default:
          return ErrorFactory.server(message, 'API_ERROR', error.response.data);
      }
    } else if (error.request) {
      // Network error
      return ErrorFactory.network('Network error occurred', 'NETWORK_ERROR', error.request);
    } else {
      // Other error
      return ErrorFactory.fromError(error);
    }
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.AUTHENTICATION:
        return 'Please log in to continue';
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action';
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found';
      case ErrorType.CONFLICT:
        return 'This action conflicts with existing data';
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again';
      case ErrorType.SERVER:
        return 'Server error. Please try again later';
      default:
        return 'An unexpected error occurred';
    }
  }

  /**
   * Log error for debugging
   */
  static logError(error: AppError, context?: string): void {
    const logData = {
      type: error.type,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      context,
      stack: error.stack
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', logData);
    } else {
      // In production, send to logging service
      console.error('App Error:', logData);
    }
  }
}

// ============================================================================
// ERROR BOUNDARY UTILITIES
// ============================================================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

export function createErrorBoundaryState(): ErrorBoundaryState {
  return {
    hasError: false,
    error: null
  };
}

// ============================================================================
// COMMON ERROR MESSAGES
// ============================================================================

export const ErrorMessages = {
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_URL: 'Please enter a valid URL',
    MIN_LENGTH: 'Must be at least {min} characters long',
    MAX_LENGTH: 'Must be no more than {max} characters long',
    INVALID_FORMAT: 'Invalid format'
  },
  
  AUTHENTICATION: {
    LOGIN_REQUIRED: 'Please log in to continue',
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please log in again'
  },
  
  AUTHORIZATION: {
    ACCESS_DENIED: 'You do not have permission to perform this action',
    ROLE_REQUIRED: 'This action requires a higher role',
    ADMIN_REQUIRED: 'This action requires administrator privileges'
  },
  
  NETWORK: {
    CONNECTION_ERROR: 'Unable to connect to the server',
    TIMEOUT: 'Request timed out. Please try again',
    OFFLINE: 'You appear to be offline. Please check your connection'
  },
  
  SERVER: {
    INTERNAL_ERROR: 'An internal server error occurred',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    MAINTENANCE: 'System is under maintenance. Please try again later'
  }
} as const;






