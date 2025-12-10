import type { ReactNode } from 'react';

interface StudioLayoutProps {
  title?: string;
  description?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  maxContentWidth?: 'default' | 'narrow' | 'wide';
}

export const StudioLayout = ({
  title,
  description,
  headerActions,
  children,
  maxContentWidth = 'default',
}: StudioLayoutProps) => {
  const getContentConstraints = () => {
    switch (maxContentWidth) {
      case 'narrow':
        return 'max-w-4xl mx-auto';
      case 'wide':
        return 'w-full';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="bg-background-dark h-full w-full min-w-0">
      <div className="w-full min-w-0 px-4 py-5 md:p-8">
        <div className="flex flex-col gap-6 w-full min-w-0">
          {title ||
            description ||
            (headerActions && (
              <div className="flex items-center justify-between flex-wrap gap-4 w-full min-w-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold truncate text-white">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-gray-400 mt-1">{description}</p>
                  )}
                </div>
                {headerActions && (
                  <div className="flex gap-2 shrink-0">{headerActions}</div>
                )}
              </div>
            ))}

          <div
            className={`flex-1 min-h-0 w-full min-w-0 ${getContentConstraints()}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
