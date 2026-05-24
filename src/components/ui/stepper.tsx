import { Check } from "lucide-react";
import type { ElementType } from "react";

export interface Step {
  number: number;
  label: string;
  icon: ElementType;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, completedSteps, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      {steps.map((s, idx) => {
        const isCompleted = completedSteps.has(s.number);
        const isCurrent = currentStep === s.number;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 cursor-pointer hover:bg-emerald-600"
                    : isCurrent
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-110"
                    : "bg-slate-100 text-slate-400 cursor-default"
                }`}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(s.number)}
                title={isClickable ? `Go back to step ${s.number}` : undefined}
              >
                {isCompleted ? <Check size={20} /> : <s.icon size={20} />}
              </button>
              <span
                className={`text-xs font-medium mt-2 text-center whitespace-nowrap ${
                  isCurrent || isCompleted ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 mx-3">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
