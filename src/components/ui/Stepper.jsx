export default function Stepper({ steps = [], currentStep = 0 }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center min-w-[64px] sm:min-w-[88px]">
              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold border transition-colors",
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "bg-blue-600/10 border-blue-600 text-blue-600"
                    : "bg-slate-100 border-slate-200 text-slate-500",
                ].join(" ")}
              >
                {index + 1}
              </div>

              <span
                className={[
                  "mt-2 text-xs sm:text-sm font-medium text-center",
                  isActive || isCompleted ? "text-slate-900" : "text-slate-500",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <div className="mx-2 sm:mx-4 h-px w-8 sm:w-16 bg-slate-200" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}