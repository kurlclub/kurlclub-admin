export const API_ENV_STORAGE_KEY = 'apiEnvironment';
export const API_ENV_HEADER = 'X-Database';

export const API_ENV_OPTIONS = ['Dev', 'Prod'] as const;
export type ApiEnvironment = (typeof API_ENV_OPTIONS)[number];

export const DEFAULT_API_ENV: ApiEnvironment = 'Dev';

export const normalizeApiEnvironment = (
  value?: string | null,
): ApiEnvironment => {
  if (!value) return DEFAULT_API_ENV;
  const normalized = value.toLowerCase();
  if (normalized.startsWith('dev')) return 'Dev';
  if (normalized.startsWith('prod')) return 'Prod';
  const match = API_ENV_OPTIONS.find(
    (option) => option.toLowerCase() === normalized,
  );
  return match ?? DEFAULT_API_ENV;
};

export const isProductionEnvironment = (value?: string | null): boolean =>
  normalizeApiEnvironment(value) === 'Prod';

export const getApiEnvironmentLabel = (value: ApiEnvironment): string => {
  switch (value) {
    case 'Dev':
      return 'Development';
    case 'Prod':
      return 'Production';
    default:
      return value;
  }
};

export const getStoredApiEnvironment = (): ApiEnvironment => {
  if (typeof window === 'undefined') return DEFAULT_API_ENV;
  try {
    return normalizeApiEnvironment(localStorage.getItem(API_ENV_STORAGE_KEY));
  } catch {
    return DEFAULT_API_ENV;
  }
};

export const setStoredApiEnvironment = (value: ApiEnvironment): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(API_ENV_STORAGE_KEY, value);
  } catch (error) {
    console.error('Failed to set API environment:', error);
  }
};
