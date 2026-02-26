import { useEffect, useMemo, useState } from "react";
import { Link as LinkIcon, Trash2, File } from "lucide-react";

function getFileTypeLabel(item) {
  if (item?.type === "link") return "Länk";

  const mime = (item?.mimeType || "").toLowerCase();
  const name = (item?.fileName || item?.title || "").toLowerCase();

  
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("word") || mime.includes("msword") || mime.includes("officedocument.wordprocessingml"))
    return "Word";
  if (mime.includes("excel") || mime.includes("spreadsheetml")) return "Excel";
  if (mime.includes("powerpoint") || mime.includes("presentationml")) return "PowerPoint";
  if (mime.startsWith("image/")) return "Bild";
  if (mime.startsWith("text/")) return "Text";

  // Fallback på filändelse
  const ext = name.split(".").pop();
  if (!ext || ext === name) return "Fil";
  return ext.toUpperCase();
}

export default function MaterialsTable({
  programId,
  materials = [],
  onDelete,
}) {
  // (inte sparat i backend än)
  const [requiredMap, setRequiredMap] = useState({});

  useEffect(() => {
    const next = {};
    for (const m of materials) {
      if (m?._id) next[m._id] = Boolean(m.required);
    }
    setRequiredMap(next);
  }, [materials]);

  const rows = useMemo(() => {
    return (materials || []).map((item, index) => {
      const isLink = item?.type === "link";
      const displayName = isLink ? item?.url : item?.fileName;
      return { item, index, isLink, displayName };
    });
  }, [materials]);

  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Uppladdade material
      </h3>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-semibold text-gray-600">Fil/Länk</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Titel</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Filtyp</th>
              <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                Obligatorisk
              </th>
              <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                Åtgärder
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-gray-500" colSpan={5}>
                  Inget material uppladdat ännu.
                </td>
              </tr>
            ) : (
              rows.map(({ item, index, isLink, displayName }) => {
                const key = item?._id || `${displayName}-${index}`;
                const typeLabel = getFileTypeLabel(item);

                return (
                  <tr
                    key={key}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {isLink ? (
                          <LinkIcon size={18} className="text-gray-400 flex-shrink-0" />
                        ) : (
                          <File size={18} className="text-gray-400 flex-shrink-0" />
                        )}
                        <span
                          className="text-gray-700 truncate max-w-[260px]"
                          title={displayName}
                        >
                          {displayName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <span className="text-gray-700">
                        {item?.title || (isLink ? "Länk" : "Fil")}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span className="text-gray-700">{typeLabel}</span>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(requiredMap[item?._id])}
                        onChange={(e) => {
                          const id = item?._id;
                          if (!id) return;
                          setRequiredMap((prev) => ({ ...prev, [id]: e.target.checked }));
                        }}
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded accent-gray-900"
                        title="UI-only just nu (sparas inte än)"
                      />
                    </td>

                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (!item?._id) return;
                          const ok = window.confirm("Ta bort detta material?");
                          if (!ok) return;
                          onDelete?.(item._id);
                        }}
                        disabled={!onDelete || !item?._id}
                        className={[
                          "p-1.5 rounded-md transition-colors",
                          onDelete
                            ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-300 cursor-not-allowed",
                        ].join(" ")}
                        title="Ta bort"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Optional: lite debug-info */}
      {/* <pre className="text-xs text-gray-400 mt-2">programId: {programId}</pre> */}
    </section>
  );
}