'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FieldGrid,
  FieldStack,
  Form,
  KFormField,
  KFormFieldType,
  Sheet,
} from '@kurlclub/ui-components';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  type ClientFormData,
  type ClientSchemaInput,
  clientSchema,
} from '@/schemas/client.schema';
import type { Client } from '@/types/client';

interface ClientEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

/**
 * Edit Client Details (Super Admin only). UI shell — there is no client-update
 * endpoint yet, so submit is stubbed until the backend lands.
 */
export function ClientEditSheet({
  isOpen,
  onClose,
  client,
}: ClientEditSheetProps) {
  const form = useForm<ClientSchemaInput, unknown, ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      userName: client.userName ?? '',
      email: client.email ?? '',
      phoneNumber: client.phoneNumber ?? '',
    },
  });

  // Re-seed the form whenever the sheet is (re)opened for a client.
  useEffect(() => {
    if (isOpen) {
      form.reset({
        userName: client.userName ?? '',
        email: client.email ?? '',
        phoneNumber: client.phoneNumber ?? '',
      });
    }
  }, [isOpen, client, form]);

  const handleSubmit = (values: ClientFormData) => {
    // Stub: no client-update endpoint exists yet.
    void values;
    toast.info('Will be enabled once the backend is connected');
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Client"
      description="Update the client's profile details"
      width="md"
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="client-edit-form">
            Save Changes
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form id="client-edit-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldStack gap="lg">
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
                Client Details
              </h3>
              <FieldGrid columns={1} smColumns={2} gap="md">
                <KFormField
                  fieldType={KFormFieldType.INPUT}
                  control={form.control}
                  name="userName"
                  label="Name"
                  mandatory
                />
                <KFormField
                  fieldType={KFormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  mandatory
                />
                <KFormField
                  fieldType={KFormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phoneNumber"
                  label="Phone"
                />
              </FieldGrid>
            </section>
          </FieldStack>
        </form>
      </Form>
    </Sheet>
  );
}
