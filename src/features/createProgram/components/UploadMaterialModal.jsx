import { CloudUpload, FileText, Link as LinkIcon, X } from "lucide-react";

export default function UploadMaterialModal({
  isOpen,
  onClose,
  saving,

  uploadError,
  onUploadAndContinue,

  fileInputRef,
  onChooseFilesClick,
  onFilesSelected,

  selectedFiles,
  onRemoveSelectedFile,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              Ladda upp material
            </h2>
            <p className="text-sm text-slate-500">
              Lägg till filer och länkar till onboardingprogrammet.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Stäng"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {uploadError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {uploadError}
            </div>
          ) : null}

          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Lägg till nya material
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Dra och släpp filer eller använd knapparna nedan för att ladda upp.
            </p>

            <button
              type="button"
              onClick={onChooseFilesClick}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center group"
            >
              <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform">
                <CloudUpload className="text-slate-400 w-8 h-8" />
              </div>
              <span className="block text-slate-900 font-medium mb-1">
                Dra och släpp filer här
              </span>
              <span className="text-sm text-slate-400">
                eller klicka för att välja
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={onFilesSelected}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onChooseFilesClick}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText size={16} />
                  Välj filer
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 bg-white transition-colors"
                  onClick={() => alert("Lägg till länk (kommer sen)")}
                >
                  <LinkIcon size={16} />
                  Lägg till länk
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Accepterade filtyper: PDF, DOCX, XLSX, bilder m.m.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Valda filer</p>
              <p className="text-xs text-slate-500">{selectedFiles.length} st</p>
            </div>

            <div className="p-4">
              {selectedFiles.length === 0 ? (
                <p className="text-sm text-slate-500">Inga filer valda ännu.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <li
                      key={`${file.name}-${file.size}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveSelectedFile(idx)}
                        className="text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                        disabled={saving}
                      >
                        Ta bort
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            disabled={saving}
          >
            Avbryt
          </button>

          <button
            type="button"
            onClick={onUploadAndContinue}
            className="h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
            title="Skapa program, ladda upp och fortsätt"
          >
            {saving ? "Laddar upp..." : "Ladda upp och fortsätt"}
          </button>
        </div>
      </div>
    </div>
  );
}