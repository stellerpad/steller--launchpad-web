import { StepIndicator } from '@/components/ui/StepIndicator';

interface LaunchStepperProps {
  currentStep: number;
}

const LAUNCH_STEPS = [
  {
    title: 'Token Configuration',
    description: 'Basic token parameters and features'
  },
  {
    title: 'Vesting Setup',
    description: 'Optional vesting schedules'
  },
  {
    title: 'Airdrop Campaign',
    description: 'Optional airdrop distribution'
  },
  {
    title: 'Review & Deploy',
    description: 'Confirm and launch your token'
  }
];

export function LaunchStepper({ currentStep }: LaunchStepperProps) {
  return (
    <div className="w-full max-w-sm">
      <StepIndicator steps={LAUNCH_STEPS} currentStep={currentStep} />
    </div>
  );
}