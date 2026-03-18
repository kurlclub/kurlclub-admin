import { Badge } from '@kurlclub/ui-components';

import { formatTicketDateTime } from '@/lib/utils/ticket.utils';
import type { Message } from '@/types/ticket';

interface MessageThreadProps {
  messages: Message[];
}

export function MessageThread({ messages }: MessageThreadProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isClient = message.role === 'Client';
        return (
          <div
            key={message.id}
            className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                isClient
                  ? 'border-secondary-blue-400 bg-secondary-blue-600/60 text-white'
                  : 'border-primary-green-500/40 bg-primary-green-500/10 text-primary-green-100'
              } animate-in fade-in duration-150`}
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-secondary-blue-200">
                <span
                  className={
                    isClient
                      ? 'text-secondary-blue-200'
                      : 'text-primary-green-200'
                  }
                >
                  {message.author}
                </span>
                <span className="text-secondary-blue-400">|</span>
                <span className="text-secondary-blue-300">{message.role}</span>
                {message.isEmailNotification && (
                  <Badge
                    variant="secondary"
                    className="border border-secondary-blue-400/60 bg-secondary-blue-600/80 text-[10px] font-semibold"
                  >
                    Email
                  </Badge>
                )}
              </div>
              {message.isEmailNotification && message.emailSubject ? (
                <p className="mt-2 text-xs text-secondary-blue-200">
                  Subject: {message.emailSubject}
                </p>
              ) : null}
              <p className="mt-2 whitespace-pre-wrap text-sm text-white">
                {message.message}
              </p>
              <p className="mt-3 text-[11px] text-secondary-blue-300">
                {formatTicketDateTime(message.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
