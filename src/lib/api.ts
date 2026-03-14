import {
  API_ENV_HEADER,
  type ApiEnvironment,
  getStoredApiEnvironment,
  isProductionEnvironment,
} from '@/lib/api-environment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Params = Record<string, string | number | boolean>;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

type NonGetRequestGuard = (params: {
  method: string;
  url: string;
  environment: ApiEnvironment;
}) => Promise<boolean>;

let nonGetRequestGuard: NonGetRequestGuard | null = null;

export const setNonGetRequestGuard = (guard: NonGetRequestGuard | null) => {
  nonGetRequestGuard = guard;
};

const NON_GET_CONFIRM_SKIP_PATHS = new Set<string>(['/Auth/refresh-token']);

const inFlightControllers = new Set<AbortController>();

export const abortInFlightRequests = (reason = 'API environment changed') => {
  for (const controller of inFlightControllers) {
    controller.abort(reason);
  }
  inFlightControllers.clear();
};

const registerInFlightController = (controller: AbortController) => {
  inFlightControllers.add(controller);
  controller.signal.addEventListener(
    'abort',
    () => {
      inFlightControllers.delete(controller);
    },
    { once: true },
  );
};

const attachAbortSignal = (
  controller: AbortController,
  signal?: AbortSignal | null,
) => {
  if (!signal) return;
  if (signal.aborted) {
    controller.abort(signal.reason);
    return;
  }
  signal.addEventListener(
    'abort',
    () => {
      controller.abort(signal.reason);
    },
    { once: true },
  );
};

const createAbortError = (message: string) => {
  if (typeof DOMException !== 'undefined') {
    return new DOMException(message, 'AbortError');
  }
  const error = new Error(message);
  error.name = 'AbortError';
  return error;
};

const getPathnameFromUrl = (url: RequestInfo | URL) => {
  if (typeof url === 'string') {
    const [path] = url.split('?');
    return path;
  }
  if (url instanceof URL) {
    return url.pathname;
  }
  if (url instanceof Request) {
    return new URL(url.url).pathname;
  }
  return '';
};

const createIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const notifyCancelledRequest = async (message: string) => {
  if (typeof window === 'undefined') return;
  try {
    const { toast } = await import('sonner');
    toast.info(message);
  } catch (error) {
    console.warn('Failed to show cancellation toast:', error);
  }
};

