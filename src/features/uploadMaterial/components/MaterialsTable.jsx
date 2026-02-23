import { Link as LinkIcon, Trash2, File } from "lucide-react";

export default function MaterialsTable({ materials }) {
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
              <th className="px-5 py-3 font-semibold text-gray-600">Typ</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Taggar</th>
              <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                Obligatorisk
              </th>
              <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                Åtgärder
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {materials.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-gray-500" colSpan={6}>
                  Inget material uppladdat ännu.
                </td>
              </tr>
            ) : (
              materials.map((item, index) => {
                const isLink = item?.type === "link";
                const displayName = isLink ? item?.url : item?.fileName;

                return (
                  <tr
                    key={item?._id || `${displayName}-${index}`}
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
                          className="text-gray-700 truncate max-w-[220px]"
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
                      <span className="text-gray-600">{isLink ? "Länk" : "Fil"}</span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(item?.tags || []).length === 0 ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600"
                            >
                              {tag}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(item?.required)}
                        readOnly
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded accent-gray-900"
                        title="Vi kopplar detta när vi har PATCH för material"
                      />
                    </td>

                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        className="p-1.5 text-gray-300 cursor-not-allowed rounded-md"
                        title="Delete kommer när vi har backend-endpoint för att ta bort material"
                        disabled
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
    </section>
  );
}