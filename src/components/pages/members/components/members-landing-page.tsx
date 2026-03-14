'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Input } from '@kurlclub/ui-components';
import { Search } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

export function MembersLandingPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier.trim()) return;
    router.push(`/members/${identifier.trim()}`);
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-sm text-secondary-blue-200 mt-1">
            Search member profiles by identifier
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6"
        >
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                label="Member Identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Enter member identifier"
              />
            </div>
            <Button type="submit" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </form>

        <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/40 p-6 text-secondary-blue-200">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2">
            Tips
          </h2>
          <ul className="space-y-2 text-sm text-secondary-blue-200">
            <li>Use the member identifier provided by the gym.</li>
            <li>
              You can also browse members inside a specific gym from the Gyms
              module.
            </li>
          </ul>
        </div>
      </div>
    </StudioLayout>
  );
}
