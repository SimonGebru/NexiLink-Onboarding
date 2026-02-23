import { Link } from "react-router-dom";

export default function FooterActions({ programId, onCancel }) {
  return (
    <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
      <button
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Avbryt
      </button>

      <Link to={`/programs/${programId}/checklist`}>
        <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
          Fortsätt till checklistbyggaren
        </button>
      </Link>
    </div>
  );
}