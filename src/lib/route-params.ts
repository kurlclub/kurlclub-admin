export const resolveRouteParams = async <T>(
  params: T | Promise<T>,
): Promise<T> => {
  return Promise.resolve(params);
};
