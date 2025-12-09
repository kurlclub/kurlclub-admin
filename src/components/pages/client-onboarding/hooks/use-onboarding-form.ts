'use client';

import type React from 'react';
/**
 * Hook for managing individual step form state and validation
 * Encapsulates form logic with validation integration
 */

import { useCallback, useState } from 'react';

import type { ValidationError } from '../types';

interface UseOnboardingFormOptions<T> {
  onValidate?: (data: T) => ValidationError[];
}

export function useOnboardingForm<T extends object>(
  initialData: T,
  options?: UseOnboardingFormOptions<T>,
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;
      setData((prev) => ({
        ...prev,
        [name]:
          type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
      // Clear error for this field when user starts typing
      setErrors((prev) => prev.filter((err) => err.field !== name));
    },
    [],
  );

  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    setData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setErrors((prev) => prev.filter((err) => err.field !== fieldName));
  }, []);

  const validate = useCallback(async () => {
    setIsValidating(true);
    const validationErrors = options?.onValidate?.(data) ?? [];
    setErrors(validationErrors);
    setIsValidating(false);
    return validationErrors.length === 0;
  }, [data, options]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors([]);
  }, [initialData]);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => [
      ...prev.filter((err) => err.field !== field),
      { field, message },
    ]);
  }, []);

  return {
    data,
    setData,
    errors,
    setErrors,
    isValidating,
    handleChange,
    handleFieldChange,
    validate,
    reset,
    setFieldError,
  };
}
