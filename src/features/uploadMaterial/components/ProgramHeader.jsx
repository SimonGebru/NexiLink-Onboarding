export default function ProgramHeader({ loadingProgram, programError, program }) {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Uppladdning av material
      </h1>

      {loadingProgram ? (
        <p className="text-gray-500">Hämtar program…</p>
      ) : programError ? (
        <p className="text-red-600">{programError}</p>
      ) : (
        <div className="space-y-1">
          <p className="text-gray-700">
            Program: <span className="font-semibold">{program?.name}</span>
          </p>
          {program?.description ? (
            <p className="text-gray-500">{program.description}</p>
          ) : (
            <p className="text-gray-500">
              Ladda upp och hantera filer samt länkar för ditt onboardingprogram.
            </p>
          )}
        </div>
      )}
    </div>
  );
}