import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-rose-50/50 border border-rose-200 rounded-3xl max-w-md mx-auto my-8">
      <div className="p-3.5 bg-rose-100 text-rose-600 rounded-2xl mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Retry
        </Button>
      )}
    </div>
  );
};
