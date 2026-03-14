'use client';

import { useRouter } from 'next/navigation';

import { Badge, Button, Spinner } from '@kurlclub/ui-components';
import { ChevronLeft } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { useMember } from '@/services/members';

interface MemberDetailsPageProps {
  identifier: string;
}

const formatValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div>
    <p className="text-xs text-secondary-blue-300">{label}</p>
    <p className="text-sm text-white">{formatValue(value)}</p>
  </div>
);

export function MemberDetailsPage({ identifier }: MemberDetailsPageProps) {
  const router = useRouter();
  const { data: member, isLoading } = useMember(identifier);

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Member Details</h1>
              <p className="text-sm text-secondary-blue-200 mt-1">
                Identifier: {identifier}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : member ? (
          <div className="space-y-6">
            {/* Profile */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
                  Profile
                </h2>
                {member.status && <Badge variant="info">{member.status}</Badge>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Name" value={member.name} />
                <DetailItem label="Phone" value={member.phone} />
                <DetailItem label="Email" value={member.email} />
                <DetailItem label="DOB" value={member.dob} />
                <DetailItem label="Gender" value={member.gender} />
                <DetailItem label="Blood Group" value={member.bloodGroup} />
              </div>
            </section>

            {/* Membership */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
                  Membership
                </h2>
                {member.feeStatus && (
                  <Badge variant="info">{member.feeStatus}</Badge>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Package" value={member.membershipPlanId} />
                <DetailItem
                  label="Days Remaining"
                  value={
                    typeof member.daysRemaining === 'number'
                      ? String(member.daysRemaining)
                      : '—'
                  }
                />
                <DetailItem
                  label="Buffer Days"
                  value={
                    typeof member.bufferDaysRemaining === 'number'
                      ? String(member.bufferDaysRemaining)
                      : '—'
                  }
                />
                <DetailItem
                  label="Amount Paid"
                  value={
                    typeof member.amountPaid === 'number'
                      ? `₹${member.amountPaid}`
                      : '—'
                  }
                />
              </div>
            </section>

            {/* Fitness */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
                Fitness
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Height" value={member.height} />
                <DetailItem label="Weight" value={member.weight} />
                <DetailItem label="Trainer" value={member.personalTrainer} />
                <DetailItem label="Goal" value={member.fitnessGoal} />
              </div>
            </section>

            {/* Emergency Contact */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
                Emergency Contact
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem label="Name" value={member.emergencyContactName} />
                <DetailItem
                  label="Phone"
                  value={member.emergencyContactPhone}
                />
                <DetailItem
                  label="Relation"
                  value={member.emergencyContactRelation}
                />
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-20 text-secondary-blue-300">
            Member not found.
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
