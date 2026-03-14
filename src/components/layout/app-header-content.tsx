'use client';

import type { ChangeEvent } from 'react';

import { getGreeting } from '@kurlclub/ui-components';

import {
  API_ENV_OPTIONS,
  getApiEnvironmentLabel,
  normalizeApiEnvironment,
} from '@/lib/api-environment';
import { useApiEnvironment } from '@/providers/api-environment-provider';
import { useAuth } from '@/providers/auth-provider';

export function AppHeaderContent() {
  const { user } = useAuth();
  const { environment, setEnvironment } = useApiEnvironment();

  const userName = user?.userName || user?.userEmail || 'User';

  const handleEnvironmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = normalizeApiEnvironment(event.target.value);
    setEnvironment(next);
  };

  return (
    <>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-sm font-medium leading-normal text-secondary-blue-400">
          Hey, {userName}
        </span>
        <span className="text-base font-semibold text-white">
          {getGreeting()}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <label htmlFor="api-environment" className="sr-only">
          API Environment
        </label>
        <div className="relative">
          <select
            id="api-environment"
            className="h-11 min-w-42.5 appearance-none rounded-lg border border-primary-blue-300/60 bg-linear-to-r from-secondary-blue-500 via-secondary-blue-500 to-primary-blue-400 px-4 pr-10 text-sm font-semibold text-white outline-hidden transition hover:border-primary-green-500/80 focus-visible:border-primary-blue-300/60"
            value={environment}
            onChange={handleEnvironmentChange}
          >
            {API_ENV_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-black">
                {getApiEnvironmentLabel(option)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/80">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
