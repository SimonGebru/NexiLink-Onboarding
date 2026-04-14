import Stepper from "../../../components/ui/Stepper";

const programSteps = [
  { label: "Detaljer" },
  { label: "Material" },
  { label: "Checklista" },
  { label: "Klar" },
];

export default function CreateProgramHeader() {
  return (
    <div className="pt-4 text-center space-y-8">
      <Stepper steps={programSteps} currentStep={0} />

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
          Skapa nytt onboardingprogram
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500">
          Program kan återanvändas för flera nyanställda.
        </p>
      </div>
    </div>
  );
}