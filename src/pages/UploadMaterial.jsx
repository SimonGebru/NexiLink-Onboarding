import { useEffect, useState } from "react";
import {
  CloudUpload,
  FileText,
  Link as LinkIcon,
  Trash2,
  File,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";

export default function UploadMaterial() {
  const { id } = useParams(); // <-- programId från URL
  const navigate = useNavigate();

  // Program från backend
  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");

  // MOCK material tills backend-delen är klar
  const [materials, setMaterials] = useState([
    {
      id: 1,
      filename: "Företagspolicy 2024.pdf",
      title: "Företagspolicy 2024",
      type: "Policy",
      tags: ["HR", "Regler"],
      mandatory: false,
    },
    {
      id: 2,
      filename: "Introduktion till Nexilink.pptx",
      title: "Introduktion till Nexilink",
      type: "Introduktion",
      tags: ["Välkommen", "Företag"],
      mandatory: false,
    },
    {
      id: 3,
      filename: "Mall för reseräkning.docx",
      title: "Mall för reseräkning",
      type: "Mall",
      tags: ["Ekonomi", "Resor"],
      mandatory: false,
    },
    {
      id: 4,
      filename: "https://www.nexilink.com/kontakt",
      title: "Nexilink kontaktinfo",
      type: "Övrigt",
      tags: ["Extern", "Support"],
      mandatory: false,
      isLink: true,
    },
  ]);

  // Hämta programmet från backend
  useEffect(() => {
    let alive = true;

    async function loadProgram() {
      try {
        setLoadingProgram(true);
        setProgramError("");

        const data = await apiRequest(`/api/programs/${id}`, { method: "GET" });

        if (!alive) return;
        setProgram(data);
      } catch (err) {
        if (!alive) return;
        setProgramError(err?.message || "Kunde inte hämta programmet.");
      } finally {
        if (!alive) return;
        setLoadingProgram(false);
      }
    }

    if (!id) {
      setProgramError("Saknar program-ID i URL.");
      setLoadingProgram(false);
      return;
    }

    loadProgram();
    return () => {
      alive = false;
    };
  }, [id]);

  // Enkel “back/cancel”
  function handleCancel() {
    navigate("/onboarding");
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Uppladdning av material
        </h1>

        {/* Program-info */}
        {loadingProgram ? (
          <p className="text-gray-500">Hämtar program…</p>
        ) : programError ? (
          <p className="text-red-600">{programError}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-gray-700">
              Program:{" "}
              <span className="font-semibold">{program?.name}</span>
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

      {/* Upload sektion */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Lägg till nya material
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Dra och släpp filer eller använd knapparna nedan för att ladda upp.
        </p>

        {/* Dra fil */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-50 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center group">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform">
            <CloudUpload className="text-gray-400 w-8 h-8" />
          </div>
          <span className="block text-gray-900 font-medium mb-1">
            Dra och släpp filer här
          </span>
          <span className="text-sm text-gray-400">
            eller klicka för att välja
          </span>
        </div>

        {/* Knappar och info */}
        <div className="mt-4 flex gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText size={16} />
              Välj filer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              <LinkIcon size={16} />
              Lägg till länk
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Accepterade filtyper: PDF, DOCX, PPTX och externa länkar.
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Uppladdade material
        </h3>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-gray-600">
                  Fil/Länk
                </th>
                <th className="px-5 py-3 font-semibold text-gray-600">Titel</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Typ</th>
                <th className="px-5 py-3 font-semibold text-gray-600">
                  Taggar
                </th>
                <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                  Obligatorisk
                </th>
                <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                  Åtgärder
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {materials.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  {/* Filnamn */}
                  <td className="px-5 py-3 ">
                    <div className="flex items-center gap-3">
                      {item.isLink ? (
                        <LinkIcon
                          size={18}
                          className="text-gray-400 flex-shrink-0"
                        />
                      ) : (
                        <File size={18} className="text-gray-400 flex-shrink-0" />
                      )}
                      <span
                        className="text-gray-700 truncate max-w-[180px]"
                        title={item.filename}
                      >
                        {item.filename}
                      </span>
                    </div>
                  </td>

                  {/* Titel */}
                  <td className="px-5 py-3 ">
                    <input
                      type="text"
                      defaultValue={item.title}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
                    />
                  </td>

                  {/* Typ */}
                  <td className="px-5 py-3 ">
                    <select
                      defaultValue={item.type}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all cursor-pointer"
                    >
                      <option>Policy</option>
                      <option>Introduktion</option>
                      <option>Mall</option>
                      <option>Övrigt</option>
                    </select>
                  </td>

                  {/* Taggar */}
                  <td className="px-5 py-3 ">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Checkbox */}
                  <td className="px-5 py-3 text-center">
                    <input
                      type="checkbox"
                      defaultChecked={item.mandatory}
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer accent-gray-900"
                    />
                  </td>

                  {/* Trashcan */}
                  <td className="px-5 py-3 text-center">
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer btns */}
      <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Avbryt
        </button>

        {/* FIX: riktig route med id */}
        <Link to={`/programs/${id}/checklist`}>
          <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            Fortsätt till checklistbyggaren
          </button>
        </Link>
      </div>
    </div>
  );
}
