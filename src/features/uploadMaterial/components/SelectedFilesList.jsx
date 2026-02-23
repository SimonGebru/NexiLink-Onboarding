export default function SelectedFilesList({ selectedFiles, onRemove }) {
  if (selectedFiles.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Valda filer</p>
        <p className="text-xs text-gray-500">{selectedFiles.length} st</p>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          {selectedFiles.map((file, idx) => (
            <li
              key={`${file.name}-${file.size}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
              >
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}