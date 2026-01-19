import { BadgeCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChecklistBuilder() {
  const navigate = useNavigate();
  const tasks = [
    { id: 1, title: "Läs igenom anställningsavtalet" },
    { id: 2, title: "Ställ in din e-post och kalender" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-10">
        <h1 className="font-bold text-2xl">Checklistbyggare</h1>
      </header>

      {/* Confirmation */}
      <aside className="border-2 border-gray-200 px-4 ">
        <h3 className="flex items-center gap-1 text-lg font-semibold text-gray-900 mt-2">
          <BadgeCheck /> Klart!
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Programmet har en checklista kopplad.
        </p>
      </aside>

      {/* Cards */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Välj hur du vill bygga din checklista
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card ett */}
          <li className="border-2 border-gray-200 rounded-lg p-6">
            <article>
              <h3 className="font-semibold text-gray-900 mb-2">
                Manuell checklistbyggare
              </h3>
              <p className="text-sm mb-3 text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
                distinctio incidunt quisquam laboriosam earum dolorem?
              </p>
              <p className="text-sm mb-6 text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio, numquam voluptate et quos aliquam eos.
              </p>
              <button className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
                Välj
              </button>
            </article>
          </li>

          {/* Card två */}
          <li className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Mallbaserad: Startmall
            </h3>
            <p className="text-sm mb-3 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Obcaecati animi nobis culpa non laborum voluptate?
            </p>
            <p className="text-sm mb-6 text-gray-500">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum
              sapiente iste eius vero tempore error?
            </p>
            <button className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              Välj
            </button>
          </li>

          {/* Card tre */}
          <li className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Autogenerera enkel punktlista
            </h3>
            <p className="text-sm mb-3 text-gray-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id
              fugiat, voluptates saepe deserunt molestiae vitae.
            </p>
            <p className="text-sm mb-6 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo
              ipsa excepturi est dolores at dolorem!
            </p>
            <button className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              Välj
            </button>
          </li>
        </ul>
      </section>

      {/* Lägg till och redigera */}
      <section className="w-full bg-white p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-8">
          Lägg till och redigera uppgifter
        </h3>

        {/* Uppgifter */}
        <section className="border-t border-gray-200">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-5 border-b border-gray-200"
            >
              <span className="text-gray-700 font-medium">{task.title}</span>
              <button className="text-gray-400 text-sm hover:text-slate-900">
                <Plus />
              </button>
            </div>
          ))}
        </section>

        {/* Footer btns */}
        <div className="mt-6 flex ">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <span className="text-lg leading-none">+</span>
            Lägg till uppgift
          </button>
        </div>

        <div className="mt-12 flex items-center justify-end gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Avbryt
          </button>

          <button
  onClick={() => navigate("/onboarding/assign")}
  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
>
  Spara checklista
</button>
        </div>
      </section>
    </div>
  );
}
