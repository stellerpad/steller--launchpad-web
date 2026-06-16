import { Check } from 'lucide-react';
import { cn } from '@/lib/format';

interface Step {
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={index} className="flex items-start space-x-3">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
              isCompleted && 'bg-primary border-primary text-primary-foreground',
              isCurrent && 'border-primary text-primary bg-background',
              !isCompleted && !isCurrent && 'border-muted text-muted-foreground'
            )}>
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'text-sm font-medium',
                isCurrent && 'text-foreground',
                !isCurrent && 'text-muted-foreground'
              )}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}