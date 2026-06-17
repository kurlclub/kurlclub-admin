'use client';

import { Button, Input, Textarea } from '@kurlclub/ui-components';
import { Plus, Trash2 } from 'lucide-react';
import {
  type Control,
  Controller,
  type FieldErrors,
  useFieldArray,
} from 'react-hook-form';

import type { BlogFormData } from '@/types/blog';

interface SectionCardProps {
  control: Control<BlogFormData>;
  index: number;
  onRemove: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
}

function SectionCard({ control, index, onRemove, errors }: SectionCardProps) {
  const {
    fields: paraFields,
    append: addPara,
    remove: removePara,
  } = useFieldArray({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `sections.${index}.paragraphs` as any,
  });

  const sectionError = errors?.[index];

  return (
    <div className="space-y-4 rounded-lg border border-secondary-blue-500  p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-secondary-blue-200">
          Section {index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Heading */}
      <Controller
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name={`sections.${index}.heading` as any}
        render={({ field }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Heading (optional)"
            placeholder="Section heading"
          />
        )}
      />

      {/* Paragraphs */}
      <div className="space-y-3">
        <p className="text-xs text-secondary-blue-300">
          Paragraphs <span className="text-red-400">*</span>
        </p>
        {paraFields.map((para, pIdx) => (
          <div key={para.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <Controller
                  control={control}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={`sections.${index}.paragraphs.${pIdx}` as any}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      label={`Paragraph ${pIdx + 1}`}
                      placeholder={`Paragraph ${pIdx + 1}`}
                      rows={3}
                    />
                  )}
                />
              </div>
              {paraFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-6 h-7 w-7 shrink-0 p-0 text-secondary-blue-400"
                  onClick={() => removePara(pIdx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {sectionError?.paragraphs?.[pIdx]?.message && (
              <p className="text-xs text-red-400">
                {sectionError.paragraphs[pIdx].message}
              </p>
            )}
          </div>
        ))}
        {sectionError?.paragraphs?.message && (
          <p className="text-xs text-red-400">
            {sectionError.paragraphs.message}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-secondary-blue-300 hover:text-white"
          onClick={() => addPara('')}
        >
          <Plus className="h-3 w-3" />
          Add Paragraph
        </Button>
      </div>

      {/* Quote */}
      <Controller
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name={`sections.${index}.quote` as any}
        render={({ field }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Pull Quote (optional)"
            placeholder="Pull quote text"
          />
        )}
      />
    </div>
  );
}

export interface BlogSectionBuilderProps {
  control: Control<BlogFormData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<BlogFormData>['sections'] | any;
}

export function BlogSectionBuilder({
  control,
  errors,
}: BlogSectionBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">
        Sections <span className="text-red-400">*</span>
      </h3>

      {fields.length === 0 && (
        <p className="text-sm italic text-secondary-blue-400">
          Add at least one section to the article.
        </p>
      )}

      {fields.map((field, index) => (
        <SectionCard
          key={field.id}
          control={control}
          index={index}
          onRemove={() => remove(index)}
          errors={errors}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => append({ heading: '', paragraphs: [''], quote: '' })}
      >
        <Plus className="h-4 w-4" />
        Add Section
      </Button>
    </div>
  );
}
