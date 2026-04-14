import Stepper from "../../../components/ui/Stepper";

const programSteps = [
  { label: "Detaljer" },
  { label: "Material" },
  { label: "Checklista" },
  { label: "Klar" },
];

export default function ProgramHeader({ loadingProgram, programError, program }) {
  return (
    <div className="mb-10 space-y-8">
      <Stepper steps={programSteps} currentStep={1} />

      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
          Uppladdning av material
        </h1>

        {loadingProgram ? (
          <p className="text-slate-500">Hämtar program…</p>
        ) : programError ? (
          <p className="text-red-600">{programError}</p>
        ) : (
          <>
            <p className="text-sm sm:text-base text-slate-500">
              Program: <span className="font-semibold text-slate-700">{program?.name}</span>
            </p>

            {program?.description ? (
              <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500">
                {program.description}
              </p>
            ) : (
              <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500">
                Ladda upp och hantera filer samt länkar för ditt onboardingprogram.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}