const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to set ${key}:`, error);
  }
};

const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('appUser');
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};

const redirectToLogin = (): void => {
  if (typeof window === 'undefined') return;
  window.location.href = '/auth/login';
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    let requestController: AbortController | null = null;
    try {
      const refreshToken = getStorageItem('refreshToken');
      if (!refreshToken) {
        clearStorage();
        redirectToLogin();
        return null;
      }

      requestController = new AbortController();
      registerInFlightController(requestController);
      attachAbortSignal(requestController, AbortSignal.timeout(10000));

      const response = await fetch(`${API_BASE_URL}/Auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [API_ENV_HEADER]: getStoredApiEnvironment(),
        },
        body: JSON.stringify({ refreshToken }),
        signal: requestController.signal,
      });

      if (!response.ok) {
        clearStorage();
        redirectToLogin();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data?.data?.accessToken;
      const newRefreshToken = data?.data?.refreshToken;

      if (!newAccessToken || typeof newAccessToken !== 'string') {
        clearStorage();
        redirectToLogin();
        return null;
      }

      setStorageItem('accessToken', newAccessToken);

      if (newRefreshToken && typeof newRefreshToken === 'string') {
        setStorageItem('refreshToken', newRefreshToken);
      }

      if (typeof document !== 'undefined') {
        document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      }

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearStorage();
      redirectToLogin();
      return null;
    } finally {
      if (requestController) {
        inFlightControllers.delete(requestController);
      }
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

interface ExtendedRequestInit extends RequestInit {
  next?: { revalidate?: number; cache?: string };
  responseType?: 'json' | 'blob';
  skipAuth?: boolean;
  skipConfirm?: boolean;
  isRetry?: boolean;
}

const baseFetch: typeof fetch = async (url, options = {}) => {
  const { next, responseType, skipAuth, skipConfirm, isRetry, ...restOptions } =
    options as ExtendedRequestInit;
  const { headers: requestHeaders, ...fetchOptions } = restOptions;

  const isFormData = restOptions.body instanceof FormData;
  const accessToken = getStorageItem('accessToken');
  const environment = getStoredApiEnvironment();

  let userData = null;
  try {
    const encryptedUser = getStorageItem('appUser');
    if (encryptedUser) {
      const { decrypt } = await import('@/lib/crypto');
      const decryptedData = decrypt(encryptedUser);
      if (decryptedData) {
        userData = JSON.parse(decryptedData);
      }
    }
  } catch (error) {
    console.warn('Failed to get user data for headers:', error);
  }

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    [API_ENV_HEADER]: environment,
    ...(accessToken && !skipAuth
      ? { Authorization: `Bearer ${accessToken}` }
      : {}),
    ...(userData && !skipAuth
      ? {
          'X-User': String(userData.userId || ''),
          'X-Role': userData.userRole || '',
        }
      : {}),
  };

  if (requestHeaders instanceof Headers) {
    requestHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(requestHeaders)) {
    for (const [key, value] of requestHeaders) {
      headers[key] = value;
    }
  } else if (requestHeaders) {
    Object.assign(headers, requestHeaders);
  }

  const method = (fetchOptions.method || 'GET').toUpperCase();
  const urlString = typeof url === 'string' ? url : url.toString();
  const requestPath = getPathnameFromUrl(url);
  const shouldSkipConfirm =
    skipConfirm || NON_GET_CONFIRM_SKIP_PATHS.has(requestPath);

  if (method !== 'GET' && !shouldSkipConfirm) {
    if (!('Idempotency-Key' in headers)) {
      headers['Idempotency-Key'] = createIdempotencyKey();
    }
  }

  if (
    method !== 'GET' &&
    !shouldSkipConfirm &&
    isProductionEnvironment(environment)
  ) {
    const confirmRequest = nonGetRequestGuard
      ? nonGetRequestGuard({
          method,
          url: `${API_BASE_URL}${urlString}`,
          environment,
        })
      : typeof window !== 'undefined'
        ? Promise.resolve(
            window.confirm(
              `You are about to ${method} ${urlString} in ${environment}. Continue?`,
            ),
          )
        : Promise.resolve(true);

    const isAllowed = await confirmRequest;
    if (!isAllowed) {
      await notifyCancelledRequest('Request cancelled.');
      throw createAbortError('Request cancelled by user');
    }
  }

  const requestController = new AbortController();
  registerInFlightController(requestController);
  attachAbortSignal(requestController, fetchOptions.signal);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      headers,
      ...fetchOptions,
      signal: requestController.signal,
      next: {
        cache: next?.cache || 'no-store',
        ...next,
      },
    });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      await notifyCancelledRequest(
        'Request cancelled due to environment change.',
      );
    }
    throw error;
  } finally {
    inFlightControllers.delete(requestController);
  }

  if (
    response.status === 401 &&
    !skipAuth &&
    typeof window !== 'undefined' &&
    !isRetry
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return baseFetch(url, {
        ...options,
        isRetry: true,
      } as ExtendedRequestInit);
    }
    return response;
  }

  if (!response.ok) {
    let errorMessage = 'Unknown API error';
    let errorPayload:
      | {
          status?: string;
          message?: string;
          feature?: string;
        }
      | undefined;

    try {
      const responseText = await response.text();
      if (responseText) {
        try {
          const error = JSON.parse(responseText);
          errorPayload = error;
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = responseText;
        }
      }
    } catch (e) {
      console.error('Error reading response:', e);
    }

    const error = new Error(errorMessage) as Error & {
      response: { status: number };
      status?: string;
      feature?: string;
    };
    error.response = { status: response.status };
    if (errorPayload?.status) {
      error.status = errorPayload.status;
    }
    if (errorPayload?.feature) {
      error.feature = errorPayload.feature;
    }
    throw error;
  }

  if (response.status === 204) return;

  if (responseType === 'blob') {
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    return { blob, contentDisposition };
  }

  return response.json();
};

interface GetOptions extends ExtendedRequestInit {
  params?: Params;
}

export const api = {
  get: async <TResponse>(url: string, options?: GetOptions) => {
    const path = options?.params
      ? `${url}?${new URLSearchParams(options.params as Record<string, string>)}`
      : url;
    return baseFetch(path, options) as Promise<TResponse>;
  },
  post: async <TResponse>(
    url: string,
    data?: Record<string, unknown> | object | FormData,
    options?: ExtendedRequestInit,
  ) => {
    return baseFetch(url, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }) as Promise<TResponse>;
  },
  put: async <TResponse>(
    url: string,
    data?: Record<string, unknown> | object | FormData,
    options?: ExtendedRequestInit,
  ) => {
    return baseFetch(url, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }) as Promise<TResponse>;
  },
  patch: async <TResponse>(
    url: string,
    data?: Record<string, unknown>,
    options?: ExtendedRequestInit,
  ) => {
    return baseFetch(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }) as Promise<TResponse>;
  },
  delete: async (
    url: string,
    data?: Record<string, unknown>,
    options?: ExtendedRequestInit,
  ) => {
    return baseFetch(url, {
      ...options,
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  },
};
