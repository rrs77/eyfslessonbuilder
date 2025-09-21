// ============================================================================
// BASE SERVICE - Foundation for all service implementations
// ============================================================================

import { ApiResponse, SearchParams } from '../types';
import { ErrorHandler, ErrorFactory, AppError } from '../utils';
import { API_CONFIG } from '../constants';
import { isSupabaseConfigured } from '../config/supabase';

// Get Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// ============================================================================
// BASE SERVICE CLASS
// ============================================================================

export abstract class BaseService {
  protected baseUrl: string;
  protected timeout: number;

  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    this.timeout = timeout || API_CONFIG.TIMEOUT;
  }

  /**
   * Generic API request handler with error handling
   */
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Always try to make the API call - let the actual error handling deal with failures
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('Making API request to:', url);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      console.log('API Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        // Try to get the error details from the response body
        try {
          const errorData = await response.json();
          console.error('API Error details:', errorData);
        } catch (e) {
          console.error('Could not parse error response as JSON');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle 204 No Content responses (common for PATCH/PUT updates)
      if (response.status === 204) {
        console.log('API Response: 204 No Content (successful update)');
        return {
          data: null as T,
          error: null,
          success: true
        };
      }

      const data = await response.json();
      console.log('API Response data length:', Array.isArray(data) ? data.length : 'not array');
      return {
        data,
        error: null,
        success: true
      };
    } catch (error) {
      const appError = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(appError, `${this.constructor.name}.request`);
      
      return {
        data: null as T,
        error: appError.message,
        success: false
      };
    }
  }

  /**
   * GET request helper
   */
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search, {
      method: 'GET',
    });
  }

  /**
   * POST request helper
   */
  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request helper
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Handle API response and throw appropriate errors
   */
  protected handleResponse<T>(response: ApiResponse<T>): T {
    if (!response.success || response.error) {
      throw ErrorFactory.server(response.error || 'Unknown API error');
    }
    return response.data;
  }

  /**
   * Retry mechanism for failed requests
   */
  protected async retry<T>(
    operation: () => Promise<ApiResponse<T>>,
    maxAttempts: number = API_CONFIG.RETRY_ATTEMPTS,
    delay: number = API_CONFIG.RETRY_DELAY
  ): Promise<ApiResponse<T>> {
    let lastError: AppError | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        if (result.success) {
          return result;
        }
        lastError = ErrorFactory.server(result.error || 'Operation failed');
      } catch (error) {
        lastError = ErrorHandler.handleApiError(error);
      }

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError || ErrorFactory.server('Max retry attempts exceeded');
  }

  /**
   * Build search parameters for API requests
   */
  protected buildSearchParams(params: SearchParams): Record<string, any> {
    const searchParams: Record<string, any> = {
      q: params.query,
    };

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams[`filter[${key}]`] = value;
        }
      });
    }

    if (params.pagination) {
      const { page, limit, sortBy, sortOrder } = params.pagination;
      searchParams.page = page;
      searchParams.limit = limit;
      if (sortBy) {
        searchParams.sort = sortBy;
        if (sortOrder) {
          searchParams.order = sortOrder;
        }
      }
    }

    return searchParams;
  }
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export class ServiceFactory {
  private static services: Map<string, BaseService> = new Map();

  static register<T extends BaseService>(key: string, service: T): void {
    this.services.set(key, service);
  }

  static get<T extends BaseService>(key: string): T | undefined {
    return this.services.get(key) as T;
  }

  static clear(): void {
    this.services.clear();
  }
}

// ============================================================================
// SERVICE DECORATORS
// ============================================================================

export function Injectable(target: any) {
  // Mark class as injectable for dependency injection
  Reflect.defineMetadata('injectable', true, target);
}

export function Inject(serviceKey: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    // Mark parameter for dependency injection
    const existingInjections = Reflect.getMetadata('injections', target) || [];
    existingInjections.push({ index: parameterIndex, key: serviceKey });
    Reflect.defineMetadata('injections', existingInjections, target);
  };
}

