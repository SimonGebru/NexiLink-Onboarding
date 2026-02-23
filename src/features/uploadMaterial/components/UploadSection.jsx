import { CloudUpload, FileText, Link as LinkIcon, Upload, Loader2 } from "lucide-react";
import SelectedFilesList from "./SelectedFilesList";

export default function UploadSection({
  fileInputRef,
  onChooseFilesClick,
  onFilesSelected,

  uploading,
  selectedFiles,
  onUpload,

  uploadError,
  uploadSuccess,

  onRemoveSelectedFile,
}) {
  return (
    <section className="mb-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Lägg till nya material
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Välj filer och ladda upp dem till programmet.
      </p>

      {uploadError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {uploadError}
        </div>
      ) : null}

      {uploadSuccess ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {uploadSuccess}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onChooseFilesClick}
        className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-50 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center group"
      >
        <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform">
          <CloudUpload className="text-gray-400 w-8 h-8" />
        </div>
        <span className="block text-gray-900 font-medium mb-1">
          Klicka för att välja filer
        </span>
        <span className="text-sm text-gray-400">
          PDF, DOCX, XLSX, bilder (enligt backend)
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onFilesSelected}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onChooseFilesClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText size={16} />
            Välj filer
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors"
            onClick={() => alert("Lägg till länk kommer när vi har backend för länkar")}
          >
            <LinkIcon size={16} />
            Lägg till länk
          </button>
        </div>

        <button
          type="button"
          onClick={onUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={
            selectedFiles.length === 0 ? "Välj filer först" : "Ladda upp valda filer"
          }
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploading ? "Laddar upp..." : `Ladda upp (${selectedFiles.length})`}
        </button>
      </div>

      <SelectedFilesList selectedFiles={selectedFiles} onRemove={onRemoveSelectedFile} />
    </section>
  );
}