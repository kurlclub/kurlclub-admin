export const STALE_5M = 1000 * 60 * 5;
export const STALE_30S = 1000 * 30;

export type ApiEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: {
    timestamp: string;
    apiVersion: string;
    traceId: string;
    requestId: string;
  };
};

export const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};
